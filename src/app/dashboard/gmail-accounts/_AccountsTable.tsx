"use client";

import { trpc } from "@/trpc/react-client";
import { RouterOutputs } from "@/trpc/utils";
import { User } from "lucia";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type Props = {
  user: User;
  gmailAccounts: RouterOutputs["gmailAccounts"]["getUserAccounts"];
};

const AccountsTable = ({ user, gmailAccounts }: Props) => {
  const { data: accounts } = trpc.gmailAccounts.getUserAccounts.useQuery(
    undefined,
    {
      initialData: gmailAccounts,
    },
  );

  return (
    <div className="mx-auto w-full py-5">
      <DataTable
        columns={columns}
        data={accounts}
        emptyTableMessage="You don't have any linked gmail account"
      />
    </div>
  );
};

export default AccountsTable;

type Account = RouterOutputs["gmailAccounts"]["getUserAccounts"][number];

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const account = row.original;

      return (
        <div className="text-left">
          <Badge variant={account.status === "active" ? "success" : "warning"}>
            {account.status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "remove account",
    cell: ({ row }) => {
      const utils = trpc.useUtils();
      const account = row.original;
      const { mutate: removeAccount, isLoading } =
        trpc.gmailAccounts.removeAccount.useMutation({
          onSuccess: ({ message }) => {
            toast({
              description: message,
              variant: "success",
            });
            utils.gmailAccounts.getUserAccounts.invalidate();
          },
          onError: ({ message }) => {
            toast({ description: message, variant: "destructive" });
          },
        });

      return (
        <div className="text-right">
          <Button
            size="sm"
            className="ml-auto"
            variant="destructive"
            disabled={isLoading}
            onClick={() => removeAccount({ id: account.id })}
          >
            Remove Account{" "}
          </Button>
        </div>
      );
    },
  },
];
