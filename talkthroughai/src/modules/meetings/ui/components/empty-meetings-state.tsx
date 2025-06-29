"use client";

export function EmptyMeetingsState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      {/* Illustration */}
      <div className="mb-8">
        <div className="w-32 h-20 bg-muted rounded-lg flex flex-col items-center justify-center p-4">
          <div className="w-24 h-3 bg-green-400 rounded mb-2" />
          <div className="w-20 h-2 bg-muted-foreground/30 rounded" />
        </div>
      </div>
      {/* Headline */}
      <h2 className="text-2xl font-semibold text-center mb-2">
        <span className="bg-muted px-2 py-1 rounded font-bold">Create your first meeting</span>
      </h2>
      {/* Description */}
      <p className="text-muted-foreground text-center max-w-md">
        Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time.
      </p>
    </div>
  );
} 