import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface ActiveStateProps {
  meetingId: string;
}

export function ActiveState({ meetingId }: ActiveStateProps) {
  return (
    <div className="flex gap-4 mt-4">
      <Link href={`/call/${meetingId}`}>
        <Button>
          Join Meeting
        </Button>
      </Link>
    </div>
  );
}
