"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState, useCallback, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props {
    meetingId: string;
}

const MeetingContent = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    if (!data) {
        return <ErrorState 
            title="Meeting not found"
            description="The meeting you're looking for doesn't exist or you don't have access to it."
        />;
    }

    // Status flags
    let statusLabel = "";
    let statusColor = "";
    if (data.status === "active") {
        statusLabel = "Active";
        statusColor = "bg-green-500";
    } else if (data.status === "upcoming") {
        statusLabel = "Upcoming";
        statusColor = "bg-blue-500";
    } else if (data.status === "cancelled") {
        statusLabel = "Cancelled";
        statusColor = "bg-red-500";
    } else if (data.status === "completed") {
        statusLabel = "Completed";
        statusColor = "bg-gray-500";
    } else if (data.status === "processing") {
        statusLabel = "Processing";
        statusColor = "bg-yellow-500";
    }

    return (
        <div className="flex-1 py-4 flex flex-col gap-y-4">
            <div className="text-lg font-bold">Meeting Details</div>
            <div>Meeting ID: {meetingId}</div>
            <div>Meeting Name: {data.name}</div>
            <div className="flex items-center gap-2">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
            </div>
            {data.status === "upcoming" && (
                <UpcomingState meetingId={meetingId} name={data.name} agentID={data.agentId} />
            )}
            {data.status === "active" && (
                <ActiveState meetingId={meetingId} />
            )}
            {data.status === "cancelled" && (
                <CancelledState />
            )}
            {data.status === "processing" && (
                <ProcessingState />
            )}
            {data.status === "completed" && (
                <CompletedState data={data} />
            )}
        </div>
    );
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const isMobile = useIsMobile();
    const trpc = useTRPC();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you Sure?",
        "The following action will remove this meeting"
    );

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['meetings'] });
                router.push("/dashboard/meetings");
            }
        })
    );

    const handleEdit = useCallback(() => {
        setUpdateMeetingDialogOpen(true);
    }, []);

    const handleRemove = useCallback(async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({ id: meetingId });
    }, [confirmRemove, meetingId, removeMeeting]);

    if (!data) {
        return <ErrorState 
            title="Meeting not found"
            description="The meeting you're looking for doesn't exist or you don't have access to it."
        />;
    }



    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog 
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                isMobile={isMobile}
                initialValues={data}
            />
            <MeetingIdViewHeader 
                meetingId={meetingId}
                meetingName={data.name}
                onEdit={handleEdit}
                onRemove={handleRemove}
            />
            <Suspense fallback={<LoadingState 
                title="Loading meeting details"
                description="Please wait while we load the meeting details"
            />}>
                <div className="bg-muted rounded-md min-h-[300px] p-0">
                  <MeetingContent meetingId={meetingId} />
                </div>
            </Suspense>
        </>
    );
}

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState 
            title="Loading meeting details"
            description="Please wait while we load the meeting details"
        />
    );
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState 
            title="Error loading meeting details"
            description="Please try again later"
        />
    );
}
