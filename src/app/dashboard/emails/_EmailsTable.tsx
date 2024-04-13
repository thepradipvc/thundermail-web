"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getRelativeTime, getTime } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MdOutlineEmail } from "react-icons/md";

type Email = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  status: "delivered" | "rejected" | "queued";
  sentAt: Date;
};

type Props = {
  emails: Email[];
};

const EmailsTable = ({ emails }: Props) => {
  return (
    <div className="mx-auto w-full py-5">
      <DataTable
        columns={columns}
        data={emails}
        emptyTableMessage="No emails to show. Try searching or filtering for a different term."
      />
    </div>
  );
};

export default EmailsTable;

export const columns: ColumnDef<Email>[] = [
  {
    accessorKey: "to",
    header: () => <div className="text-left">To</div>,
    cell: ({ row }) => {
      const email = row.original;

      return (
        <div className="text-left">
          <MdOutlineEmail
            className={cn("mr-2 inline", {
              "text-success-foreground": email.status === "delivered",
              "text-badge-destructive-foreground": email.status === "rejected",
              "text-warning-foreground": email.status === "queued",
            })}
          />
          {email.to[0]}
          {email.to.length > 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="ml-2" variant="outline">
                    + {email.to.length - 1}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {email.to.map(
                    (toAddress, index) =>
                      index > 0 && <p key={index}>{toAddress}</p>,
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const email = row.original;

      return (
        <div className="text-left">
          <Badge
            variant={
              email.status === "delivered"
                ? "success"
                : email.status === "rejected"
                  ? "destructive"
                  : "warning"
            }
          >
            {email.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-left">Subject</div>,
    cell: ({ row }) => {
      const email = row.original;

      return <p className="max-w-96 truncate">{email.subject}</p>;
    },
  },
  {
    accessorKey: "sentAt",
    header: () => <div className="text-left">Sent</div>,
    cell: ({ row }) => {
      const email = row.original;

      return (
        <div className="text-left">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger suppressHydrationWarning>
                {getRelativeTime(email.sentAt)}
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTime(email.sentAt)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
