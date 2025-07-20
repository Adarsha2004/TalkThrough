"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    CircleCheckIcon,
    CircleXIcon,
    CircleArrowUpIcon,
    ClockFadingIcon,
    LoaderIcon,
    CornerDownRightIcon,
} from "lucide-react"
import { MeetingGetMany } from "../../types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDuration } from "@/lib/utils";


const statusIconMap = {
    upcoming: LoaderIcon,
    active: CircleArrowUpIcon,
    completed: CircleCheckIcon,
    processing: ClockFadingIcon,
    cancelled: CircleXIcon,
}

const statusColorMap = {
    upcoming: "text-yellow-500",
    active: "text-blue-500",
    completed: "text-green-500",
    processing: "text-orange-500",
    cancelled: "text-red-500",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting",
        cell: ({ row }) => (
            <div className="flex flex-col justify-center py-3">
                <Link
                    href={`/dashboard/meetings/${row.original.id}`}
                    className="font-bold text-base leading-tight hover:underline"
                >
                    {row.original.name}
                </Link>
                <span className="text-xs text-muted-foreground mt-1 flex items-center">
                    <CornerDownRightIcon className="w-3 h-3 mr-1" />
                    {row.original.agent?.name ?? "—"}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status] || LoaderIcon;
            return (
                <span className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", statusColorMap[row.original.status], "bg-muted")}> 
                    <Icon className="w-4 h-4" />
                    {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                </span>
            );
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) =>
            row.original.duration && row.original.duration > 0 ? (
                <span className="flex items-center text-xs">
                    <ClockFadingIcon className="inline w-4 h-4 mr-1 text-muted-foreground" />
                    {formatDuration(row.original.duration)}
                </span>
            ) : (
                <span className="text-muted-foreground flex items-center text-xs">
                    <ClockFadingIcon className="inline w-4 h-4 mr-1" />
                    No Duration
                </span>
            ),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <span className="text-xs">{format(new Date(row.original.createdAt), "PP")}</span>,
        meta: {
            className: "hidden lg:table-cell"
        }
    },
];