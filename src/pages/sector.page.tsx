import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/common/cards/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotFound } from "@/components/common/not-found/not-found";
import { Loading } from "@/components/common/loading/loading";
import { SectorQueries } from "@/api/queries/sector.queries";
import { useTranslation } from "react-i18next";
import { BudgetCard } from "@/components/common/cards/budget-card";
import { CreditCard, Clock } from "lucide-react";
import { Coordinator, Project } from "@/api/types/sector.types.ts";
import { AddCoordinatorModal } from "@/components/modals/add-coordinator-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import CreateProjectModal from "@/components/modals/create-project-modal";

export default function SectorPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: sector, isLoading, refetch } = SectorQueries.useGetById(id!);
  const { isOpen, openModal, closeModal } = useModal();

  const handleModalClose = () => {
    closeModal();
    refetch();
  };

  if (isLoading) {
    return <Loading type="SECTOR" />;
  }

  if (!sector) {
    return <NotFound type="SECTOR" />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{sector.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Coordinators Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("COORDINATORS")}</h3>
                <AddCoordinatorModal
                  item={sector}
                  organizationDomainType="sector"
                  organizationDomainId={sector.id}
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
              {sector.currentCoordinators.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {sector.currentCoordinators.map(
                    (coordinator: Coordinator) => (
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
                        <span>{coordinator.name}</span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>{t("NO_COORDINATORS_FOR_SECTOR")}</p>
              )}
            </div>

            {/* Budget Section */}
            {sector.budget && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("BUDGET")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <BudgetCard
                    type="assigned"
                    icon={CreditCard}
                    label={t("ASSIGNED")}
                    amount={sector.budget.assignedAmount}
                  />
                  <BudgetCard
                    type="unassigned"
                    icon={CreditCard}
                    label={t("UNASSIGNED")}
                    amount={sector.budget.unassignedAmount}
                  />
                  <BudgetCard
                    type="reserved"
                    icon={CreditCard}
                    label={t("RESERVED")}
                    amount={sector.budget.reservedAmount}
                  />
                  <BudgetCard
                    type="pending"
                    icon={Clock}
                    label={t("PENDING")}
                    amount={sector.budget.pendingAmount}
                  />
                  <BudgetCard
                    type="spent"
                    icon={CreditCard}
                    label={t("SPENT")}
                    amount={sector.budget.spentAmount}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("PROJECTS_IN_THIS_SECTOR")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="w-auto"
            onClick={openModal}
          >
            {t("CREATE_PROJECT")}
          </Button>
        </div>
        {sector.projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sector.projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p>{t("NO_PROJECTS_FOR_SECTOR")}</p>
        )}
      </div>

      <CreateProjectModal
        isOpen={isOpen}
        onClose={handleModalClose}
        sector={sector}
      />
    </div>
  );
}
