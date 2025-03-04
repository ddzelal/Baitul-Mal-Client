export interface GetFullOrganizationResponse
  extends GetBaseOrganizationResponse {
  budgetName: string;
  budgetAssignedAmount: number;
  budgetReservedAmount: number;
  budgetPendingAmount: number;
  budgetSpentAmount: number;
  currencyCode: string;
  currencyName: string;
}

export interface GetBaseOrganizationResponse {
  id: string;
  name: string;
}

export type GetOrganizationResponse =
  | GetFullOrganizationResponse
  | GetBaseOrganizationResponse;
