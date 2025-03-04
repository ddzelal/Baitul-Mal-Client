import { JSX } from "react";
import { UserQueries } from "@/api/queries/user.queries";
import { Loading } from "@/components/common/loading/loading";
import { NotFound } from "@/components/common/not-found/not-found";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import { Mail, Phone, UserCog, User } from "lucide-react";
import { IUserRole } from "@/interfaces/auth.interface";

interface UserDetail {
  icon: JSX.Element;
  label: string;
  value: string | IUserRole;
  href?: string;
}

export default function UserPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = UserQueries.useGetUser(id!);

  if (isLoading) {
    return <Loading type="USER" />;
  }

  if (!user) {
    return <NotFound type="USER" />;
  }

  const userDetails: UserDetail[] = [];

  if (user.email) {
    userDetails.push({
      icon: <Mail className="w-5 h-5" />,
      label: t("EMAIL"),
      value: user.email,
      href: `mailto:${user.email}`,
    });
  }

  if (user.phoneNumber) {
    userDetails.push({
      icon: <Phone className="w-5 h-5" />,
      label: t("PHONE"),
      value: user.phoneNumber,
      href: `tel:${user.phoneNumber}`,
    });
  }

  if (user.role) {
    userDetails.push({
      icon: <UserCog className="w-5 h-5" />,
      label: t("ROLE"),
      value: user.role,
    });
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <InitialsAvatar
              name={`${user.name} ${user.lastName}`}
              className="h-24 w-24 text-2xl"
            />
            <div>
              <h1 className="text-3xl font-bold">
                {user.name} {user.lastName}
              </h1>
              {user.role && (
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <User className="w-4 h-4" />
                  <span>{t(`ROLE_${user.role.toUpperCase()}`)}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userDetails.length > 0 ? (
            <div className="grid gap-6">
              {userDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 transition-colors hover:bg-secondary/20"
                >
                  <div className="text-primary">{detail.icon}</div>
                  <div className="flex-grow">
                    <div className="text-sm text-muted-foreground">
                      {detail.label}
                    </div>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="font-medium hover:underline text-primary"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <div className="font-medium">{detail.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {t("NO_USER_DETAILS_AVAILABLE")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
