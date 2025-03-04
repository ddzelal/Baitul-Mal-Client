import { IUserRole } from "@/interfaces/auth.interface.ts";
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.hook.tsx";
import { applicationRoutes } from "@/constants/navigation-links.tsx";
import { getAuth } from "@/lib/auth.utils.ts";

interface Props {
  allowedRoles?: IUserRole[];
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, element }) => {
  const { user } = useAuth();

  if (!user && !getAuth()) {
    return <Navigate to={applicationRoutes.login.link} replace />;
  }

  if (
    !allowedRoles ||
    user?.role === IUserRole.Admin ||
    getAuth()?.role === IUserRole.Admin
  ) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        {element}
      </React.Suspense>
    );
  }

  if (
    !allowedRoles.includes(user?.role as IUserRole) &&
    !allowedRoles.includes(getAuth()?.role as IUserRole)
  ) {
    return <Navigate to={applicationRoutes.dashboard.link} replace />;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>{element}</React.Suspense>
  );
};

export default ProtectedRoute;
