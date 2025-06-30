import {
    CircleXIcon,
    CircleCheckIcon,
    ClockArrowUpIcon,
    VideoIcon,
    LoaderIcon
} from "lucide-react";

import { CommandSelect } from "./command-select";

import { MeetingStatus } from "@/modules/meetings/types";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { Children } from "react";


const options =[{
    id:MeetingStatus.Upcoming,
    value:MeetingStatus.Upcoming,
    children: (
        <div className="flex items-center gap-x-2 capitalize">
            <ClockArrowUpIcon />
            {MeetingStatus.Upcoming}
        </div>
    )
},
{
    id:MeetingStatus.Active,
    value:MeetingStatus.Active,
    children: (
        <div className="flex items-center gap-x-2 capitalize">
            <VideoIcon />
            {MeetingStatus.Active}
        </div>
    )
},
{
    id:MeetingStatus.Completed,
    value:MeetingStatus.Completed,
    children: (
        <div className="flex items-center gap-x-2 capitalize">
            <CircleCheckIcon />
            {MeetingStatus.Completed}
        </div>
    )
},
{
    id:MeetingStatus.Processing,
    value:MeetingStatus.Processing,
    children: (
        <div className="flex items-center gap-x-2 capitalize">
            <LoaderIcon />
            {MeetingStatus.Processing}
        </div>
    )
},
{
    id:MeetingStatus.Cancelled,
    value:MeetingStatus.Cancelled,
    children: (
        <div className="flex items-center gap-x-2 capitalize">
            <CircleXIcon />
            {MeetingStatus.Cancelled}
        </div>
    )
}
];

export const StatusFilter = () => {
    const [{ status }, setFilters] = useMeetingsFilters();
    return (
        <CommandSelect
            placeholder="Status"
            options={options}
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={status ?? ""}
        />
    )
}