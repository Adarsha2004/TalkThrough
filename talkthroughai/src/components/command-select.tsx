import { ReactNode,useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "./ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";

interface Props{
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?:string;
    footer?: React.ReactNode;
};

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder,
    isSearchable = true,
    className,
    footer
}: Props) =>{
    const [open,setOpen] = useState(false);
    const selectedOption = options.find((option) => option.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                type = "button"
                variant="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}>
                    <div className="flex items-center gap-x-2">
                        {selectedOption?.children ?? placeholder}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    {isSearchable && (
                        <CommandInput placeholder="Search..." />
                    )}
                    <CommandList className="max-h-60 overflow-auto">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.value}
                                    onSelect={() => {
                                        onSelect(option.id);
                                        setOpen(false);
                                    }}
                                    className="flex items-center px-2 gap-2"
                                    style={{ minHeight: 40 }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            value === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.children}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {footer && <div className="border-t">{footer}</div>}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}