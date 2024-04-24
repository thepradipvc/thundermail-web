import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";

const loading = async () => {
  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emails</h1>
      </div>
      <div className="mt-8 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-9 w-[180px]" />
      </div>
      <div className="my-5 divide-y divide-gray-800 rounded-lg border border-gray-800 font-medium">
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr] bg-accent p-2 text-sm">
          <span>To</span>
          <span>Status</span>
          <span>Subject</span>
          <span>Sent</span>
        </div>
        {new Array(10).fill(0).map((_, i) => (
          <div
            className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center p-2 text-sm"
            key={i}
          >
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>
    </main>
  );
};
export default loading;
