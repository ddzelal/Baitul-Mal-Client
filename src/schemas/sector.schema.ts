import { z } from "zod";

export const sectorSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("SECTOR_NAME_MIN_LENGTH_ERROR"))
      .nonempty(t("SECTOR_NAME_REQUIRED")),
    description: z.string().optional(),
    assignedCoordinatorIds: z.array(z.string()),
  });

export type SectorFormValues = z.infer<ReturnType<typeof sectorSchema>>;
