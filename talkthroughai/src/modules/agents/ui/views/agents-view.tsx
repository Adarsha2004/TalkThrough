"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, Suspense } from "react";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { MakeEmptyState } from "../components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { NewAgentDialog } from "../components/new-agent-dialog";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function AgentsTable({ search, page, setFilters }: { search: string; page: number; setFilters: (filters: { search?: string; page?: number }) => void }) {
    const router=useRouter();

  const trpc = useTRPC();
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isLoading, isError, error } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ search: debouncedSearch, page })
  );
  

  const filteredData = data?.items?.filter(agent =>
    agent.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (isError && error?.data?.code === "UNAUTHORIZED") {
    return <div className="text-center text-red-500 mt-8">Please log in to view your agents.</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!filteredData || filteredData.length === 0) {
    return <MakeEmptyState />;
  }

  return (
    <div className="p-4">
      <DataTable data={filteredData} columns={columns} 
      onRowClick={(row)=>{router.push(`/agents/${row.id}`)}}/>
      <DataPagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={(page: number) => setFilters({ page: Math.max(1, page) })}
      />
    </div>
  );
}

export const AgentsView = () => {
  const [{ search, page }, setFilters] = useAgentsFilters();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Listen for page change event from DataPagination
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setFilters({ page: customEvent.detail });
    };
    window.addEventListener("setAgentPage", handler);
    return () => window.removeEventListener("setAgentPage", handler);
  }, [setFilters]);

  return (
    <div>
      {/* Sticky header with search and actions */}
      <div className="sticky top-0 z-10 bg-white shadow-sm pb-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">Agent</h1>
          <Button onClick={() => setOpen(true)}>+ New Agent</Button>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="agent-search">Search by name</label>
          <input
            id="agent-search"
            type="text"
            value={search}
            onChange={e => setFilters({ search: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Type agent name..."
          />
        </div>
      </div>
      <NewAgentDialog open={open} onOpenChange={setOpen} isMobile={isMobile} />
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-200px)] w-full"><LoadingState title="Loading Agents" description="This may take a few seconds..." /></div>}>
        <AgentsTable search={search} page={page} setFilters={setFilters} />
      </Suspense>
    </div>
  );
};

export const AgentsViewLoading = () => {
    return(
        <LoadingState title="Loading Agents" description="This may take a few seconds..."/>
    )
}

export const AgentsViewError = () => {
    return(
        <ErrorState title="Error Loading Agents" description="Please try again later"/>
    )
}