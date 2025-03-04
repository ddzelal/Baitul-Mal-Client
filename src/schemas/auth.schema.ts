import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("PLEASE_ENTER_VALID_EMAIL")),
    password: z.string().min(6, t("PASSWORD_MIN_LENGTH_ERROR")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
