import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast.ts";
import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/constants/queries.constants.ts";
import {
  CreateProjectRequestBody,
  CreateProjectResponseBody,
  IProject,
  EditProjectRequestBody,
  EditProjectResponseBody,
} from "@/api/types/project.types.ts";
import { ProjectRequest } from "@/api/requests/project.request.ts";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";

const useCreate = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    CreateProjectResponseBody,
    Error,
    CreateProjectRequestBody
  >({
    mutationFn: ProjectRequest.create,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECT_GET_ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SECTOR_GET_ALL],
        }),
      ]);

      toast({
        title: t("PROJECT_CREATED_SUCCESS_TITLE"),
        description: t("PROJECT_CREATED_SUCCESS_DESCRIPTION"),
      });
    },
    onError: () => {
      toast({
        title: t("PROJECT_CREATED_ERROR_TITLE"),
        description: t("PROJECT_CREATED_ERROR_DESCRIPTION"),
        variant: "destructive",
      });
    },
  });
};

const useGetAll = (params?: QueryParams<IProject>, enabled?: boolean) => {
  return useQuery<PaginatedResponse<IProject>>({
    queryFn: () => ProjectRequest.getAll(params),
    queryKey: [QUERY_KEYS.PROJECT_GET_ALL, params],
    placeholderData: (data) =>
      data || {
        items: [],
        itemCount: 0,
        pageNumber: 0,
        pageSize: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    enabled: enabled,
  });
};

const useGetAllInfinite = (
  params?: QueryParams<IProject>,
  enabled?: boolean
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PROJECT_GET_ALL, params],
    initialPageParam: 1,
    enabled: enabled,
    queryFn: ({ pageParam = 1 as number }) =>
      ProjectRequest.getAll({ ...params, PageNumber: pageParam, PageSize: 2 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.pageNumber - 1 : undefined,
  });
};

const useGetById = (projectId: string) => {
  return useQuery<IProject>({
    queryKey: [QUERY_KEYS.PROJECT_GET_BY_ID, projectId],
    queryFn: () => ProjectRequest.getById(projectId),
    enabled: !!projectId,
  });
};

const useEditProject = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    EditProjectResponseBody,
    Error,
    { sectorId: string; projectId: string; data: EditProjectRequestBody }
  >({
    mutationFn: ({ sectorId, projectId, data }) =>
      ProjectRequest.editProject(sectorId, projectId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECT_GET_ALL],
      });

      toast({
        title: t("PROJECT_EDITED_SUCCESS_TITLE"),
        description: t("PROJECT_EDITED_SUCCESS_DESCRIPTION"),
      });
    },
    onError: () => {
      toast({
        title: t("PROJECT_EDITED_ERROR_TITLE"),
        description: t("PROJECT_EDITED_ERROR_DESCRIPTION"),
        variant: "destructive",
      });
    },
  });
};

export const ProjectQueries = {
  useCreate,
  useGetById,
  useGetAll,
  useGetAllInfinite,
  useEditProject,
};
