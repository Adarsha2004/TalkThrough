import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { dehydrate, HydrationBoundary, useQueryClient } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingListHeader } from "@/modules/meetings/ui/components/meeting-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      if(!session){
        redirect("/sign-in");
      }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))
    return (
        <>
        <MeetingListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}> 
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError/>}>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    )
}

export default Page;