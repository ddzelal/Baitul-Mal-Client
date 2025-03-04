import { useQuery } from "@tanstack/react-query";
import { DonorRequests } from "../requests/donor.requests";
import { IDonor } from "../types/donor.types";
import { PaginatedResponse, QueryParams } from "../types/global.types";
import { QUERY_KEYS } from "../constants/queries.constants";

const useGetAll = (params?: QueryParams<IDonor>) => {
  return useQuery<PaginatedResponse<IDonor>>({
    queryFn: () => DonorRequests.getAll(params),
    queryKey: [QUERY_KEYS.DONOR_GET_ALL, params],
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

export const DonorQueries = {
  useGetAll,
};
