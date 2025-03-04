import { useQuery } from "@tanstack/react-query";
import { OrganizationRequest } from "@/api/requests/organization.request.ts";
import { QUERY_KEYS } from "@/api/constants/queries.constants.ts";

const useGet = () => {
  return useQuery({
    queryFn: OrganizationRequest.getOrganizationInfo,
    queryKey: [QUERY_KEYS.GET_ORGANIZATION_INFO],
    staleTime: 1000 * 60 * 5,
  });
};

export const OrganizationQueries = {
  useGet,
};
