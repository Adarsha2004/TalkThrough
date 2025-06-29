"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyMeetingsState } from "../components/empty-meetings-state";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div>
            {data.items.length === 0 ? (
                <EmptyMeetingsState />
            ) : (
                <DataTable columns={columns} data={data.items} />
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