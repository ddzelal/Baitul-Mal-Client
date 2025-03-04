import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginRequestBody, LoginResponseBody } from "@/api/types/auth.types.ts";
import { AuthRequests } from "@/api/requests/auth.requests.ts";
import { QUERY_KEYS } from "@/api/constants/queries.constants.ts";

const useLogin = () => {
  return useMutation<LoginResponseBody, Error, LoginRequestBody>({
    mutationFn: AuthRequests.login,
  });
};

const useGetMe = () => {
  return useQuery({
    queryFn: AuthRequests.getMe,
    queryKey: [QUERY_KEYS.GET_ME],
  });
};

export const AuthQueries = {
  useLogin,
  useGetMe,
};
