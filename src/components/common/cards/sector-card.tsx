import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Sector } from "@/api/types/sector.types";
import { useTranslation } from "react-i18next";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { handleCoordinatorClick } from "@/lib/coordinator.utils";
import { useAuth } from "@/hooks/use-auth.hook";
import { Lock } from "lucide-react";
import { IUserRole } from "@/interfaces/auth.interface";

interface SectorCardProps {
  sector: Sector;
}

export function SectorCard({ sector }: SectorCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isUserCoordinator = React.useMemo(() => {
    if (user?.role === IUserRole.Admin || user?.role === IUserRole.FinanceLead)
      return true;
    if (!user || !sector.currentCoordinators?.length) return false;
    return sector.currentCoordinators.some(
      (coordinator) => coordinator.userId === user.id
    );
  }, [sector.currentCoordinators, user]);

  return (
    <div className="h-full relative">
      {!isUserCoordinator && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <Link
        to={isUserCoordinator ? `/sectors/${sector.id}` : "#"}
        className={`h-full ${!isUserCoordinator ? "pointer-events-none" : ""}`}
        onClick={(e) => {
          if (!isUserCoordinator) {
            e.preventDefault();
            return;
          }

          const target = e.target as HTMLElement;
          if (target.closest(".coordinator-avatar")) {
            e.preventDefault();
          }
        }}
      >
        <Card className="hover:bg-accent transition-colors h-full flex flex-col justify-between">
          <CardHeader className="flex flex-col space-y-2 pb-2">
            <CardTitle className="text-lg font-bold truncate">
              {sector.name}
            </CardTitle>
            <div className="flex items-center">
              <Badge variant="secondary">
                {(sector.currentCoordinators?.length || 0) > 1
                  ? t("COORDINATORS")
                  : t("COORDINATOR")}{" "}
                ({sector.currentCoordinators?.length || 0})
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              {sector.currentCoordinators
                ?.slice(0, 3)
                .map((coordinator) => (
                  <InitialsAvatar
                    key={coordinator.id}
                    name={coordinator.name}
                    className="h-10 w-10 border-2 border-background cursor-pointer coordinator-avatar"
                    onClick={(e) =>
                      handleCoordinatorClick(coordinator.userId, navigate, e)
                    }
                  />
                ))}

              {sector.currentCoordinators &&
                sector.currentCoordinators.length > 3 && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Avatar className="h-10 w-10 border-2 border-background bg-muted cursor-pointer coordinator-avatar">
                        <AvatarFallback>
                          +{sector.currentCoordinators.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-3">
                      <div className="space-y-2">
                        {sector.currentCoordinators
                          .slice(3)
                          .map((coordinator) => (
                            <div
                              key={coordinator.id}
                              className="cursor-pointer hover:bg-accent p-2 rounded"
                              onClick={(e) =>
                                handleCoordinatorClick(
                                  coordinator.userId,
                                  navigate,
                                  e
                                )
                              }
                            >
                              <span>{coordinator.name}</span>
                            </div>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
