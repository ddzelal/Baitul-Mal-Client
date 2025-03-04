import { ProjectOutcomeType } from "@/api/types/project.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

const mapStringToEnum = (status: string): ProjectOutcomeType => {
  return ProjectOutcomeType[status as keyof typeof ProjectOutcomeType];
};

const formatStatusText = (status: string): string => {
  return status
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  const getStatusConfig = (status: ProjectOutcomeType) => {
    switch (status) {
      case ProjectOutcomeType.Success:
        return {
          label: "SUCCESS",
          className:
            "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800",
        };
      case ProjectOutcomeType.Failed:
        return {
          label: "FAILED",
          className:
            "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800",
        };
      case ProjectOutcomeType.PartialSuccess:
        return {
          label: "PARTIAL_SUCCESS",
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800",
        };
      case ProjectOutcomeType.Postoponed:
        return {
          label: "POSTPONED",
          className:
            "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800",
        };
      case ProjectOutcomeType.Paused:
        return {
          label: "PAUSED",
          className:
            "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800",
        };
      case ProjectOutcomeType.Stoped:
        return {
          label: "STOPPED",
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        };
      case ProjectOutcomeType.Ongoing:
        return {
          label: "ONGOING",
          className:
            "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800",
        };
      case ProjectOutcomeType.NewlyCreated:
        return {
          label: "NEWLY_CREATED",
          className:
            "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800",
        };
      default:
        return {
          label: "UNKNOWN",
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        };
    }
  };

  const enumStatus = mapStringToEnum(status);
  const config = getStatusConfig(enumStatus);

  return (
    <Badge
      className={cn(
        config.className,
        "transition-colors duration-200",
        className
      )}
    >
      {formatStatusText(status)}
    </Badge>
  );
}
