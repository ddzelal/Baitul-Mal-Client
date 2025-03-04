import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface InitialsAvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const InitialsAvatar = forwardRef<HTMLDivElement, InitialsAvatarProps>(
  ({ name, className, onClick, ...props }, ref) => {
    return (
      <Avatar ref={ref} className={className} onClick={onClick} {...props}>
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
    );
  }
);

InitialsAvatar.displayName = "InitialsAvatar";
