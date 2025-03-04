export type CurrencyCode = "RSD" | "EUR" | "USD";

export interface OrganizationInfo {
  id: string;
  name: string;
  currencyName: string;
  currencyCode: CurrencyCode;
  budgetName: string;
  budgetAssignedAmount: number;
  budgetReservedAmount: number;
  budgetPendingAmount: number;
  budgetSpentAmount: number;
  budgetUnassignedAmount: number;
}

export interface BudgetAmount {
  assigned: number;
  reserved: number;
  pending: number;
  spent: number;
}

export const extractBudgetAmounts = (org: OrganizationInfo): BudgetAmount => ({
  assigned: org.budgetAssignedAmount,
  reserved: org.budgetReservedAmount,
  pending: org.budgetPendingAmount,
  spent: org.budgetSpentAmount,
});
