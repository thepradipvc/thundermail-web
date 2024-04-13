import { validateUser } from "@/auth";

import { serverClient } from "@/trpc/server-client";
import { redirect } from "next/navigation";
import APIKeysTable from "./_APIKeysTable";
import AddAPIKeyDialog from "./_AddAPIKeyDialog";

const Page = async () => {
  const { user } = await validateUser();

  if (!user) {
    redirect("/signin");
  }

  const apiKeys = await (await serverClient).apiKeys.getUserAPIKeys();

  const gmailAccounts = await (
    await serverClient
  ).gmailAccounts.getUserAccounts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <AddAPIKeyDialog gmailAccounts={gmailAccounts} />
      </div>
      <APIKeysTable apiKeys={apiKeys} />
    </main>
  );
};

export default Page;
