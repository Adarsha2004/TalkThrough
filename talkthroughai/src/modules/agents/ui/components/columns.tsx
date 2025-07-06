"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { VideoIcon } from "lucide-react"


export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Profile",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 border-b last:border-b-0 py-2">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.original.id}
          className="w-12 h-12 min-w-12 min-h-12"
        />
        <div className="flex flex-col justify-center">
          <span className="font-bold text-base">{row.original.name}</span>
          <span className="text-xs text-muted-foreground flex items-center">
            <span className="mr-1">↳</span>
            <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
              {row.original.instructions}
            </span>
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey:"meetingCount",
    header:"Meeting",
    cell:({row}) => (
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 [&svg]:size-4 max-w-[120px] truncate"
          style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
        >
          <VideoIcon className="tex-blue-700"/>
          <span className="truncate">
            {row.original.meetingCount}
            <span className="hidden sm:inline"> {row.original.meetingCount === 1 ? "meeting" : "meetings"}</span>
          </span>
        </Badge>
    )
  }
]