import { db } from "@/db";
import { EmailStatus, apiKeys, emails } from "@/db/schema";
import { hash } from "@/lib/crypto-helpers";
import { ratelimit } from "@/lib/upstash-ratelimit";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // This header only works on vercel deployments
  const ip = request.headers.get("x-forwarded-for") ?? "";
  const { success, reset, limit, remaining } = await ratelimit.limit(ip);
  const waitTime = Math.floor((reset - Date.now()) / 1000);

  if (!success) {
    return NextResponse.json(
      {
        statusCode: 429,
        message:
          "Too many requests. Please limit the number of requests per second.",
        name: "rate_limit_exceeded",
      },
      {
        status: 429,
        headers: {
          "ratelimit-limit": String(limit),
          "ratelimit-remaining": String(remaining),
          "ratelimit-reset": String(waitTime),
          "retry-after": String(waitTime),
        },
      },
    );
  }

  const emailId = params.id;

  const headersList = headers();
  const auth = headersList.get("Authorization");
  if (!auth) {
    return NextResponse.json(
      {
        statusCode: 401,
        message: "Missing API Key",
        name: "missing_api_key",
      },
      {
        status: 401,
      },
    );
  }

  const apiKey = auth.split(" ")[1];
  const hashedApiKey = hash(apiKey);

  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.apiKey, hashedApiKey),
  });

  if (!apiKeyRecord) {
    return NextResponse.json(
      {
        statusCode: 403,
        message: "API key is invalid",
        name: "invalid_api_Key",
      },
      {
        status: 403,
      },
    );
  }

  const email = await db.query.emails.findFirst({
    where: and(eq(emails.id, emailId), eq(emails.userId, apiKeyRecord.userId)),
    with: {
      recipients: {
        columns: {
          recepientEmail: true,
          type: true,
          status: true,
        },
      },
    },
  });

  if (!email) {
    return NextResponse.json(
      {
        statusCode: 404,
        message: "Email not found",
        name: "not_found",
      },
      {
        status: 404,
      },
    );
  }

  let emailCopy: FormattedEmailData = {
    id: email.id,
    from: email.from,
    subject: email.subject,
    to: null,
    cc: null,
    bcc: null,
    reply_to: email.replyTo && JSON.parse(email.replyTo),
    text: email.textContent,
    html: email.htmlContent,
    created_at: email.createdAt,
  };

  const formattedEmail: FormattedEmailData = email.recipients.reduce(
    (acc, recipient) => {
      if (!acc[recipient.type]) {
        acc[recipient.type] = [];
      }
      (acc[recipient.type] as Recipient[]).push({
        address: recipient.recepientEmail,
        status: recipient.status,
      });
      return acc;
    },
    emailCopy,
  );

  return NextResponse.json(formattedEmail, {
    status: 200,
    headers: {
      "ratelimit-limit": String(limit),
      "ratelimit-remaining": String(remaining),
      "ratelimit-reset": String(waitTime),
    },
  });
}

type Recipient = {
  address: string;
  status: EmailStatus;
};

type FormattedEmailData = {
  id: string;
  from: string;
  subject: string;
  to: Recipient[] | null;
  cc: Recipient[] | null;
  bcc: Recipient[] | null;
  reply_to: string | null;
  text: string | null;
  html: string | null;
  created_at: Date;
};
