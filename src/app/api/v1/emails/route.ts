import { db } from "@/db";
import {
  EmailRecipient,
  apiKeys,
  emailRecipients,
  emails,
  gmailAccounts,
} from "@/db/schema";
import { hash } from "@/lib/crypto-helpers";
import { sqsClient } from "@/lib/sqs-client";
import { emailSendingQuotaLimit, ratelimit } from "@/lib/upstash-ratelimit";
import { extractEmailAddress, validateEmail } from "@/lib/utils";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  const { success: quotaLeft } = await emailSendingQuotaLimit.limit(
    apiKeyRecord.userId,
  );

  if (!quotaLeft) {
    return NextResponse.json(
      {
        statusCode: 429,
        message: "You have reached your daily email sending quota.",
        name: "daily_quota_exceeded",
      },
      {
        status: 429,
      },
    );
  }

  let reqBody;
  try {
    reqBody = await request.json();

    if (typeof reqBody === "string") {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid JSON payload",
          name: "invalid_json_payload",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: "Invalid JSON payload",
        name: "invalid_json_payload",
      },
      {
        status: 400,
      },
    );
  }

  // Check if required fields are present
  const requiredFields = ["from", "to", "subject"];
  for (const field of requiredFields) {
    if (!reqBody[field]) {
      return NextResponse.json(
        {
          statusCode: 422,
          message: `Missing \`${field}\` field`,
          name: "missing_required_field",
        },
        {
          status: 422,
        },
      );
    }
  }

  // Validate string fields
  const stringFields = ["from", "subject", "html", "text"];
  for (const field of stringFields) {
    if (reqBody[field] && typeof reqBody[field] !== "string") {
      return NextResponse.json(
        {
          statusCode: 422,
          message: `The \`${field}\` field must be a \`string\`.`,
          name: "validation_error",
        },
        {
          status: 422,
        },
      );
    }
  }

  // Validate email fields
  const emailFields = ["from", "to", "cc", "bcc", "reply_to"];
  for (const field of emailFields) {
    if (reqBody[field]) {
      if (typeof reqBody[field] === "string") {
        if (!validateEmail(reqBody[field])) {
          return NextResponse.json(
            {
              statusCode: 422,
              message: `Invalid \`${field}\` field. The email address needs to follow the \`email@example.com\` or \`Name <email@example.com>\` format.`,
              name: "validation_error",
            },
            {
              status: 422,
            },
          );
        }
      } else if (Array.isArray(reqBody[field])) {
        for (const email of reqBody[field]) {
          if (!validateEmail(email)) {
            return NextResponse.json(
              {
                statusCode: 422,
                message: `Invalid \`${field}\` field. The email address needs to follow the \`email@example.com\` or \`Name <email@example.com>\` format.`,
                name: "validation_error",
              },
              {
                status: 422,
              },
            );
          }
        }
      } else {
        return NextResponse.json(
          {
            statusCode: 422,
            message: `The \`${field}\` field must be a \`string\` or a \`string[]\`.`,
            name: "validation_error",
          },
          {
            status: 422,
          },
        );
      }
    }
  }

  const replyTo = reqBody.reply_to ? JSON.stringify(reqBody.reply_to) : null;

  if (!reqBody.text && !reqBody.html) {
    return NextResponse.json(
      {
        statusCode: 422,
        message: "Either `text` or `html` field is required",
        name: "missing_required_field",
      },
      {
        status: 422,
      },
    );
  }

  const fromAddress = extractEmailAddress(reqBody.from);

  const gmailAccount = await db.query.gmailAccounts.findFirst({
    where: and(
      eq(gmailAccounts.userId, apiKeyRecord.userId),
      eq(gmailAccounts.email, fromAddress),
    ),
    columns: {
      refreshToken: false,
    },
  });

  if (!gmailAccount) {
    return NextResponse.json(
      {
        statusCode: 403,
        message: `The \`${fromAddress}\` gmail account is not linked to your account. Please link the account before sending emails.`,
        name: "invalid_from_address",
      },
      {
        status: 403,
      },
    );
  }

  const emailId = randomUUID();
  await db.insert(emails).values({
    id: emailId,
    userId: apiKeyRecord.userId,
    apiKeyId: apiKeyRecord.id,
    from: reqBody.from,
    subject: reqBody.subject,
    replyTo,
    textContent: reqBody.text ? reqBody.text : null,
    htmlContent: reqBody.html ? reqBody.html : null,
  });

  const recipients: EmailRecipient[] = [];
  for (const type of ["to", "cc", "bcc"] as const) {
    if (reqBody[type]) {
      if (typeof reqBody[type] === "string") {
        recipients.push({
          id: randomUUID(),
          emailId: emailId,
          recepientEmail: reqBody[type],
          type: type,
        });
      } else {
        for (const recipient of reqBody[type]) {
          recipients.push({
            id: randomUUID(),
            emailId: emailId,
            recepientEmail: recipient,
            type: type,
          });
        }
      }
    }
  }

  await db.insert(emailRecipients).values(recipients);

  const message = {
    QueueUrl: `${process.env.AWS_SQS_QUEUE_URL}`,
    MessageBody: emailId,
  };

  const command = new SendMessageCommand(message);
  await sqsClient.send(command);

  return NextResponse.json(
    {
      id: emailId,
    },
    {
      status: 200,
      headers: {
        "ratelimit-limit": String(limit),
        "ratelimit-remaining": String(remaining),
        "ratelimit-reset": String(waitTime),
      },
    },
  );
}
