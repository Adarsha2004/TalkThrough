"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "./meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "./update-meeting-dialog";
import { useState, useCallback, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="text-lg font-bold">Meeting Details</div>
            <div>Meeting ID: {meetingId}</div>
            <div>Meeting Name: {data.name}</div>
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
                router.push("/meetings");
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
                <MeetingContent meetingId={meetingId} />
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
