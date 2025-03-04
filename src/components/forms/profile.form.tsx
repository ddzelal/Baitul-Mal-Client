import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "@/schemas/profile.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IUser, IUserRole } from "@/interfaces/auth.interface";
import { UserQueries } from "@/api/queries/user.queries";
import { ButtonLoader } from "../button-loader";
import { useAuth } from "@/hooks/use-auth.hook";

interface ProfileSectionFormProps {
  isEditing: boolean;
  onEdit: (value: boolean) => void;
  user?: IUser;
}

export const ProfileSectionForm: React.FC<ProfileSectionFormProps> = ({
  isEditing,
  onEdit,
  user,
}) => {
  const { user: me } = useAuth();
  const currentUser = user || me;
  const isEditingSelf = currentUser?.id === me?.id;
  const { t } = useTranslation();
  const { mutateAsync: editUser, isPending } = UserQueries.useEditUser();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema(t)),
    defaultValues: {
      name: currentUser?.name ?? "",
      lastName: currentUser?.lastName ?? "",
      phoneNumber: user ? "" : (me?.phoneNumber ?? ""),
      role: (currentUser?.role as IUserRole) ?? IUserRole.Contributor,
    },
  });
  if (!currentUser) return null;

  const inputFields = [
    {
      name: "name",
      label: "FIRST_NAME",
      type: "text",
      placeholder: "FIRST_NAME_PLACEHOLDER",
    },
    {
      name: "lastName",
      label: "LAST_NAME",
      type: "text",
      placeholder: "LAST_NAME_PLACEHOLDER",
    },
    {
      name: "phoneNumber",
      label: "PHONE_NUMBER",
      type: "tel",
      placeholder: "PHONE_NUMBER_PLACEHOLDER",
    },
  ];

  const roleOptions = Object.values(IUserRole).map((role) => ({
    value: role,
    label: `ROLE_${role.toUpperCase()}`,
  }));

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const filteredData = Object.entries(values).reduce<
        Partial<EditProfileFormValues>
      >((acc, [key, value]) => {
        if (value !== "" && value !== undefined) {
          if (key === "role" && typeof value === "string") {
            const enumValue = IUserRole[
              value as keyof typeof IUserRole
            ] as IUserRole;
            if (enumValue !== undefined) {
              acc.role = enumValue;
            }
          } else if (key === "name") {
            acc.name = value as string;
          } else if (key === "lastName") {
            acc.lastName = value as string;
          } else if (key === "phoneNumber") {
            acc.phoneNumber = value as string;
          }
        }
        return acc;
      }, {});

      const requestData = {
        ...(filteredData.name && { name: filteredData.name }),
        ...(filteredData.lastName && { lastName: filteredData.lastName }),
        ...(filteredData.phoneNumber && {
          phoneNumber: filteredData.phoneNumber,
        }),
        role: isEditingSelf
          ? ("" as const)
          : filteredData.role || (currentUser.role as IUserRole),
      };

      await editUser({
        userId: currentUser.id,
        data: requestData,
      });
      onEdit(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {inputFields.map(({ name, label, type, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof EditProfileFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(label)}</FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={t(placeholder)}
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormItem>
          <FormLabel>{t("EMAIL")}</FormLabel>
          <Input type="email" value={currentUser.email} disabled={true} />
        </FormItem>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ROLE")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
                disabled={!isEditing || isEditingSelf}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("SELECT_ROLE")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {t(label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <ButtonLoader type="submit" className="w-full" isLoading={isPending}>
            {t("UPDATE_PROFILE")}
          </ButtonLoader>
        )}
      </form>
    </Form>
  );
};
