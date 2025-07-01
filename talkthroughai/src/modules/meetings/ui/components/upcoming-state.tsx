import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MeetingStatus } from "@/modules/meetings/types";
import React from "react";
import Link from "next/link";

interface UpcomingStateProps {
  meetingId: string;
  name: string;
  agentID: string;
}

export function UpcomingState({ meetingId, name, agentID }: UpcomingStateProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  }));

  const handleStart = () => {
    updateMeeting.mutate({ id: meetingId, name, agentID, status: MeetingStatus.Active } as any);
  };

  const handleCancel = () => {
    updateMeeting.mutate({ id: meetingId, name, agentID, status: MeetingStatus.Cancelled } as any);
  };

  return (
    <div className="flex gap-4 mt-4">
      <Link href={`/call/${meetingId}`}>
        <Button onClick={handleStart} disabled={updateMeeting.isPending}>
          Start Meeting
        </Button>
      </Link>
      <Button onClick={handleCancel} variant="destructive" disabled={updateMeeting.isPending}>
        Cancel Meeting
      </Button>
    </div>
  );
}
