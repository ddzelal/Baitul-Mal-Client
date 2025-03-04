import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { bottomNavigationLinks } from "@/constants/navigation-links.tsx";
import { Plus } from "lucide-react";
import { CreateTransactionModal } from "../transactions/create-transaction-modal";
import { useAuth } from "@/hooks/use-auth.hook";
import { IUserRole } from "@/interfaces/auth.interface";

interface BottomNavigationBarProps {
  isNavVisible: boolean;
}

export const BottomNavigationBar = ({
  isNavVisible,
}: BottomNavigationBarProps) => {
  const location = useLocation();
  const navigation = useNavigate();
  const { user } = useAuth();

  return (
    <nav
      className={cn(
        "lg:hidden border-t bg-background fixed bottom-0 left-0 right-0 transition-transform duration-300 z-50",
        !isNavVisible && "translate-y-full"
      )}
    >
      <div className="flex justify-around p-2 relative">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted" />
        {bottomNavigationLinks.map((link, index) => {
          const isActive = location.pathname === link.to;

          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "flex-1 p-1 relative group",
                "transition-all duration-300 ease-in-out",
                isActive && "bg-secondary"
              )}
              onClick={() => navigation(link.to)}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out transform",
                    isActive && "scale-110 -translate-y-1"
                  )}
                >
                  <link.icon
                    className={cn(
                      "transition-all duration-300",
                      "group-hover:text-primary group-hover:scale-110"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5",
                    "transform transition-all duration-300 ease-in-out",
                    isActive
                      ? "bg-violet scale-100 opacity-100"
                      : "scale-0 opacity-0",
                    "group-hover:scale-75 group-hover:opacity-50"
                  )}
                />
              </div>
            </Button>
          );
        })}

        {/* Centralni Create Transaction button */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-2",
            "transition-transform duration-300",
            !isNavVisible && "translate-y-[-100%] opacity-0"
          )}
        >
          {user?.role !== IUserRole.Unassigned && (
            <CreateTransactionModal
              trigger={
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-violet hover:bg-violet-hover hover:scale-105 
                          shadow-[0_8px_30px_rgba(139,92,246,0.3)] transition-all duration-200 
                          border-4 border-background"
                  variant="default"
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
              }
            />
          )}
        </div>
      </div>
    </nav>
  );
};
