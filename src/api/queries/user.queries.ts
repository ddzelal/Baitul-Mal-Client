import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { UserRequests } from "@/api/requests/user.requests.ts";
import { QUERY_KEYS } from "@/api/constants/queries.constants.ts";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";
import {
  CreateUserRequestBody,
  CreateUserResponseBody,
  EditUserRequestBody,
  EditUserResponseBody,
  GetUserResponseBody,
  UserStatus,
} from "@/api/types/user.types";
import { useToast } from "@/hooks/use-toast";
import { IUser } from "@/interfaces/auth.interface.ts";
import { useTranslation } from "react-i18next";

const useGetAll = (params?: QueryParams<IUser>) => {
  return useQuery<PaginatedResponse<IUser>>({
    queryFn: () => UserRequests.getAll(params),
    queryKey: [QUERY_KEYS.USER_GET_ALL, params],
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

const useGetAllInfinite = (params?: QueryParams<IUser>) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.USER_GET_ALL, params],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 as number }) =>
      UserRequests.getAll({ ...params, PageNumber: pageParam, PageSize: 2 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.pageNumber - 1 : undefined,
  });
};

const useGetUser = (userId: string) => {
  return useQuery<GetUserResponseBody>({
    queryFn: () => UserRequests.getUser(userId),
    queryKey: [QUERY_KEYS.USER_GET_USER.replace("{{userId}}", userId)],
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();
  return useMutation<CreateUserResponseBody, Error, CreateUserRequestBody>({
    mutationFn: UserRequests.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_GET_ALL],
      });
      toast({
        title: t("USER_CREATED_SUCCESS_TITLE"),
        description: t("USER_CREATED_SUCCESS_DESCRIPTION"),
      });
    },
    onError: () => {
      toast({
        title: t("USER_CREATED_ERROR_TITLE"),
        description: t("USER_CREATED_ERROR_DESCRIPTION"),
        variant: "destructive",
      });
    },
  });
};

const useEditUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();

  return useMutation<
    EditUserResponseBody,
    Error,
    { userId: string; data: EditUserRequestBody }
  >({
    mutationFn: ({ userId, data }) => UserRequests.editUser(userId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_GET_ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ME],
        }),
      ]);
      toast({
        title: t("PROFILE_UPDATE_SUCCESS_TITLE"),
        description: t("PROFILE_UPDATE_SUCCESS_DESCRIPTION"),
      });
    },
    onError: () => {
      toast({
        title: t("PROFILE_UPDATE_ERROR_TITLE"),
        description: t("PROFILE_UPDATE_ERROR_DESCRIPTION"),
        variant: "destructive",
      });
    },
  });
};

const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();

  return useMutation<void, Error, { userId: string; status: UserStatus }>({
    mutationFn: ({ userId, status }) =>
      UserRequests.updateUserStatus(userId, { status }),
    onSuccess: async (data, variables) => {
      console.info(data, variables);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_GET_ALL],
      });
      toast({
        title: t(
          variables.status === UserStatus.Enabled
            ? "USER_ACTIVATE_SUCCESS_TITLE"
            : "USER_DEACTIVATE_SUCCESS_TITLE"
        ),
        description: t(
          variables.status === UserStatus.Enabled
            ? "USER_ACTIVATE_SUCCESS_DESCRIPTION"
            : "USER_DEACTIVATE_SUCCESS_DESCRIPTION"
        ),
      });
    },
    onError: (data, variables) => {
      console.info(data, variables);
      toast({
        title: t(
          variables.status === UserStatus.Enabled
            ? "USER_ACTIVATE_ERROR_TITLE"
            : "USER_DEACTIVATE_ERROR_TITLE"
        ),
        description: t(
          variables.status === UserStatus.Enabled
            ? "USER_ACTIVATE_ERROR_DESCRIPTION"
            : "USER_DEACTIVATE_ERROR_DESCRIPTION"
        ),
        variant: "destructive",
      });
    },
  });
};

export const UserQueries = {
  useCreateUser,
  useGetAll,
  useGetAllInfinite,
  useEditUser,
  useUpdateUserStatus,
  useGetUser,
};
