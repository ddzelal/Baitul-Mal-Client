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
import { SectorFormValues, sectorSchema } from "@/schemas/sector.schema";
import { ButtonLoader } from "@/components/button-loader";
import { useTranslation } from "react-i18next";
import { UserQueries } from "@/api/queries/user.queries";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MultiSelectSearch } from "../common/selects/multi-select-search";
import { SectorQueries } from "@/api/queries/sector.queries";

interface CreateSectorFormProps {
  onSuccess: () => void;
}

export default function CreateSectorForm({ onSuccess }: CreateSectorFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: createSector, isPending } =
    SectorQueries.useCreateSector();
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = UserQueries.useGetAllInfinite({ PageSize: 10 });

  const form = useForm<SectorFormValues>({
    resolver: zodResolver(sectorSchema(t)),
    defaultValues: {
      name: "",
      description: "",
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

  const onSubmit = async (values: SectorFormValues) => {
    await createSector(
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
              <FormLabel>{t("SECTOR_NAME")}</FormLabel>
              <FormControl>
                <Input placeholder={t("SECTOR_NAME_PLACEHOLDER")} {...field} />
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
              <FormLabel>{t("SECTOR_DESCRIPTION")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("SECTOR_DESCRIPTION_PLACEHOLDER")}
                  {...field}
                />
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
              <FormLabel>{t("SECTOR_COORDINATORS")}</FormLabel>
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
          {t("CREATE_SECTOR")}
        </ButtonLoader>
      </form>
    </Form>
  );
}
