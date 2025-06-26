import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
    seed,
    className,
    variant
}: GeneratedAvatarProps) => {
    let avatar;

    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed,
        });
    } else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
        });
    }

    return (
        <Avatar className={cn("w-16 h-16", className)}>
            <AvatarImage src={avatar.toDataUri()} alt="Avatar" className="w-16 h-16" />
            <AvatarFallback className="w-16 h-16 flex items-center justify-center">{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}
