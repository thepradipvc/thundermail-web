import { createTRPCRouter } from ".";
import { apiKeysRouter } from "./routers/apiKeys";
import { emailsRouter } from "./routers/emails";
import { gmailAccountsRouter } from "./routers/gmailAccounts";

export const appRouter = createTRPCRouter({
  gmailAccounts: gmailAccountsRouter,
  apiKeys: apiKeysRouter,
  emails: emailsRouter,
});

export type AppRouter = typeof appRouter;
