import { CommandDialog, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashbboardCommand = ({ open, setOpen }: Props) => {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState("");
    const router = useRouter();
    const trpc = useTRPC();

    // Reset search when dialog closes
    useEffect(() => {
        if (!open) {
            setSearch("");
        }
    }, [open]);

    // Fetch meetings and agents with proper enabled condition
    const meetings = useQuery({
        ...trpc.meetings.getMany.queryOptions({
            search,
            pageSize: 100
        }),
        enabled: search.length > 0, // Only fetch when there's a search term
    });

    const agents = useQuery({
        ...trpc.agents.getMany.queryOptions({
            search,
            pageSize: 100
        }),
        enabled: search.length > 0, // Only fetch when there's a search term
    });

    const loading = (meetings.isLoading || agents.isLoading) && !!search;
    
    const results = useMemo(() => {
        if (!search || search.trim().length === 0) return [];
        
        const meetingResults = meetings.data?.items?.map((m: { id: string; name: string }) => ({
            type: "meeting" as const,
            id: m.id,
            name: m.name,
        })) || [];
        
        const agentResults = agents.data?.items?.map((a: { id: string; name: string }) => ({
            type: "agent" as const,
            id: a.id,
            name: a.name,
        })) || [];
        
        return [...meetingResults, ...agentResults];
    }, [meetings.data, agents.data, search]);

    const handleSelect = (item: { type: string, id: string }) => {
        setOpen(false);
        if (item.type === "meeting") {
            router.push(`/meetings/${item.id}`);
        } else if (item.type === "agent") {
            router.push(`/agents/${item.id}`);
        }
    };

    const CommandUI = (
        <Command shouldFilter={false}> {/* Disable built-in filtering since we're doing server-side search */}
            <CommandInput 
                placeholder="Find a meeting or agent" 
                value={search} 
                onValueChange={setSearch}
                autoFocus
            />
            <CommandList className="max-h-[60vh] overflow-y-auto">
                {loading && (
                    <CommandItem disabled>
                        <span className="text-muted-foreground">Loading...</span>
                    </CommandItem>
                )}
                {!loading && results.length === 0 && search.trim().length > 0 && (
                    <CommandItem disabled>
                        <span className="text-muted-foreground">No results found</span>
                    </CommandItem>
                )}
                {!loading && search.trim().length === 0 && (
                    <CommandItem disabled>
                        <span className="text-muted-foreground">Start typing to search...</span>
                    </CommandItem>
                )}
                {!loading && results.map(item => (
                    <CommandItem 
                        key={`${item.type}-${item.id}`} 
                        onSelect={() => handleSelect(item)}
                        value={`${item.type}-${item.id}-${item.name}`} // Ensure unique value
                    >
                        <span className="mr-2">
                            {item.type === "meeting" ? "📅" : "🤖"}
                        </span>
                        <span>{item.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground capitalize">
                            {item.type}
                        </span>
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Search Dashboard</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
                        {CommandUI}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            {CommandUI}
        </CommandDialog>
    );
};