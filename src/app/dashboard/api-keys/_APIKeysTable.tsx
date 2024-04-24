"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRelativeTime, getTime } from "@/lib/utils";
import { trpc } from "@/trpc/react-client";
import { RouterOutputs } from "@/trpc/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import APIKeyActions from "./_APIKeyActions";

type APIKey = RouterOutputs["apiKeys"]["getUserAPIKeys"][number];
type Props = {
  apiKeys: APIKey[];
};

const APIKeysTable = ({ apiKeys }: Props) => {
  const { data: keys } = trpc.apiKeys.getUserAPIKeys.useQuery(undefined, {
    initialData: apiKeys,
  });

  return (
    <div className="mx-auto w-full py-5">
      <DataTable
        columns={columns}
        data={keys}
        emptyTableMessage="You've not created any API keys yet. Click the button above to create one."
      />
    </div>
  );
};

export default APIKeysTable;

export const columns: ColumnDef<APIKey>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "prefix",
    header: () => <div className="text-left">Token</div>,
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <div className="text-left">
          <Badge className="pointer-events-none" variant="outline">
            {apiKey.prefix}...
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-left">Created</div>,
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <div className="text-left">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger suppressHydrationWarning>
                {getRelativeTime(apiKey.createdAt)}
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTime(apiKey.createdAt)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-end">
          <APIKeyActions apiKey={row.original} />
        </div>
      );
    },
  },
];
