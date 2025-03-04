import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileFormValues, profileSchema } from "@/schemas/profile.schema";
import { ButtonLoader } from "@/components/button-loader";
import { useTranslation } from "react-i18next";
import { IUserRole } from "@/interfaces/auth.interface";
import { UserQueries } from "@/api/queries/user.queries";

interface CreateUserFormProps {
  onSuccess: () => void;
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: createUser, isPending } = UserQueries.useCreateUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema(t)),
    defaultValues: {
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

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
    {
      name: "email",
      label: "EMAIL",
      type: "email",
      placeholder: "EMAIL_PLACEHOLDER",
    },
    {
      name: "password",
      label: "PASSWORD",
      type: "password",
      placeholder: "PASSWORD_PLACEHOLDER",
    },
    {
      name: "confirmPassword",
      label: "CONFIRM_PASSWORD",
      type: "password",
      placeholder: "CONFIRM_PASSWORD_PLACEHOLDER",
    },
  ];

  const roleOptions = Object.values(IUserRole).map((role) => ({
    value: role,
    label: `ROLE_${role.toUpperCase()}`,
  }));

  const onSubmit = async (values: ProfileFormValues) => {
    await createUser(
      {
        ...values,
        role: values.role || null,
      },
      {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {inputFields.map(({ name, label, type, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof ProfileFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(label)}</FormLabel>
                <FormControl>
                  <Input type={type} placeholder={t(placeholder)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ROLE")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        <ButtonLoader type="submit" className="w-full" isLoading={isPending}>
          {t("CREATE_USER")}
        </ButtonLoader>
      </form>
    </Form>
  );
}
