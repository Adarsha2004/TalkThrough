"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface Props {
    meetingId: string;
};

export const CallView =({meetingId}:Props) => {
    const trpc=useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id:meetingId}));

    if(data.status==="completed"){
        return (
            <div className="flex h-screen items-center jusify-center">
                <ErrorState 
                    title="Meeting has ended"
                    description="The meeting has ended. You can close this window now."
                />

            </div>
        )
    }

    return (
        <CallProvider
            meetingId={meetingId}
            meetingName={data.name}
        />
    )
}