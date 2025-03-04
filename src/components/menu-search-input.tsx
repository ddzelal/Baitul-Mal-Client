"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectQueries } from "@/api/queries/project.queries";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectStatusBadge } from "@/components/common/status/project-status-badge";
import { useAuth } from "@/hooks/use-auth.hook";
import { IUserRole } from "@/interfaces/auth.interface";

export function MenuSearchInput() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonCurrentWidth, setButtonCurrentWidth] = useState(0);
  const { user } = useAuth();

  const { data: projects } = ProjectQueries.useGetAll(
    {
      PageNumber: 1,
      PageSize: 10,
      SearchTerm: searchTerm,
    },
    user?.role !== IUserRole.Unassigned
  );

  const handleSelect = (projectId: string, sectorId: string) => {
    navigate(`/sectors/${sectorId}/projects/${projectId}`);
    setOpen(false);
  };

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonCurrentWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex flex-1 justify-between mobile:max-w-md mobile:mx-auto px-4 sm:mx-8 md:mx-10"
        >
          {t("SEARCH_BY_PROJECT")}
          <Search className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: `${buttonCurrentWidth}px` }}
      >
        <Command>
          <CommandInput
            placeholder={t("SEARCH_BY_PROJECT")}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>{t("NO_PROJECTS_FOUND")}</CommandEmpty>
            <CommandGroup>
              {projects?.items.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.id}
                  onSelect={() =>
                    handleSelect(project.id, project.assignedToSectorId)
                  }
                  className="flex items-center gap-2"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.assignedToSectorName}
                    </span>
                  </div>
                  <ProjectStatusBadge
                    status={project.outcomeType}
                    className="ml-auto"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
