import { validateUser } from "@/auth";
import Pagination from "@/components/Pagination";
import { db } from "@/db";
import { emailRecipients, emails } from "@/db/schema";
import { serverClient } from "@/trpc/server-client";
import { and, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import EmailsTable from "./_EmailsTable";
import SearchAndFilter from "./_SearchAndFilter";

type SearchParams = {
  search?: string;
  time?: string;
  status?: string;
  apiKey?: string;
  page?: string;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { user } = await validateUser();

  if (!user) {
    redirect("/signin");
  }

  const timeFilter = getTimeFilter(timeFilterSchema.parse(searchParams.time));
  const apiKeyFilter = apiKeyFilterSchema.parse(searchParams.apiKey);
  const statusFilter = statusFilterSchema.parse(searchParams.status);
  const searchTerm = searchParams.search || "";

  const pageSize = 50;
  const page =
    parseInt(searchParams.page!) >= 1 ? parseInt(searchParams.page!) : 1;
  const offset = (page - 1) * pageSize;
  const totalPages = 1;

  // TODO: Multiple where clauses not working
  const query = db
    .select({
      id: emails.id,
      from: emails.from,
      subject: emails.subject,
      sentAt: emails.createdAt,
      status: emailRecipients.status,
      to: emailRecipients.recepientEmail,
    })
    .from(emails)
    .innerJoin(emailRecipients, eq(emails.id, emailRecipients.emailId));

  if (timeFilter) {
    query.where(
      and(eq(emails.userId, user.id), gte(emails.createdAt, timeFilter)),
    );
  } else {
    query.where(eq(emails.userId, user.id));
  }

  const emailsData = refineData(await query.execute());

  const apiKeysData = await (await serverClient).apiKeys.getUserAPIKeys();
  const apiKeys = apiKeysData.map((apiKey) => ({
    label: apiKey.name,
    value: apiKey.id,
  }));
  apiKeys.unshift({ label: "All API Keys", value: "all" });

  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emails</h1>
      </div>
      <div className="mt-8">
        <SearchAndFilter apiKeys={apiKeys} />
      </div>
      <EmailsTable emails={emailsData} />
      {totalPages > 1 ? (
        <div className="mx-auto">
          <Pagination totalPages={totalPages} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Page 1 of 1</p>
      )}
    </main>
  );
};

export default Page;

type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  status: "delivered" | "rejected" | "queued";
  sentAt: Date;
};

const refineData = (
  emails: Email[],
): (Omit<Email, "to"> & { to: string[] })[] => {
  let map = new Map();
  for (const email of emails) {
    if (!map.has(email.id)) {
      map.set(email.id, {
        id: email.id,
        from: email.from,
        subject: email.subject,
        sentAt: email.sentAt,
        status: email.status,
        to: [email.to],
      });
    } else {
      map.get(email.id).to.push(email.to);
    }
  }

  return Array.from(map.values());
};

const getTimeFilter = (time: string | null) => {
  switch (time) {
    case "7":
      return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    case "15":
      return new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000);
    case "30":
      return new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
};

const timeFilterSchema = z
  .union([z.literal("7"), z.literal("15"), z.literal("30"), z.literal(null)])
  .optional()
  .default(null)
  .catch((err) => null);
const statusFilterSchema = z
  .union([
    z.literal("delivered"),
    z.literal("rejected"),
    z.literal("queued"),
    z.literal(null),
  ])
  .optional()
  .default(null)
  .catch((err) => null);
const apiKeyFilterSchema = z
  .union([z.literal("all"), z.string().nullable()])
  .optional()
  .default("all")
  .transform((val) => (val === "all" ? null : val));
