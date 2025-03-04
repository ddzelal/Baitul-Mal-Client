import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotFound } from "@/components/common/not-found/not-found";
import { Loading } from "@/components/common/loading/loading";
import { ProjectQueries } from "@/api/queries/project.queries";
import { useTranslation } from "react-i18next";
import { BudgetCard } from "@/components/common/cards/budget-card";
import { CreditCard, Clock, CalendarDays } from "lucide-react";
import { ProjectStatusBadge } from "@/components/common/status/project-status-badge";
import { formatDate } from "@/lib/utils";
import { AddCoordinatorModal } from "@/components/modals/add-coordinator-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import EditProjectModal from "@/components/modals/edit-project-modal";

export default function ProjectPage() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const {
    data: project,
    isLoading,
    refetch,
  } = ProjectQueries.useGetById(projectId!);
  const { isOpen, openModal, closeModal } = useModal();

  const handleModalClose = () => {
    closeModal();
    refetch(); // Refetch project data after closing the modal
  };

  if (isLoading) {
    return <Loading type="PROJECT" />;
  }

  if (!project) {
    return <NotFound type="PROJECT" />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl break-words">
              {project.name}
            </CardTitle>
            <ProjectStatusBadge status={project.outcomeType} />
          </div>
          <div className="text-sm text-muted-foreground space-y-2 min-w-[200px]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {t("CREATED")}: {formatDate(project.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {project.modifiedAt
                  ? `${t("MODIFIED")}: ${formatDate(project.modifiedAt)}`
                  : t("PROJECT_NEVER_MODIFIED")}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={openModal}>
            {t("EDIT_PROJECT")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Description */}
            {project.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {t("PROJECT_DESCRIPTION")}
                </h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}

            {/* Sector Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("SECTOR")}</h3>
              <p>{project?.assignedToSectorName}</p>
            </div>

            {/* Coordinators Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("COORDINATORS")}</h3>
                <AddCoordinatorModal
                  item={project}
                  organizationDomainType="project"
                  organizationDomainId={project.id}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      {t("ADD_COORDINATORS")}
                    </Button>
                  }
                />
              </div>
              {project.currentCoordinators.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {project.currentCoordinators.map((coordinator) => (
                    <div
                      key={coordinator.id}
                      className="flex items-center gap-2"
                    >
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?text=${coordinator.name.charAt(0)}`}
                        />
                        <AvatarFallback>
                          {coordinator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{coordinator.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {coordinator.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t("NO_COORDINATORS_FOR_PROJECT")}</p>
              )}
            </div>

            {/* Budget Section */}
            {project?.budget && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("BUDGET")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <BudgetCard
                    type="assigned"
                    icon={CreditCard}
                    label={t("ASSIGNED")}
                    amount={project.budget.assignedAmount}
                  />
                  <BudgetCard
                    type="unassigned"
                    icon={CreditCard}
                    label={t("UNASSIGNED")}
                    amount={project.budget.unassignedAmount}
                  />
                  <BudgetCard
                    type="reserved"
                    icon={CreditCard}
                    label={t("RESERVED")}
                    amount={project.budget.reservedAmount}
                  />
                  <BudgetCard
                    type="pending"
                    icon={Clock}
                    label={t("PENDING")}
                    amount={project.budget.pendingAmount}
                  />
                  <BudgetCard
                    type="spent"
                    icon={CreditCard}
                    label={t("SPENT")}
                    amount={project.budget.spentAmount}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditProjectModal
        isOpen={isOpen}
        onClose={handleModalClose}
        project={project}
        sectorId={project.assignedToSectorId}
      />
    </div>
  );
}
