import axios from "axios";
import { AddCoordinatorRequestBody } from "../types/organization.domain.types";

async function addCoordinatorDomain(payload: AddCoordinatorRequestBody) {
  const res = await axios.post(
    `/organizationdomain/${payload.organizationDomainId}/coordinations`,
    {
      UserIds: payload.data.userIds,
    }
  );
  return res.data;
}

export const OrganizationDomainRequest = {
  addCoordinatorDomain,
};
