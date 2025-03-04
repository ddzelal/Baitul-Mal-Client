import { Suspense, useEffect } from "react";
import { SectorCard } from "@/components/common/cards/sector-card";
import { ProjectCard } from "@/components/common/cards/project-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth.hook";
import { OrganizationQueries } from "@/api/queries/organization.queries";
import { useTranslation } from "react-i18next";
import { SectorQueries } from "@/api/queries/sector.queries";
import { FeaturedSectorCard } from "@/components/common/cards/featured-sector-card";
import { Loading } from "@/components/common/loading/loading";
import { IUserRole } from "@/interfaces/auth.interface";
export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: organization } = OrganizationQueries.useGet();
  const {
    data: sectorsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = SectorQueries.useGetAllInfinite(
    {
      PageSize: 5,
    },
    user?.role !== IUserRole.Unassigned
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      const timer = setInterval(() => {
        fetchNextPage();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sectors = sectorsData?.pages.flatMap((page) => page.items) ?? [];

  if (!organization || isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Organization Info */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 text-white">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            {organization.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {t("WELCOME_BACK")}, {user?.name} {user?.lastName}
          </p>
        </CardContent>
      </Card>

      {/* Featured Sector Card */}
      {sectors[0] && <FeaturedSectorCard sector={sectors[0]} />}

      {/* Sectors Scroll Area */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">{t("SECTORS")}</h2>
        {sectors.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {t("YOUR_ORGANIZATION_HAS_NO_SECTORS")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {sectors.map((sector) => (
                <div key={sector.id} className="w-[300px]">
                  <SectorCard sector={sector} />
                </div>
              ))}
              {(hasNextPage || isFetchingNextPage) && (
                <div className="flex items-center justify-center w-[100px] h-full">
                  <div className="flex flex-col items-center gap-2 mt-12">
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-4 rounded-full animate-spin bg-primary/20" />
                      <Skeleton className="h-4 w-4 rounded-full animate-spin bg-primary/20" />
                      <Skeleton className="h-4 w-4 rounded-full animate-spin bg-primary/20" />
                    </div>
                    <span className="text-sm text-primary">{t("LOADING")}</span>
                  </div>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">{t("PROJECTS")}</h2>
        {sectors.every((sector) => !sector.projects?.length) ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {t("YOUR_ORGANIZATION_HAS_NO_PROJECTS")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<ProjectsSkeleton />}>
              {sectors.flatMap((sector) =>
                sector.projects?.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </>
  );
}
