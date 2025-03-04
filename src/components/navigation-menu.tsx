import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { navigationLinks, NavigationLink } from "@/constants/navigation-links";
import { useAuth } from "@/hooks/use-auth.hook.tsx";
import { useState } from "react";

interface NavigationMenuProps {
  onLogout: () => void;
  className?: string;
  showLabels?: boolean;
  buttonVariant?: "icon" | "full";
  showLogout?: boolean;
}

export const NavigationMenu = ({
  onLogout,
  className,
  showLabels = true,
  buttonVariant = "full",
  showLogout = true,
}: NavigationMenuProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const isLinkAllowed = (link: NavigationLink) => {
    return (
      !link.allowedRoles ||
      link.allowedRoles.some((role) => user?.role?.includes(role))
    );
  };

  const getAccessibleLinks = (links: NavigationLink[]) => {
    return links.filter(isLinkAllowed);
  };

  const accessibleLinks = getAccessibleLinks(navigationLinks);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderLink = (link: NavigationLink, index: number) => {
    const isActive = location.pathname === link.to;
    const hasChildren = link.children && link.children.length > 0;

    return (
      <div key={index} className="w-full">
        {hasChildren ? (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`
              ${buttonVariant === "full" ? "w-full justify-start" : "flex-1"}
              relative
            `}
            size={buttonVariant === "icon" ? "icon" : "default"}
            onClick={() => toggleMenu(link.label)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <link.icon
                  className={showLabels ? "mr-2 h-4 w-4" : "h-5 w-5"}
                />
                {showLabels && t(link.label)}
              </div>
              <ChevronDown
                className={`
                  h-4 w-4 
                  transition-transform 
                  ${openMenus[link.label] ? "rotate-180" : ""}
                `}
              />
            </div>
          </Button>
        ) : (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`
              ${buttonVariant === "full" ? "w-full justify-start" : "flex-1"}
              relative
            `}
            size={buttonVariant === "icon" ? "icon" : "default"}
            asChild
          >
            <Link to={link.to}>
              <div className="flex items-center">
                <link.icon
                  className={showLabels ? "mr-2 h-4 w-4" : "h-5 w-5"}
                />
                {showLabels && t(link.label)}
              </div>
            </Link>
          </Button>
        )}

        {hasChildren && openMenus[link.label] && (
          <div className="pl-4 mt-1 space-y-1">
            {link.children
              ?.filter(isLinkAllowed)
              .map((childLink, childIndex) => (
                <Button
                  key={childIndex}
                  variant={
                    location.pathname === childLink.to ? "secondary" : "ghost"
                  }
                  className={`
                w-full justify-start
                text-sm font-normal
              `}
                  asChild
                >
                  <Link to={childLink.to}>
                    <childLink.icon className="mr-2 h-4 w-4" />
                    {showLabels && t(childLink.label)}
                  </Link>
                </Button>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={`${className} ${buttonVariant === "icon" ? "w-full" : "flex flex-col"}`}
    >
      <div
        className={
          buttonVariant === "icon" ? "w-full flex justify-around" : "flex-1"
        }
      >
        {accessibleLinks.map(renderLink)}
      </div>
      {showLogout && (
        <Button
          onClick={onLogout}
          variant="ghost"
          className={
            buttonVariant === "full" ? "w-full justify-start mt-auto" : "flex-1"
          }
          size={buttonVariant === "icon" ? "icon" : "default"}
        >
          <LogOut className={showLabels ? "mr-2 h-4 w-4" : "h-5 w-5"} />
          {showLabels && t("LOGOUT")}
        </Button>
      )}
    </nav>
  );
};
