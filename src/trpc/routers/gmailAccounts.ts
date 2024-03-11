import { gmailAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import { TRPCError } from "@trpc/server";

export const gmailAccountsRouter = createTRPCRouter({
  getUserAccounts: protectedProcedure.query(({ ctx }) => {
    const { user, db } = ctx;

    return db.query.gmailAccounts.findMany({
      where: eq(gmailAccounts.userId, user.id),
      columns: {
        id: true,
        email: true,
        status: true,
      },
    });
  }),

  removeAccount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const { id: accountId } = input;

      const account = await db.query.gmailAccounts.findFirst({
        where: eq(gmailAccounts.id, accountId),
        columns: {
          id: true,
          email: true,
          userId: true,
        },
      });

      if (!account) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This gmail account does not exist in our database",
        });
      }

      if (account.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to remove this account",
        });
      }

      await db.delete(gmailAccounts).where(eq(gmailAccounts.id, accountId));

      return { message: `Account removed successfully: ${account.email}` };
    }),
});
