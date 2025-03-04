import React, { useState, useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { applicationRoutes } from "@/constants/navigation-links.tsx";
import { MenuSearchInput } from "@/components/menu-search-input.tsx";
import { useAuth } from "@/hooks/use-auth.hook.tsx";
import { getAuth } from "@/lib/auth.utils.ts";
import { NavigationMenu } from "../navigation-menu.tsx";
import { BottomNavigationBar } from "@/components/ui/bottom-navigation.menu.tsx";
import { OrganizationQueries } from "@/api/queries/organization.queries.ts";

const AuthenticateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { data } = OrganizationQueries.useGet();

  const location = useLocation();

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  if (!user && !getAuth()) {
    return <Navigate to={applicationRoutes.login.link} replace />;
  }

  return (
    <div className="flex h-screen overflow-x-hidden">
      <nav className="hidden lg:flex h-screen w-64 flex-col border-r">
        <div className="p-6 flex items-center justify-start gap-4">
          <img
            src="/put_sredine_logo.png"
            alt="Baitul Mal Logo"
            className="h-12 w-auto mt-3"
          />
          <h1 className="text-xl font-bold">{data?.name}</h1>
        </div>
        <NavigationMenu
          onLogout={logout}
          className="flex-1 space-y-2 p-4"
          showLogout={true}
        />
      </nav>

      <div className="flex-1 flex flex-col min-h-0 relative overflow-x-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4 lg:h-16 gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <PanelRightClose />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 transition-transform duration-500"
            >
              <NavigationMenu
                onLogout={logout}
                className="space-y-2 pt-4"
                showLogout={true}
              />
            </SheetContent>
            <MenuSearchInput />
            {location.pathname !== applicationRoutes.accountSettings.link && (
              <div className="flex  justify-end items-end">
                <ModeToggle />
              </div>
            )}
          </Sheet>
        </header>

        <main
          ref={mainRef}
          className="flex-1 p-2 lg:p-8 overflow-x-hidden pb-16"
        >
          <Outlet />
        </main>

        <BottomNavigationBar isNavVisible={isNavVisible} />
      </div>
    </div>
  );
};

export default AuthenticateLayout;
