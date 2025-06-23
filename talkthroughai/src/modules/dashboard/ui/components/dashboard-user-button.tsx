import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useState } from "react";

export const DashboardUserButton = () => {
    const router = useRouter();
    const { state } = useSidebar();
    const { data , isPending} = authClient.useSession();
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);
    if (isPending || !data?.user){
        return null;
    }
    const { user } = data;

    if (isMobile) {
        return (
            <>
                <Button variant="ghost" className="w-full justify-start items-center gap-x-3 px-2.5" onClick={() => setDrawerOpen(true)}>
                    <GeneratedAvatar 
                        seed={user.name || "User"}
                        variant="initials"
                        className="size-8"
                    />
                    <span
                        className={cn(
                            "truncate transition-opacity duration-200",
                            state === "collapsed" && "opacity-0"
                        )}
                    >
                        {user.name}
                    </span>
                </Button>
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>User Info</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 flex flex-col items-center gap-2">
                            <GeneratedAvatar 
                                seed={user.name || "User"}
                                variant="initials"
                                className="size-16"
                            />
                            <p className="font-medium text-lg">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <Button 
                                className="mt-4 flex items-center gap-x-2 w-full"
                                variant="destructive"
                                onClick={() => authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => router.push("/sign-in")
                                    }
                                })}
                            >
                                <LogOut className="size-4"/>
                                Sign out
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="mt-2 w-full">Close</Button>
                            </DrawerClose>
                        </div>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="w-full justify-start items-center gap-x-3 px-2.5">
                    <GeneratedAvatar 
                        seed={user.name || "User"}
                        variant="initials"
                        className="size-8"
                    />
                     <span
                        className={cn(
                            "truncate transition-opacity duration-200",
                            state === "collapsed" && "opacity-0"
                        )}
                    >
                        {user.name}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => router.push("/sign-in")
                        }
                    })}
                >
                    <LogOut className="size-4"/>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}