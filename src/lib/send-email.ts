import { db } from "@/db";
import { emailRecipients, emails, gmailAccounts } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import nodemailer from "nodemailer";
import { extractEmailAddress } from "./utils";
import { decrypt } from "./crypto-helpers";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
});

export const sendEmail = async (emailId: string) => {
  const email = await db.query.emails.findFirst({
    where: eq(emails.id, emailId),
    with: {
      recipients: true,
    },
  });

  if (!email) {
    console.log("Email not found", emailId);
    return;
  }

  const fromAddress = extractEmailAddress(email.from);

  const gmailAccount = await db.query.gmailAccounts.findFirst({
    where: eq(gmailAccounts.email, fromAddress),
  });

  if (!gmailAccount) {
    console.log("Gmail account not linked");
    return;
  }

  const refreshToken = decrypt(
    gmailAccount.refreshToken,
    process.env.TOKENS_ENCRYPTION_KEY,
  );

  let partialEmailOptions: EmailOptions = {
    from: email.from,
    subject: email.subject,
    to: [],
    cc: [],
    bcc: [],
    replyTo: email.replyTo && JSON.parse(email.replyTo),
  };

  const emailOptions: EmailOptions = email.recipients.reduce(
    (acc, recipient) => {
      acc[recipient.type].push(recipient.recepientEmail);
      return acc;
    },
    partialEmailOptions,
  );

  email.textContent && (emailOptions.text = email.textContent);
  email.htmlContent && (emailOptions.html = email.htmlContent);

  const { accepted, rejected } = await transporter
    .sendMail({
      ...emailOptions,
      // @ts-ignore
      auth: {
        user: fromAddress,
        refreshToken: refreshToken,
      },
    })
    .finally();

  const emailDeliveredTo = email.recipients
    .filter((recipient) => accepted.includes(recipient.recepientEmail))
    .reduce((acc, recipient) => {
      acc.push(recipient.id);
      return acc;
    }, [] as string[]);

  const emailRejectedBy = email.recipients
    .filter((recipient) => rejected.includes(recipient.recepientEmail))
    .reduce((acc, recipient) => {
      acc.push(recipient.id);
      return acc;
    }, [] as string[]);

  if (emailDeliveredTo.length > 0) {
    await db
      .update(emailRecipients)
      .set({ status: "delivered" })
      .where(inArray(emailRecipients.id, emailDeliveredTo));
  }

  if (emailRejectedBy.length > 0) {
    await db
      .update(emailRecipients)
      .set({ status: "rejected" })
      .where(inArray(emailRecipients.id, emailRejectedBy));
  }
};

type EmailOptions = {
  from: string;
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  replyTo: string;
  text?: string;
  html?: string;
};
