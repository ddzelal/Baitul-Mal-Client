import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { ButtonLoader } from "../button-loader";
import { ProjectQueries } from "@/api/queries/project.queries";
import { editProjectSchema } from "@/schemas/project.schema";
import { IProject, EditProjectRequestBody } from "@/api/types/project.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { UserQueries } from "@/api/queries/user.queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectorQueries } from "@/api/queries/sector.queries";

interface EditProjectFormProps {
  project: IProject;
  sectorId: string;
  onSuccess: () => void;
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({
  project,
  sectorId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: editProject, isPending } =
    ProjectQueries.useEditProject();
  const { data: sectorsData } = SectorQueries.useGetAll();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    UserQueries.useGetAllInfinite({ PageSize: 10 });

  const form = useForm<EditProjectRequestBody>({
    resolver: zodResolver(editProjectSchema(t)),
    defaultValues: {
      name: project.name,
      description: project.description,
      sectorId: sectorId,
    },
  });

  const { inView } = useInView({
    threshold: 1,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSubmit = async (values: EditProjectRequestBody) => {
    try {
      await editProject({
        sectorId,
        projectId: project.id,
        data: values,
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("PROJECT_NAME")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("PROJECT_NAME_PLACEHOLDER")}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("PROJECT_DESCRIPTION")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("PROJECT_DESCRIPTION_PLACEHOLDER")}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sectorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("SECTOR")}</FormLabel>
              <FormControl>
                {sectorId ? (
                  <Input
                    disabled
                    {...field}
                    value={project.assignedToSectorName ?? ""}
                  />
                ) : (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("SELECT_SECTOR")} />
                    </SelectTrigger>
                    <SelectContent>
                      {sectorsData?.items.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonLoader type="submit" className="w-full" isLoading={isPending}>
          {t("EDIT")}
        </ButtonLoader>
      </form>
    </Form>
  );
};
