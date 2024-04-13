import { validateUser } from "@/auth";
import { Button } from "@/components/ui/button";
import { serverClient } from "@/trpc/server-client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import AccountsTable from "./_AccountsTable";

const Page = async () => {
  const { user } = await validateUser();

  if (!user) {
    redirect("/signin");
  }

  const gmailAccounts = await (
    await serverClient
  ).gmailAccounts.getUserAccounts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gmail Accounts</h1>
        <Button asChild>
          <Link href="/api/link-gmail">
            <LuPlus className="mr-2" /> Add Account
          </Link>
        </Button>
      </div>
      <AccountsTable gmailAccounts={gmailAccounts} />
    </main>
  );
};

export default Page;
