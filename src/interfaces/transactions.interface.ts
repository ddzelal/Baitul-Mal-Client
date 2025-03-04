export interface Transaction {
  transactionCreatorsNote: string | null;
  amount: number;
  promisedAmount: number | null;
  dueDate: string | null;
  currencyName: string;
  currencyCode: string;
  donorName: string | null;
  donorLastName: string | null;
  donorPhoneNumber: string | null;
  donorEmail: string | null;
  donorDescription: string | null;
  projectId: string | null;
}
