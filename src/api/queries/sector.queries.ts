import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { SectorRequests } from "@/api/requests/sector.requests";
import {
  CreateSectorRequestBody,
  CreateSectorResponseBody,
  Sector,
} from "@/api/types/sector.types";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";
import { QUERY_KEYS } from "@/api/constants/queries.constants.ts";

const useGetAll = (params?: QueryParams<Sector>) => {
  return useQuery<PaginatedResponse<Sector>>({
    queryFn: () => SectorRequests.getAll(params),
    queryKey: [QUERY_KEYS.SECTOR_GET_ALL, params],
    placeholderData: (data) =>
      data || {
        items: [],
        itemCount: 0,
        pageNumber: 0,
        pageSize: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
  });
};

const useGetAllInfinite = (params?: QueryParams<Sector>, enabled?: boolean) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SECTOR_GET_ALL, params],
    initialPageParam: 1,
    enabled: enabled,
    queryFn: ({ pageParam = 1 as number }) =>
      SectorRequests.getAll({ ...params, PageNumber: pageParam, PageSize: 5 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.pageNumber - 1 : undefined,
  });
};

const useCreateSector = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<CreateSectorResponseBody, Error, CreateSectorRequestBody>({
    mutationFn: SectorRequests.createSector,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SECTOR_GET_ALL],
      });
      toast({
        title: t("SECTOR_CREATED_SUCCESS_TITLE"),
        description: t("SECTOR_CREATED_SUCCESS_DESCRIPTION"),
      });
    },
    onError: () => {
      toast({
        title: t("SECTOR_CREATED_ERROR_TITLE"),
        description: t("SECTOR_CREATED_ERROR_DESCRIPTION"),
        variant: "destructive",
      });
    },
  });
};

const useGetById = (id: string) => {
  return useQuery<Sector>({
    queryKey: [QUERY_KEYS.SECTOR_GET_BY_ID, id],
    queryFn: () => SectorRequests.getById(id),
    enabled: !!id,
  });
};

export const SectorQueries = {
  useCreateSector,
  useGetAll,
  useGetAllInfinite,
  useGetById,
};
