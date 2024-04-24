import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";

const loading = async () => {
  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="my-5 divide-y divide-gray-800 rounded-lg border border-gray-800 font-medium">
        <div className="grid grid-cols-[2fr_2fr_2fr_1fr] bg-accent p-2 text-sm">
          <span className="flex items-center">
            Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
          <span>Token</span>
          <span>Created</span>
          <span></span>
        </div>
        {new Array(10).fill(0).map((_, i) => (
          <div
            className="grid grid-cols-[2fr_2fr_2fr_1fr] items-center p-2 text-sm"
            key={i}
          >
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="ml-auto h-8 w-10" />
          </div>
        ))}
      </div>
    </main>
  );
};
export default loading;
