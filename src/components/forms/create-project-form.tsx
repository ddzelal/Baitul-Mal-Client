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
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormValues, projectSchema } from "@/schemas/project.schema";
import { ButtonLoader } from "@/components/button-loader";
import { useTranslation } from "react-i18next";
import { ProjectQueries } from "@/api/queries/project.queries";
import { UserQueries } from "@/api/queries/user.queries";
import { Sector } from "@/api/types/sector.types";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MultiSelectSearch } from "../common/selects/multi-select-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectorQueries } from "@/api/queries/sector.queries";

interface CreateProjectFormProps {
  onSuccess: () => void;
  sector?: Sector;
}

export default function CreateProjectForm({
  onSuccess,
  sector,
}: CreateProjectFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: create, isPending } = ProjectQueries.useCreate();
  const { data: sectorsData } = SectorQueries.useGetAll();
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = UserQueries.useGetAllInfinite({ PageSize: 10 });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      sectorId: sector?.id,
      assignedCoordinatorIds: [],
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

  const onSubmit = async (values: ProjectFormValues) => {
    console.log(values, "Values....");

    await create(
      {
        ...values,
        description: values.description || "",
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("PROJECT_NAME")}</FormLabel>
              <FormControl>
                <Input placeholder={t("PROJECT_NAME_PLACEHOLDER")} {...field} />
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
                {sector ? (
                  <Input disabled {...field} value={sector.name} />
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
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

        <FormField
          control={form.control}
          name="assignedCoordinatorIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("PROJECT_COORDINATORS")}</FormLabel>
              <FormControl>
                <MultiSelectSearch
                  value={field.value}
                  onValueChange={field.onChange}
                  options={
                    usersData?.pages
                      .flatMap((page) => page.items)
                      .map((user) => ({
                        id: user.id,
                        label: `${user.name} ${user.lastName}`,
                      })) || []
                  }
                  placeholder={t("SELECT_COORDINATORS")}
                  searchPlaceholder={t("SEARCH_USERS")}
                  noOptionsMessage={t("NO_USERS_FOUND")}
                  isLoading={isFetchingNextPage}
                  onLoadMore={fetchNextPage}
                  hasMore={hasNextPage}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonLoader
          type="submit"
          className="w-full mt-8"
          isLoading={isPending}
        >
          {t("CREATE_PROJECT")}
        </ButtonLoader>
      </form>
    </Form>
  );
}
