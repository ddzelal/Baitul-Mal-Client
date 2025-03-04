import { z } from "zod";
import { IUserRole } from "@/interfaces/auth.interface";

export const profileSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(3, t("FIRST_NAME_MIN_LENGTH_ERROR"))
        .nonempty(t("FIRST_NAME_REQUIRED")),
      lastName: z
        .string()
        .min(3, t("LAST_NAME_MIN_LENGTH_ERROR"))
        .nonempty(t("LAST_NAME_REQUIRED")),
      phoneNumber: z
        .string()
        .regex(/^([+]?[1-9]|0)\d{7,14}$|^$/, t("INVALID_PHONE_NUMBER"))
        .nonempty(t("PHONE_NUMBER_REQUIRED")),
      email: z
        .string()
        .email(t("PLEASE_ENTER_VALID_EMAIL"))
        .nonempty(t("EMAIL_REQUIRED")),
      role: z.nativeEnum(IUserRole).optional(),
      password: z.string().min(6, t("PASSWORD_MIN_LENGTH_ERROR")),
      confirmPassword: z.string().min(6, t("PASSWORD_MIN_LENGTH_ERROR")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("PASSWORDS_DO_NOT_MATCH"),
      path: ["confirmPassword"],
    });

export type ProfileFormValues = z.infer<ReturnType<typeof profileSchema>>;

export const editProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("FIRST_NAME_MIN_LENGTH_ERROR"))
      .nonempty(t("FIRST_NAME_REQUIRED"))
      .optional(),
    lastName: z
      .string()
      .min(3, t("LAST_NAME_MIN_LENGTH_ERROR"))
      .nonempty(t("LAST_NAME_REQUIRED"))
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^([+]?[1-9]|0)\d{7,14}$|^$/, t("INVALID_PHONE_NUMBER"))
      .optional(),
    role: z.nativeEnum(IUserRole).optional(),
  });

export type EditProfileFormValues = z.infer<
  ReturnType<typeof editProfileSchema>
>;
