import { useQuery } from "@tanstack/react-query";
import { DummyRequest } from "@/api/requests/dummy.request.ts";

const useDummyAuth = () => {
  return useQuery({
    queryFn: DummyRequest.getDelayedDummyRequest,
    queryKey: ["dummy"],
  });
};

export const DummyQueries = {
  useDummyAuth,
};
