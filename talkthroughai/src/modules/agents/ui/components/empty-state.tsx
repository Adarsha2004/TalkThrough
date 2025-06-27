import React from "react";

export const MakeEmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] mx-auto">
    {/* Illustration */}
    <div className="mb-6">
      <div className="w-40 h-16 bg-muted rounded-lg shadow flex flex-col justify-center items-center relative">
        <div className="w-28 h-2 bg-green-500 rounded-full absolute top-4 left-1/2 -translate-x-1/2" />
        <div className="w-24 h-2 bg-gray-200 rounded-full absolute top-8 left-1/2 -translate-x-1/2" />
        <div className="w-20 h-2 bg-gray-200 rounded-full absolute top-12 left-1/2 -translate-x-1/2" />
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-2 text-center">Create your first agent</h2>
    <p className="text-muted-foreground text-center max-w-md">
      Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call.
    </p>
  </div>
);
