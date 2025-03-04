import axios from "axios";
import { OrganizationInfo } from "@/interfaces/organization.interface";

async function getOrganizationInfo(): Promise<OrganizationInfo> {
  const res = await axios.get<OrganizationInfo>("/organizationInfo");
  return res.data;
}

export const OrganizationRequest = {
  getOrganizationInfo,
};
