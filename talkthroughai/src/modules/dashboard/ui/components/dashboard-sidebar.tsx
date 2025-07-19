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
    useSidebar,
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
    const { setOpenMobile } = useSidebar();
    
    const handleMenuClick = () => {
        setOpenMobile(false);
    };
    
    return (
        <Sidebar>
            <Link href="/" tabIndex={0} aria-label="Home" className="block">
              <SidebarHeader className="flex items-center h-16 relative border border-gray-700 bg-background group/sidebar-header cursor-pointer">
                  {/* L-shaped corners on hover */}
                  <div className="pointer-events-none">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500 opacity-0 group-hover/sidebar-header:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500 opacity-0 group-hover/sidebar-header:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500 opacity-0 group-hover/sidebar-header:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500 opacity-0 group-hover/sidebar-header:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex justify-center">
                    <h1 className="text-2xl">TalkThroughAI</h1>
                  </div>
              </SidebarHeader>
            </Link>
            <SidebarContent>
                <SidebarMenu>
                    {firstSection.map((item) =>(
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href} onClick={handleMenuClick}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    className="w-full relative group/sidebar-btn"
                                >
                                    {/* L-shaped corners on hover */}
                                    <div className="pointer-events-none">
                                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500 opacity-0 group-hover/sidebar-btn:opacity-100 transition-opacity" />
                                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500 opacity-0 group-hover/sidebar-btn:opacity-100 transition-opacity" />
                                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500 opacity-0 group-hover/sidebar-btn:opacity-100 transition-opacity" />
                                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500 opacity-0 group-hover/sidebar-btn:opacity-100 transition-opacity" />
                                    </div>
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
                            <Link href={item.href} onClick={handleMenuClick}>
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

