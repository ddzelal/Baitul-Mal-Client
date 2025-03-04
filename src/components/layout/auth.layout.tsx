import React, { Suspense } from "react";
import { Await, useLoaderData, useOutlet } from "react-router-dom";
import { IAuth } from "@/interfaces/auth.interface.ts";
import { useTranslation } from "react-i18next";
import AuthProvider from "@/context/auth.context.tsx";

export const AuthLayout: React.FC = () => {
  const outlet = useOutlet();
  const { t } = useTranslation();
  const { user } = useLoaderData() as { user: IAuth | null };

  const LoaderComponent = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  };

  return (
    <Suspense fallback={<LoaderComponent />}>
      <Await resolve={user} errorElement={<div>{t("AUTH_LAYOUT_ERROR")}</div>}>
        {(user) => <AuthProvider userData={user}>{outlet}</AuthProvider>}
      </Await>
    </Suspense>
  );
};
