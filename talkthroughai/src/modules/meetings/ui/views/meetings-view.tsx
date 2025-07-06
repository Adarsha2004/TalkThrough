"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyMeetingsState } from "../components/empty-meetings-state";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/modules/agents/ui/components/data-pagination";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const [{ search, page, status, agentId }, setFilters] = useMeetingsFilters();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        search,
        page,
        status,
        agentId,
    }));

    return (
        <div>
            {data.items.length === 0 ? (
                <EmptyMeetingsState />
            ) : (
                <>
                    <DataTable columns={columns} data={data.items} />
                    <DataPagination
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={p => setFilters({ page: p })}
                    />
                </>
            )}
        </div>
    )
}

export const MeetingsViewLoading = () => {
    return(
        <LoadingState title="Loading Meetings" description="This may take a few seconds..."/>
    )
}

export const MeetingsViewError = () => {
    return(
        <ErrorState title="Error Loading Meetings" description="Please try again later"/>
    )
}