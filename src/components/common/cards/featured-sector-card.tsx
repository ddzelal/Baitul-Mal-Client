import { Sector } from "@/api/types/sector.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { useNavigate } from "react-router-dom";
import { handleCoordinatorClick } from "@/lib/coordinator.utils";

interface FeaturedSectorCardProps {
  sector: Sector;
}

export function FeaturedSectorCard({ sector }: FeaturedSectorCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [individualPopoverStates, setIndividualPopoverStates] = React.useState<{
    [key: string]: boolean;
  }>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          {sector.name}
          <span className="text-sm text-muted-foreground">
            {t("FEATURED_SECTOR")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">
              {(sector.currentCoordinators?.length || 0) > 1
                ? t("COORDINATORS")
                : t("COORDINATOR")}{" "}
              ({sector.currentCoordinators?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {sector.currentCoordinators?.slice(0, 5).map((coordinator) => (
                <div
                  key={coordinator.id}
                  className="flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1 cursor-pointer hover:bg-secondary/30"
                  onClick={(e) =>
                    handleCoordinatorClick(coordinator.userId, navigate, e)
                  }
                >
                  <InitialsAvatar
                    name={coordinator.name}
                    className="h-8 w-8"
                    onClick={(e) =>
                      handleCoordinatorClick(coordinator.userId, navigate, e)
                    }
                  />
                  <span className="text-sm">{coordinator.name}</span>
                </div>
              ))}
              {sector.currentCoordinators &&
                sector.currentCoordinators.length > 5 && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1 cursor-pointer coordinator-avatar">
                        <span className="text-sm text-muted-foreground">
                          +{sector.currentCoordinators.length - 5} {t("MORE")}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-3">
                      <div className="space-y-2">
                        {sector.currentCoordinators
                          .slice(5)
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
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">
              {t("ACTIVE_PROJECTS")} ({sector.projects?.length || 0})
            </h3>
            <div className="grid gap-2">
              {sector.projects?.map((project) => (
                <div
                  key={project.id}
                  className="p-3 bg-secondary/10 rounded-lg space-y-2"
                >
                  <h4 className="font-medium">{project.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {project.currentCoordinators &&
                      project.currentCoordinators.length > 0 && (
                        <div className="flex -space-x-2">
                          {project.currentCoordinators
                            .slice(0, 3)
                            .map((coordinator) => (
                              <InitialsAvatar
                                key={coordinator.id}
                                name={coordinator.name}
                                className="h-8 w-8 border-2 border-background cursor-pointer coordinator-avatar"
                                onClick={(e) =>
                                  handleCoordinatorClick(
                                    coordinator.userId,
                                    navigate,
                                    e
                                  )
                                }
                              />
                            ))}
                          {project.currentCoordinators.length > 3 && (
                            <Popover
                              open={
                                individualPopoverStates[
                                  `project-${project.id}-more`
                                ]
                              }
                              onOpenChange={(isOpen) => {
                                setIndividualPopoverStates((prev) => ({
                                  ...prev,
                                  [`project-${project.id}-more`]: isOpen,
                                }));
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Avatar className="h-8 w-8 border-2 border-background bg-muted cursor-pointer coordinator-avatar">
                                  <AvatarFallback>
                                    +{project.currentCoordinators.length - 3}
                                  </AvatarFallback>
                                </Avatar>
                              </PopoverTrigger>
                              <PopoverContent className="w-fit p-3">
                                <div className="space-y-2">
                                  {project.currentCoordinators
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
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
