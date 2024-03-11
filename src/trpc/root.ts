import { createTRPCRouter } from ".";
import { apiKeysRouter } from "./routers/apiKeys";
import { gmailAccountsRouter } from "./routers/gmailAccounts";

export const appRouter = createTRPCRouter({
  gmailAccounts: gmailAccountsRouter,
  apiKeys: apiKeysRouter,
});

export type AppRouter = typeof appRouter;
