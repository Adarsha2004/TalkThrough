"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { AgentForm } from "../components/agent-form";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data, isLoading, isError } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Agent</h1>
                <Button onClick={() => setOpen(true)}>+ New Agent</Button>
            </div>
            {isMobile ? (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>New Agent</DrawerTitle>
                        </DrawerHeader>
                        <AgentForm onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)} />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Agent</DialogTitle>
                        </DialogHeader>
                        <AgentForm onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return(
        <LoadingState title="Loading Agents" description="This may take a few seconds..."/>
    )
}

export const AgentsViewError = () => {
    return(
        <ErrorState title="Error Loading Agents" description="Please try again later"/>
    )
}