import { Step } from "@/components/transactions/transaction-stepper";

export const TRANSACTION_STEPS: Step[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Enter transaction basic details",
  },
  {
    id: 2,
    title: "Donor Information",
    description: "Enter donor information",
  },
  {
    id: 3,
    title: "Additional Information",
    description: "Enter additional transaction details",
  },
];
