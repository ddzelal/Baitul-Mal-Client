import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormValues, loginSchema } from "@/schemas/auth.schema.ts";
import { AuthQueries } from "@/api/queries/auth.queries.ts";
import { useAuth } from "@/hooks/use-auth.hook.tsx";
import { ButtonLoader } from "@/components/button-loader.tsx";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { login } = useAuth();
  const { mutateAsync: loginUser, isPending } = AuthQueries.useLogin();
  const { t } = useTranslation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: "admin@admin.com",
      password: "admin123",
    },
  });

  const inputFields = [
    {
      name: "email",
      label: "LOGIN_EMAIL",
      type: "text",
      placeholder: "LOGIN_EMAIL_PLACEHOLDER",
    },
    {
      name: "password",
      label: "LOGIN_PASSWORD",
      type: "password",
      placeholder: "LOGIN_PASSWORD_PLACEHOLDER",
    },
  ];

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Login values:", values);
    await loginUser(values, {
      onSuccess: (data) => {
        login(data);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("LOGIN_TITLE")}</CardTitle>
        <CardDescription>{t("LOGIN_DESCRIPTION")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {inputFields.map(({ name, label, type, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof LoginFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(label)}</FormLabel>
                    <FormControl>
                      <Input
                        type={type}
                        placeholder={t(placeholder)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <ButtonLoader
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              {t("SUBMIT")}
            </ButtonLoader>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
