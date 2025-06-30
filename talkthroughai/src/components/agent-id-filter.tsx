import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "./command-select";
import { GeneratedAvatar } from "./generated-avatar";

import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { DEFAULT_PAGE } from "@/constants";


export const AgentIdFilter = () => {
    const [{ agentId }, setFilters] = useMeetingsFilters();
    const trpc = useTRPC();
    const [agentSearch, setAgentSearch] = useState("");
    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    );

    return (
        <div className="flex items-center gap-2">
            <CommandSelect 
                className="h-9"
                placeholder="Agent"
                options={(data?.items.map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                        <div className="flex items-center gap-x-2">
                            {agent.name}
                        </div>
                    )
                })) ?? [])}
                onSelect={(value) => setFilters({ agentId: value })}
                onSearch={setAgentSearch}
                value={agentId ?? ""}
            />
            <button
                type="button"
                className="ml-1 p-2 rounded hover:bg-muted border border-input"
                title="Clear all filters"
                onClick={() => setFilters({ search: "", status: null, agentId: "", page: DEFAULT_PAGE })}
            >
                <XIcon className="w-4 h-4" />
            </button>
        </div>
    )
}