"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { Command, CommandInput } from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { DashbboardCommand } from "./dashboard-command";
import { useState } from "react";
import { useEffect } from "react";

export const DashboardNavbar= () => {

    const { state, toggleSidebar, isMobile, openMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const down =(e:KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open)
            }
        };

        document.addEventListener("keydown",down);
        return () => document.removeEventListener("keydown",down);
    },[]);

    return (
        <>
        <DashbboardCommand open={commandOpen} setOpen={setCommandOpen}/>
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
            <Button className="size-9" variant="outline" onClick={toggleSidebar}>
               {isMobile
                 ? (openMobile ? <PanelLeftCloseIcon className="size-4"/> : <PanelLeftIcon className="size-4"/>)
                 : (state === "collapsed" ? <PanelLeftIcon className="size-4"/> : <PanelLeftCloseIcon className="size-4"/>)
               }
            </Button>

            <Button className="h-9 w-[300px] justify-start font-normal text-muted p-0" variant="outline" size="sm" asChild
            onClick={() => setCommandOpen((open: boolean) => !open)}>
                <div className="flex items-center gap-2">
                    <Command>
                        <CommandInput placeholder="Search..." />
                    </Command>
                    <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </Button>
        </nav>
        </>
    )
}