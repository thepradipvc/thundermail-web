// https://trpc.io/docs/server/server-side-calls

import { createCallerFactory, createTRPCContext } from ".";
import { appRouter } from "./root";

const createCaller = createCallerFactory(appRouter);

async function createServerClient() {
  const context = await createTRPCContext();
  return createCaller(context);
}

export const serverClient = createServerClient();
