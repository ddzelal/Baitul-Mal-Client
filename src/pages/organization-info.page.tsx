import { useTranslation } from "react-i18next";
import { OrganizationQueries } from "@/api/queries/organization.queries";
import {
  CreditCard,
  Clock,
  Building,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Activity,
  MapPin,
  LockIcon,
  InfoIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth.hook";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IUserRole } from "@/interfaces/auth.interface";

interface BudgetCardProps {
  type: string;
  icon: React.ElementType;
  label: string;
  amount?: number;
  currencyCode?: string;
}

function BudgetCard({
  type,
  icon: Icon,
  label,
  amount = 0,
  currencyCode = "BAM",
}: BudgetCardProps) {
  const formattedAmount = new Intl.NumberFormat("bs-BA", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-sm border",
        type === "total"
          ? "bg-blue-50 border-blue-200"
          : type === "assigned"
            ? "bg-green-50 border-green-200"
            : type === "unassigned"
              ? "bg-purple-50 border-purple-200"
              : type === "pending"
                ? "bg-yellow-50 border-yellow-200"
                : type === "reserved"
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-red-50 border-red-200"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon
            className={cn(
              "h-5 w-5",
              type === "total"
                ? "text-blue-600"
                : type === "assigned"
                  ? "text-green-600"
                  : type === "unassigned"
                    ? "text-purple-600"
                    : type === "pending"
                      ? "text-yellow-600"
                      : type === "reserved"
                        ? "text-indigo-600"
                        : "text-red-600"
            )}
          />
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        </div>
      </div>
      <p
        className={cn(
          "mt-2 text-lg font-semibold",
          type === "total"
            ? "text-blue-800"
            : type === "assigned"
              ? "text-green-800"
              : type === "unassigned"
                ? "text-purple-800"
                : type === "pending"
                  ? "text-yellow-800"
                  : type === "reserved"
                    ? "text-indigo-800"
                    : "text-red-800"
        )}
      >
        {formattedAmount}
      </p>
    </div>
  );
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface OrganizationData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  mission?: string;
  teamMembers?: TeamMember[];
  events?: Event[];
  budgetName?: string;
  budgetAssignedAmount?: number;
  budgetUnassignedAmount?: number;
  budgetPendingAmount?: number;
  budgetReservedAmount?: number;
  budgetSpentAmount?: number;
  currencyCode?: string;
  currencyName?: string;
}

export default function OrganizationInfoPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = OrganizationQueries.useGet() as {
    data?: OrganizationData;
    isLoading: boolean;
  };

  const hasAccessToFinancialData =
    user?.role === IUserRole.Admin || user?.role === IUserRole.FinanceLead;

  const recentActivities = [
    {
      id: 1,
      date: new Date("2023-05-15"),
      action: "Not implemented",
      description: "Not implemented",
    },
  ];

  if (isLoading) {
    return <OrganizationSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Organization Header */}
      <div className="bg-card rounded-lg overflow-hidden shadow-sm mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-3 h-8 w-8" />
            {data?.name || t("ORGANIZATION")}
          </h1>
          {data?.description && (
            <p className="mt-2 text-blue-100 max-w-3xl">{data.description}</p>
          )}
        </div>

        {/* Quick facts about organization */}
        <div className="p-6  grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">{t("LOCATION")}</h3>
              <p>{data?.address || "Srbija, Novi Pazar"}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="h-5 w-5  mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium ">{t("CONTACT")}</h3>
              <p>{data?.phone || "+xxx xxx xxx"}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Mail className="h-5 w-5  mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">{t("EMAIL")}</h3>
              <p>{data?.email || "info@baitulmal.ba"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="overview">{t("OVERVIEW")}</TabsTrigger>
          <TabsTrigger
            value="budget"
            disabled={!hasAccessToFinancialData}
            className="relative"
          >
            {t("BUDGET")}
            {!hasAccessToFinancialData && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-1 h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("RESTRICTED_ACCESS")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            disabled={!hasAccessToFinancialData}
            className="relative"
          >
            {t("ACTIVITY")}
            {!hasAccessToFinancialData && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-1 h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("RESTRICTED_ACCESS")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-primary" />
                  {t("MISSION")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {data?.mission || "Not implemented"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  {t("TEAM")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.teamMembers ? (
                    data.teamMembers.map((member: TeamMember) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          A
                        </div>
                        <div>
                          <p className="font-medium">Anonymus User</p>
                          <p className="text-sm text-gray-500">
                            Program Director
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          E
                        </div>
                        <div>
                          <p className="font-medium">Anonymus User</p>
                          <p className="text-sm text-gray-500">
                            Financial Manager
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {t("UPCOMING_EVENTS")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.events ? (
                <div className="space-y-4">
                  {data.events.map((event: Event) => (
                    <div
                      key={event.id}
                      className="border-l-4 border-primary pl-4"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium">Not implemented</p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-gray-600">Not implemented</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          {!hasAccessToFinancialData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <InfoIcon className="mr-2 h-5 w-5 text-amber-500" />
                  {t("RESTRICTED_CONTENT")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center">
                  <LockIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("ACCESS_DENIED")}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t("BUDGET_ACCESS_DENIED_DESC")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : data && "budgetName" in data ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data?.budgetName || t("ORGANIZATION_BUDGET")}
                  </CardTitle>
                  <CardDescription>{t("BUDGET_DESCRIPTION")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for chart */}
                  <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">{t("BUDGET_VISUALIZATION")}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BudgetCard
                  type="assigned"
                  icon={CreditCard}
                  label={t("ASSIGNED")}
                  amount={data?.budgetAssignedAmount}
                  currencyCode={data?.currencyCode}
                />
                <BudgetCard
                  type="unassigned"
                  icon={CreditCard}
                  label={t("UNASSIGNED")}
                  amount={data?.budgetUnassignedAmount}
                  currencyCode={data?.currencyCode}
                />
                <BudgetCard
                  type="pending"
                  icon={Clock}
                  label={t("PENDING")}
                  amount={data?.budgetPendingAmount}
                  currencyCode={data?.currencyCode}
                />
                <BudgetCard
                  type="reserved"
                  icon={CreditCard}
                  label={t("RESERVED")}
                  amount={data?.budgetReservedAmount}
                  currencyCode={data?.currencyCode}
                />
                <BudgetCard
                  type="spent"
                  icon={CreditCard}
                  label={t("SPENT")}
                  amount={data?.budgetSpentAmount}
                  currencyCode={data?.currencyCode}
                />
                <BudgetCard
                  type="total"
                  icon={CreditCard}
                  label={t("TOTAL")}
                  amount={
                    (data?.budgetAssignedAmount || 0) +
                    (data?.budgetUnassignedAmount || 0)
                  }
                  currencyCode={data?.currencyCode}
                />
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t("NO_BUDGET_DATA")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t("NO_BUDGET_DATA_DESCRIPTION")}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          {!hasAccessToFinancialData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <InfoIcon className="mr-2 h-5 w-5 text-amber-500" />
                  {t("RESTRICTED_CONTENT")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center">
                  <LockIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("ACCESS_DENIED")}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t("ACTIVITY_ACCESS_DENIED_DESC")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    {t("RECENT_ACTIVITY")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {activity.date.getDate()}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">
                            {activity.action}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {activity.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="mt-1 text-gray-600">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Stats as Mock data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-green-600">24</p>
                      <p className="text-green-800 mt-1">
                        {t("ACTIVE_PROJECTS")}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-blue-600">1,240</p>
                      <p className="text-blue-800 mt-1">{t("BENEFICIARIES")}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-purple-600">15</p>
                      <p className="text-purple-800 mt-1">{t("COMMUNITIES")}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-amber-600">$320K</p>
                      <p className="text-amber-800 mt-1">{t("DISTRIBUTED")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrganizationSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-200 p-8">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex">
              <Skeleton className="h-5 w-5 mr-3" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-10 w-96 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <Skeleton className="h-6 w-36 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <Skeleton className="h-6 w-36 mb-4" />
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
