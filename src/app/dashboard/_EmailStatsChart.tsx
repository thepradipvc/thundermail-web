"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/react-client";
import { RouterOutputs } from "@/trpc/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";

const ranges = ["d", "7d", "15d", "30d"] as const;
const rangeSchema = z.enum(ranges).optional().default("d");

type EmailStatsChartProps = {
  emailStats: RouterOutputs["emails"]["getStats"];
};

export const EmailStatsChart = ({
  emailStats: initialData,
}: EmailStatsChartProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRange = rangeSchema.parse(searchParams.get("range") || "d");

  const { data: emailStats } = trpc.emails.getStats.useQuery(
    {
      range: currentRange,
    },
    {
      initialData,
    },
  );

  const totalEmails = emailStats.reduce((acc, item) => {
    return acc + item.rejected + item.delivered;
  }, 0);
  const deliveredEmailsPercentage = Math.round(
    (emailStats.reduce((acc, item) => {
      return acc + item.delivered;
    }, 0) /
      totalEmails) *
      100,
  );
  const rejectedEmailsPercentage = 100 - deliveredEmailsPercentage;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="mt-8 rounded-lg border border-gray-800 p-5">
      <div className="mx-4 mb-6 flex justify-between gap-16">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Total Emails</span>
          <span className="text-4xl">{totalEmails}</span>
        </div>
        <div className="flex h-max gap-1 rounded-lg border border-gray-800">
          {ranges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              className={cn("h-6 px-3 uppercase text-muted-foreground", {
                "bg-accent text-white": range === currentRange,
              })}
              onClick={() => {
                router.push(pathname + "?" + createQueryString("range", range));
              }}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={emailStats}>
          <XAxis
            interval="equidistantPreserveStart"
            dataKey="dateOrTime"
            tickLine={false}
            axisLine={{ stroke: "#1f2937" }}
            tick={{ fill: "#fcfdffef", fontSize: 12 }}
          />
          <YAxis
            type="number"
            orientation="right"
            tickLine={{ stroke: "#1f2937" }}
            axisLine={{ stroke: "#1f2937" }}
            tick={{ fill: "#fcfdffef", fontSize: 12 }}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="delivered" stackId="a" fill="#46fea5d4" barSize={4} />
          <Bar dataKey="rejected" stackId="a" fill="#ff9592" barSize={4} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mr-8 mt-8 flex justify-end gap-4">
        {totalEmails > 0 && (
          <>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[#ff9592]"
              ></span>
              <span className="sr-only">Rejected</span>
              <span className="text-sm text-muted-foreground">
                {rejectedEmailsPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[#46fea5d4]"
              ></span>
              <span className="sr-only">Delivered</span>
              <span className="text-sm text-muted-foreground">
                {deliveredEmailsPercentage}%
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const hasDeliveredEmails = payload[0]?.payload?.delivered !== 0;
  const hasRejectedEmails = payload[0]?.payload?.rejected !== 0;

  if (
    active &&
    payload &&
    payload.length &&
    (hasRejectedEmails || hasDeliveredEmails)
  ) {
    return (
      <div className="space-y-4 rounded-md border border-gray-800 bg-background p-2">
        {hasRejectedEmails && (
          <div className="flex gap-2">
            <div aria-hidden className="w-1 rounded-md bg-[#ff9592]"></div>
            <div className="flex flex-col">
              <span className="font-bold">Rejected</span>
              <span className="text-sm text-muted-foreground">
                {getEmailsCountFormatted(payload[0]?.payload?.rejected)}
              </span>
            </div>
          </div>
        )}
        {hasDeliveredEmails && (
          <div className="flex gap-2">
            <div aria-hidden className="w-1 rounded-md bg-[#46fea5d4]"></div>
            <div className="flex flex-col">
              <span className="font-bold">Delivered</span>
              <span className="text-sm text-muted-foreground">
                {getEmailsCountFormatted(payload[0]?.payload?.delivered)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const getEmailsCountFormatted = (count: number) => {
  return count > 1 ? `${count} Emails` : `${count} Email`;
};
