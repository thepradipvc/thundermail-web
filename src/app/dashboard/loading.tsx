import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = async () => {
  return (
    <main className="mx-auto flex max-w-6xl flex-col justify-center">
      <div className="mx-8 mt-8 flex flex-col justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="mt-8 rounded-lg border border-gray-800 p-5">
          <div className="mx-4 mb-6 flex w-full justify-between gap-16">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Total Emails</span>
              <Skeleton className="h-12 w-8" />
            </div>
            <div className="mr-8 flex gap-1">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
          <Skeleton className="mx-4 h-96" />
          <div className="mb-1 mr-4 mt-8 flex justify-end gap-4">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </div>
    </main>
  );
};
export default loading;
