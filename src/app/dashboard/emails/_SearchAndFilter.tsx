"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

const timeFilterOptions = [
  {
    label: "All time",
    value: "all",
  },
  {
    label: "Last 7 days",
    value: "7",
  },
  {
    label: "Last 15 days",
    value: "15",
  },
  {
    label: "Last 30 days",
    value: "30",
  },
];

const statusFilterOptions = [
  {
    label: "All Statuses",
    value: "all",
  },
  {
    label: "Queued",
    value: "queued",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

type SearchAndFilterProps = {
  apiKeys: { label: string; value: string }[];
};

const SearchAndFilter = ({ apiKeys }: SearchAndFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearchTerm = searchParams.get("search") || "";
  const currentTimeFilter = searchParams.get("time") || "all";
  const currentStatusFilter = searchParams.get("status") || "all";
  const currentApiKeyFilter = searchParams.get("apiKey") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = useDebouncedCallback((searchTerm) => {
    router.push(`${pathname}?${createQueryString("search", searchTerm)}`);
  }, 300);

  const handleSelect = (key: string, value: string) => {
    router.push(`${pathname}?${createQueryString(key, value)}`);
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg border-gray-800 bg-background pl-8"
          defaultValue={currentSearchTerm}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <FilterSelect
        options={timeFilterOptions}
        queryKey="time"
        handleSelect={handleSelect}
        defaultValue={currentTimeFilter}
      />
      <FilterSelect
        options={statusFilterOptions}
        queryKey="status"
        handleSelect={handleSelect}
        defaultValue={currentStatusFilter}
      />
      <FilterSelect
        options={apiKeys}
        queryKey="apiKey"
        handleSelect={handleSelect}
        defaultValue={currentApiKeyFilter}
      />
    </div>
  );
};

export default SearchAndFilter;

type FilterSelectProps = {
  options: {
    label: string;
    value: string;
  }[];
  queryKey: string;
  handleSelect: (key: string, value: string) => void;
  defaultValue: string;
};

const FilterSelect = ({
  options,
  queryKey,
  handleSelect,
  defaultValue,
}: FilterSelectProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => handleSelect(queryKey, value)}
    >
      <SelectTrigger className="w-[180px] border-gray-800">
        <SelectValue placeholder={options[0].label} />
      </SelectTrigger>
      <SelectContent className="border-gray-800">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
