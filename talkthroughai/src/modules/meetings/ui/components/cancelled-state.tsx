import React from "react";

interface CancelledStateProps {
  title?: string;
  description?: string;
}

export function CancelledState({ title = "Meeting Cancelled", description = "This meeting was cancelled" }: CancelledStateProps) {
  return (
    <div className="flex flex-col gap-2 mt-4 items-start">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
}
