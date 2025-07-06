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
            <SidebarHeader className="flex-shrink-0 relative p-4 border border-gray-700 bg-background">
                {/* L-shaped corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500 -mt-px -ml-px" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-500 -mt-px -mr-px" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-500 -mb-px -ml-px" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500 -mb-px -mr-px" />
                <div className="flex items-center justify-center">
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

