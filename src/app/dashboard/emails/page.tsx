import { validateUser } from "@/auth";
import Pagination from "@/components/Pagination";
import { db } from "@/db";
import { emailRecipients, emails } from "@/db/schema";
import { serverClient } from "@/trpc/server-client";
import { and, asc, countDistinct, desc, eq, gte, ilike, or } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
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

  const withFilters = <T extends PgSelect>(qb: T) => {
    return qb.where(
      and(
        eq(emails.userId, user.id),
        timeFilter ? gte(emails.createdAt, timeFilter) : undefined,
        apiKeyFilter ? eq(emails.apiKeyId, apiKeyFilter) : undefined,
        statusFilter ? eq(emailRecipients.status, statusFilter) : undefined,
        or(
          searchTerm ? ilike(emails.subject, `%${searchTerm}%`) : undefined,
          searchTerm
            ? ilike(emailRecipients.recepientEmail, `%${searchTerm}%`)
            : undefined,
        ),
      ),
    );
  };

  let totalResultsQuery = db
    .select({ value: countDistinct(emails.id) })
    .from(emails)
    .innerJoin(emailRecipients, eq(emails.id, emailRecipients.emailId))
    .$dynamic();

  totalResultsQuery = withFilters(totalResultsQuery);
  const totalResults = await totalResultsQuery.execute();
  const totalPages = Math.ceil(totalResults[0].value / pageSize);

  let page =
    parseInt(searchParams.page!) >= 1 ? parseInt(searchParams.page!) : 1;
  page = page > totalPages ? totalPages : page;
  const offset = (page - 1) * pageSize;

  const withPagination = <T extends PgSelect>(qb: T) => {
    return qb
      .orderBy(desc(emails.createdAt), asc(emails.id))
      .limit(pageSize)
      .offset(offset);
  };

  const emailIdsQuery = db
    .selectDistinctOn([emails.createdAt, emails.id], { id: emails.id })
    .from(emails)
    .innerJoin(emailRecipients, eq(emails.id, emailRecipients.emailId))
    .$dynamic();

  const sq = withPagination(withFilters(emailIdsQuery)).as("subquery");

  const filteredEmails = await db
    .select({
      id: emails.id,
      from: emails.from,
      subject: emails.subject,
      sentAt: emails.createdAt,
      status: emailRecipients.status,
      to: emailRecipients.recepientEmail,
    })
    .from(emails)
    .innerJoin(sq, eq(emails.id, sq.id))
    .innerJoin(emailRecipients, eq(emails.id, emailRecipients.emailId));

  const emailsData = refineData(filteredEmails, searchTerm);

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

      <div className="mx-auto">
        <Pagination totalPages={totalPages} />
      </div>
      <p className="ml-auto mt-0 text-sm text-muted-foreground">
        Total Pages: {totalPages}
      </p>
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
  searchTerm: string,
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
      if (email.to.includes(searchTerm) || email.subject.includes(searchTerm)) {
        map.get(email.id).to.unshift(email.to);
      } else {
        map.get(email.id).to.push(email.to);
      }
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
