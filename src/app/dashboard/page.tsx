import { serverClient } from "@/trpc/server-client";
import { z } from "zod";
import { EmailStatsChart } from "./_EmailStatsChart";

const ranges = ["d", "7d", "15d", "30d"] as const;
const rangeSchema = z.enum(ranges).optional().default("d");

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) => {
  const { range: rangeParam } = await searchParams;
  const range = rangeSchema.parse(rangeParam || "d");
  const emailStats = await (await serverClient).emails.getStats({ range });

  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="mx-8 mt-8 flex flex-col justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <EmailStatsChart emailStats={emailStats} />
      </div>
    </main>
  );
};
export default page;
