import { ChevronRightIcon,TrashIcon,PencilIcon,MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu"

import { ChevronRight } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import Link from "next/link";

interface Props {
    meetingId: string;
    meetingName: string;
    onEdit: () => void;
    onRemove: () => void;
}

export const MeetingIdViewHeader = ({
    meetingId,
    meetingName,
    onEdit,
    onRemove,
}: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/meetings">My Meetings</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <Link href={`/meetings/${meetingId}`} className="font-bold">{meetingName}</Link>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onRemove}>
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}