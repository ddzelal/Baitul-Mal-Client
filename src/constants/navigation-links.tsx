import { Home, UserRoundCog, Building, Shield } from "lucide-react";
import LoginPage from "@/pages/login.page.tsx";
import DashboardPage from "@/pages/dashboard.page.tsx";
import NotFoundPage from "@/pages/not-found.page.tsx";
import AccountSettingsPage from "@/pages/account-settings.page.tsx";
import { IUserRole } from "@/interfaces/auth.interface.ts";
import React from "react";
import UserManagementPage from "@/pages/admin/user-management.page.tsx";
import OrganizationInfoPage from "@/pages/organization-info.page.tsx";
import SectorManagementPage from "@/pages/admin/sector-management.page.tsx";
import ProjectPage from "@/pages/project.page.tsx";
import SectorPage from "@/pages/sector.page.tsx";
import ProjectManagementPage from "@/pages/admin/project-management.page.tsx";
import DonorManagementPage from "@/pages/admin/donor-management.page";
import UserPage from "@/pages/user.page";
import TransactionManagementPage from "@/pages/admin/transaction-management.page";

export const applicationRoutes = {
  login: {
    link: "/login",
    page: LoginPage,
  },
  dashboard: {
    link: "/",
    page: DashboardPage,
  },
  notFoundPage: {
    link: "*",
    page: NotFoundPage,
  },
  accountSettings: {
    link: "/account-settings",
    page: AccountSettingsPage,
  },
  userManagement: {
    link: "/admin/users",
    page: UserManagementPage,
  },
  organizationInfo: {
    link: "/organization-info",
    page: OrganizationInfoPage,
  },
  sectorManagement: {
    link: "/admin/sectors",
    page: SectorManagementPage,
  },
  projectsManagement: {
    link: "/admin/projects",
    page: ProjectManagementPage,
  },
  transactionManagement: {
    link: "/admin/transactions",
    page: TransactionManagementPage,
  },
  user: {
    link: "/users/:id",
    page: UserPage,
  },
  donorManagement: {
    link: "/admin/donors",
    page: DonorManagementPage,
  },
  sector: {
    link: "/sectors/:id",
    page: SectorPage,
  },
  project: {
    link: "/sectors/:sectorId/projects/:projectId",
    page: ProjectPage,
  },
};

export type NavigationLink = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: IUserRole[];
  children?: NavigationLink[];
};

export const navigationLinks: NavigationLink[] = [
  {
    to: applicationRoutes.dashboard.link,
    label: "Dashboard",
    icon: Home,
  },
  {
    to: applicationRoutes.accountSettings.link,
    label: "Profile",
    icon: UserRoundCog,
  },
  {
    to: applicationRoutes.organizationInfo.link,
    label: "Organization Info",
    icon: Building,
  },
  {
    to: "/admin",
    label: "Admin Management",
    icon: UserRoundCog,
    allowedRoles: [IUserRole.Admin],
    children: [
      {
        to: applicationRoutes.userManagement.link,
        label: "Users",
        icon: UserRoundCog,
        allowedRoles: [IUserRole.Admin],
      },
      {
        to: applicationRoutes.sectorManagement.link,
        label: "Sectors",
        icon: Shield,
        allowedRoles: [IUserRole.Admin],
      },
      {
        to: applicationRoutes.projectsManagement.link,
        label: "Projects",
        icon: Shield,
        allowedRoles: [IUserRole.Admin],
      },
      {
        to: applicationRoutes.donorManagement.link,
        label: "Donors",
        icon: Shield,
        allowedRoles: [IUserRole.Admin],
      },
      {
        to: applicationRoutes.transactionManagement.link,
        label: "Transactions",
        icon: Shield,
        allowedRoles: [IUserRole.Admin],
      },
    ],
  },
];

export const bottomNavigationLinks: NavigationLink[] = [
  {
    to: applicationRoutes.dashboard.link,
    label: "Dashboard",
    icon: Home,
  },
  {
    to: applicationRoutes.organizationInfo.link,
    label: "Organization Info",
    icon: Building,
  },
];

export const publicRoutes = [
  { path: applicationRoutes.login.link, element: <LoginPage /> },
  { path: applicationRoutes.notFoundPage.link, element: <NotFoundPage /> },
];

type IProtectedRoute = {
  path: string;
  element: React.ReactNode;
  allowedRoles?: IUserRole[];
};

export const protectedRoutes: IProtectedRoute[] = [
  {
    path: applicationRoutes.dashboard.link,
    element: <DashboardPage />,
  },
  {
    path: applicationRoutes.accountSettings.link,
    element: <AccountSettingsPage />,
  },
  {
    path: applicationRoutes.userManagement.link,
    element: <UserManagementPage />,
    allowedRoles: [IUserRole.Admin],
  },
  {
    path: applicationRoutes.organizationInfo.link,
    element: <OrganizationInfoPage />,
  },
  {
    path: applicationRoutes.sectorManagement.link,
    element: <SectorManagementPage />,
  },
  {
    path: applicationRoutes.sector.link,
    element: <SectorPage />,
  },
  {
    path: applicationRoutes.project.link,
    element: <ProjectPage />,
  },
  {
    path: applicationRoutes.projectsManagement.link,
    element: <ProjectManagementPage />,
  },
  {
    path: applicationRoutes.user.link,
    element: <UserPage />,
  },
  {
    path: applicationRoutes.donorManagement.link,
    element: <DonorManagementPage />,
  },
  {
    path: applicationRoutes.transactionManagement.link,
    element: <TransactionManagementPage />,
  },
];
