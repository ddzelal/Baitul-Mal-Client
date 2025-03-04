import { z } from "zod";

export const projectSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("PROJECT_NAME_MIN_LENGTH_ERROR"))
      .nonempty(t("PROJECT_NAME_REQUIRED")),
    description: z.string().optional(),
    sectorId: z.string().nonempty(t("SECTOR_REQUIRED")),
    assignedCoordinatorIds: z.array(z.string()),
  });

export const editProjectSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(3, t("PROJECT_NAME_MIN_LENGTH_ERROR")),
    description: z.string().optional(),
  });

export type ProjectFormValues = z.infer<ReturnType<typeof projectSchema>>;
export type EditProjectFormValues = z.infer<
  ReturnType<typeof editProjectSchema>
>;
