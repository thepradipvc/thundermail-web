import { sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "..";
import { db } from "@/db";
import { z } from "zod";
import { getIntervalValue } from "@/lib/utils";
import { emails } from "@/db/schema";

export const emailsRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(z.object({ range: z.enum(["d", "7d", "15d", "30d"]) }))
    .query(async ({ input, ctx }) => {
      const { range } = input;
      const {
        user: { id: userId },
      } = ctx;

      return getEmailStats(range, userId);
    }),
});

export const getEmailStats = async (
  timeRange: "d" | "7d" | "15d" | "30d",
  userId: string,
) => {
  const hourMode = timeRange === "d";
  const intervalValue = getIntervalValue(timeRange);

  const query = sql`
    WITH recipient_statuses AS (
      SELECT
        email_id,
        MAX(status) AS max_status
      FROM
        email_recipients
      GROUP BY
        email_id
    ),
    email_times AS (
      SELECT
        emails.id,
        ${
          hourMode
            ? sql`DATE_TRUNC('hour', emails.created_at)`
            : sql`DATE_TRUNC('day', emails.created_at)::DATE`
        } AS date_trunc
      FROM
        emails
      WHERE ${sql`${emails.userId} = ${userId}`}
    ),
    all_times AS (
      ${
        hourMode
          ? sql`SELECT generate_series(DATE_TRUNC('hour', NOW() - INTERVAL '1 DAY'), DATE_TRUNC('hour', NOW()), INTERVAL '1 HOUR') AS date_trunc`
          : sql`SELECT generate_series(CURRENT_DATE - ${intervalValue} + INTERVAL '1 DAY', CURRENT_DATE, INTERVAL '1 DAY') AS date_trunc`
      }
    )
    SELECT
      ${
        hourMode
          ? sql`TO_CHAR(at.date_trunc, 'HH24:MI')`
          : sql`TO_CHAR(at.date_trunc, 'Mon, DD')`
      } AS dateOrTime,
      COALESCE(SUM(CASE WHEN max_status = 'rejected' THEN 1 ELSE 0 END), 0)::BIGINT AS rejected,
      COALESCE(SUM(CASE WHEN max_status = 'delivered' THEN 1 ELSE 0 END), 0)::BIGINT AS delivered
    FROM
      all_times AS at
      LEFT JOIN email_times ON at.date_trunc = email_times.date_trunc
      LEFT JOIN recipient_statuses ON email_times.id = recipient_statuses.email_id
    GROUP BY
      at.date_trunc
    ORDER BY
      at.date_trunc ASC;
  `;

  const result = await db.execute(query);
  return result.rows.map((row) => ({
    dateOrTime: row.dateortime as string,
    rejected: parseInt(row.rejected as string, 10),
    delivered: parseInt(row.delivered as string, 10),
  }));
};
