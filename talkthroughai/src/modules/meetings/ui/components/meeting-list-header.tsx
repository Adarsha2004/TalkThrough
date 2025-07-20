"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { StatusFilter } from "@/components/status-filter";
import { AgentIdFilter } from "@/components/agent-id-filter";

export const MeetingListHeader = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [{ search }, setFilters] = useMeetingsFilters();


  return (
    <div className="sticky top-0 z-10 bg-background shadow-sm pb-2 mb-2 px-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">My Meetings</h1>
        <Button onClick={() => setOpen(true)}>+ New Meeting</Button>
      </div>
      <div className="mb-2 flex flex-row gap-2 items-center">
        <Input
          type="text"
          placeholder="Search meetings..."
          value={search}
          onChange={e => setFilters({ search: e.target.value })}
          className="max-w-xs"
        />
        <StatusFilter />
        <AgentIdFilter />
      </div>
      <NewMeetingDialog open={open} onOpenChange={setOpen} isMobile={isMobile} />
    </div>
  );
};
