"use client";

import { authClient } from "@/lib/auth-client";
import { LoadingState } from "@/components/loading-state";
import { enIE } from "date-fns/locale";
import { Description } from "@radix-ui/react-dialog";
import { ChatUI } from "./chatui";

interface Props {
    meetingId:string;
    meetingName:string
}

export const chat = ({meetingId,meetingName}:Props) => {
    const { data, isPending} = authClient.useSession();

    if (isPending||!data?.user){
        return (
            <LoadingState
            title="Loading..."
            description="Please wait while we load the chat"
            />
        )
    }

    return (
        <ChatUI
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name}
        userImage={data.user.image ?? ""}
        />
    )
}