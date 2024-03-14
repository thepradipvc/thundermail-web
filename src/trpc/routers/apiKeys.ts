import { apiKeys, gmailAccounts } from "@/db/schema";
import { hash } from "@/lib/crypto-helpers";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";

export const apiKeysRouter = createTRPCRouter({
  createAPIKey: protectedProcedure
    .input(z.object({ name: z.string().min(1), gmailAccountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { name, gmailAccountId } = input;

      const account = await db.query.gmailAccounts.findFirst({
        where: eq(gmailAccounts.id, gmailAccountId),
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
          message:
            "You are not authorized to create an API key for this account",
        });
      }

      const apiKey = `git_${randomBytes(16).toString("hex")}`;
      const prefix = apiKey.substring(0, 12);

      await db.insert(apiKeys).values({
        id: generateId(15),
        userId: user.id,
        gmailAccount: gmailAccountId,
        name,
        prefix,
        apiKey: hash(apiKey),
      });

      return { apiKey };
    }),

  getUserAPIKeys: protectedProcedure.query(async ({ ctx }) => {
    const { user, db } = ctx;
    const data = await db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, user.id),
      with: {
        gmailAccount: {
          columns: {
            email: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
      },
    });

    return data.map(
      ({ id, name, prefix, createdAt, gmailAccount: { email } }) => ({
        id,
        name,
        prefix,
        createdAt,
        gmailAccount: email,
      }),
    );
  }),

  editAPIKey: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id: apiKeyId, name } = input;

      const apiKey = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.id, apiKeyId),
        columns: {
          id: true,
          userId: true,
          name: true,
        },
      });

      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This API Key does not exist in our database",
        });
      }

      if (apiKey.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to edit this API Key",
        });
      }

      await db.update(apiKeys).set({ name }).where(eq(apiKeys.id, apiKeyId));

      return { message: "API Key updated successfully" };
    }),

  revokeAPIKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const { id: apiKeyId } = input;
      const apiKey = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.id, apiKeyId),
        columns: {
          id: true,
          userId: true,
          name: true,
        },
      });

      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This API Key does not exist in our database",
        });
      }

      if (apiKey.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to revoke this API Key",
        });
      }

      await db.delete(apiKeys).where(eq(apiKeys.id, apiKeyId));
      return { message: `API Key revoked successfully: ${apiKey.name}` };
    }),
});
