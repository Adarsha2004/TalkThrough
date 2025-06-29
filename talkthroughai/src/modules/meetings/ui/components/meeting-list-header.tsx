"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export const MeetingListHeader = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm pb-2 mb-2">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">My Meetings</h1>
        <Button onClick={() => setOpen(true)}>+ New Meeting</Button>
      </div>
      <NewMeetingDialog open={open} onOpenChange={setOpen} isMobile={isMobile} />
    </div>
  );
};
