import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationDomainRequest } from "../requests/organization.domain.request";
import { QUERY_KEYS } from "../constants/queries.constants";
import { toast } from "@/hooks/use-toast";

const useAddCoordinatorDomain = (domainType: "project" | "sector") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrganizationDomainRequest.addCoordinatorDomain,
    onSuccess: async (_, variables) => {
      toast({
        title: "Coordinator added successfully",
        description: "Coordinator has been added successfully",
      });
      const queryKey =
        domainType === "project"
          ? QUERY_KEYS.PROJECT_GET_BY_ID
          : QUERY_KEYS.SECTOR_GET_BY_ID;

      const listQueryKey =
        domainType === "project"
          ? QUERY_KEYS.PROJECT_GET_ALL
          : QUERY_KEYS.SECTOR_GET_ALL;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKey, variables.organizationDomainId],
        }),
        queryClient.invalidateQueries({
          queryKey: [listQueryKey],
        }),
      ]);
    },
  });
};

export const OrganizationDomainQueries = {
  useAddCoordinatorDomain,
};
