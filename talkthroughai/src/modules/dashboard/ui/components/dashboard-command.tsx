import { CommandDialog, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashbboardCommand = ({ open, setOpen }: Props) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Search Dashboard</DrawerTitle>
                    </DrawerHeader>
                    <Command>
                        <CommandInput placeholder="Find a meeting or agent" />
                        <CommandList>
                            <CommandItem>
                                Test
                            </CommandItem>
                        </CommandList>
                    </Command>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen} title="Search Dashboard">
            <CommandInput placeholder="Find a meeting or agent" />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandDialog>
    );
};