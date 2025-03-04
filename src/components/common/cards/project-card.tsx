import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import { Project } from "@/api/types/sector.types.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { handleCoordinatorClick } from "@/lib/coordinator.utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Link
      to={`/sectors/${project.assignedToSectorId}/projects/${project.id}`}
      className="h-full"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".coordinator-avatar")) {
          e.preventDefault();
        }
      }}
    >
      <Card className="hover:bg-accent transition-colors h-[200px] flex flex-col justify-between">
        <CardHeader className="flex flex-col space-y-2 pb-2">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {project.name}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            {(project.currentCoordinators?.length || 0) > 1
              ? t("COORDINATORS")
              : t("COORDINATOR")}{" "}
            ({project.currentCoordinators?.length || 0})
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-4">
            {project.assignedToSectorName && (
              <div className="text-sm text-muted-foreground">
                {project.assignedToSectorName}
              </div>
            )}
            <div className="flex -space-x-2 min-h-[40px]">
              {project.currentCoordinators
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

              {project.currentCoordinators &&
                project.currentCoordinators.length > 3 && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Avatar className="h-10 w-10 border-2 border-background bg-muted cursor-pointer coordinator-avatar">
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
              {/* Placeholder to maintain height when there are no coordinators */}
              {(!project.currentCoordinators ||
                project.currentCoordinators.length === 0) && (
                <div className="w-8 h-8"></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
