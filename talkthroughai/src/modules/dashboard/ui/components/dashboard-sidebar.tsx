"use client";

import { BotIcon, CreditCard, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection =[
    {
        icon:VideoIcon,
        label:"Meetings",
        href:"/meetings"
    },
    {
        icon:BotIcon,
        label:"Agents",
        href: "/agents"
    }
]

const secondSection =[
    {
        icon: CreditCard,
        label:"Upgrade",
        href:"/upgrade"
    }
]

export function DashboardSidebar(){
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="flex-shrink-0">
                <div className="flex items-center justify-center p-4">
                    <h1 className="text-2xl">TalkThroughAI</h1>
                </div>
            </SidebarHeader>
            <div className="border-b border-gray-700 mx-3" />
            <SidebarContent>
                <SidebarMenu>
                    {firstSection.map((item) =>(
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    className="w-full"
                                >
                                    <item.icon className={cn("size-5 mr-3")} />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                <SidebarMenu>
                    {secondSection.map((item) =>(
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    className="w-full"
                                >
                                    <item.icon className={cn("size-5 mr-3")} />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex-shrink-0">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}

