import React from "react";

interface ProcessingStateProps {
  title?: string;
  description?: string;
}

export function ProcessingState({ title = "Meeting completed", description = "This meeting was completed, a summary will appear soon." }: ProcessingStateProps) {
  return (
    <div className="flex flex-col gap-2 mt-4 items-start">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
}
