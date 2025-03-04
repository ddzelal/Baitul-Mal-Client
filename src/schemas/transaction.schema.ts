import { z } from "zod";

export const transactionSchema = z
  .object({
    transactionCreatorsNote: z.string().nullable().optional(),
    amount: z
      .number()
      .multipleOf(0.01, "Amount must have at most 2 decimal places")
      .transform((val) => Number(val.toFixed(2)))
      .nullable(),
    promisedAmount: z
      .number()
      .min(0, "Promised amount cannot be negative")
      .multipleOf(0.01, "Promised amount must have at most 2 decimal places")
      .transform((val) => Number(val.toFixed(2)))
      .nullable()
      .optional(),
    dueDate: z.string().nullable().optional(),
    currencyName: z.string().min(1, "Currency name is required"),
    currencyCode: z.string().min(1, "Currency code is required"),
    donorName: z.string().nullable().optional(),
    donorLastName: z.string().nullable().optional(),
    donorId: z.string().nullable().optional(),
    donorPhoneNumber: z
      .union([
        z
          .string()
          .regex(
            /^\+?[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{3,6}$/,
            "Invalid phone number format"
          ),
        z.string().length(0),
        z.null(),
      ])
      .optional(),
    donorEmail: z
      .union([
        z.string().email("Invalid email"),
        z.string().length(0),
        z.null(),
      ])
      .optional(),
    donorDescription: z.string().nullable().optional(),
    projectId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // Basic validation: either amount or promised amount must be provided
    if (
      (!data.amount || data.amount <= 0) &&
      (!data.promisedAmount || data.promisedAmount <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Amount or Promised Amount must be filled",
        path: ["amount"],
      });
    }

    // If promised amount is set, require only email and phone number
    if (data.promisedAmount && data.promisedAmount > 0) {
      if (!data.donorPhoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required when promised amount is set",
          path: ["donorPhoneNumber"],
        });
      } else if (
        data.donorPhoneNumber &&
        !data.donorPhoneNumber.match(
          /^\+?[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{3,6}$/
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number format",
          path: ["donorPhoneNumber"],
        });
      }
      if (!data.donorEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required when promised amount is set",
          path: ["donorEmail"],
        });
      } else if (data.donorEmail && !data.donorEmail.includes("@")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email format",
          path: ["donorEmail"],
        });
      }
    }
  });

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const transactionFormFields = [
  {
    name: "amount",
    label: "Amount",
    type: "number",
    step: "0.01",
    min: 0,
    placeholder: "0.00",
  },
  {
    name: "promisedAmount",
    label: "Promised Amount",
    type: "number",
    step: "0.01",
    min: 0,
    placeholder: "0.00",
  },
  {
    name: "donorName",
    label: "Donor Name",
    type: "text",
  },
  {
    name: "donorLastName",
    label: "Donor Last Name",
    type: "text",
  },
  {
    name: "donorPhoneNumber",
    label: "Phone Number",
    type: "text",
    placeholder: "+387 61 123 456",
  },
  {
    name: "donorEmail",
    label: "Email",
    type: "email",
  },
];

export const setupTransactionDefaultValues = ({
  initialData,
}: {
  initialData?: Partial<TransactionFormData>;
}): TransactionFormData => {
  return {
    amount: initialData?.amount || 0,
    promisedAmount: initialData?.promisedAmount || 0,
    projectId: initialData?.projectId || null,
    currencyName: initialData?.currencyName || "RSD",
    currencyCode: initialData?.currencyCode || "RSD",
    dueDate: initialData?.dueDate || null,
    donorName: initialData?.donorName || "",
    donorLastName: initialData?.donorLastName || "",
    donorPhoneNumber: initialData?.donorPhoneNumber || "",
    donorEmail: initialData?.donorEmail || "",
    donorDescription: initialData?.donorDescription || "",
    transactionCreatorsNote: initialData?.transactionCreatorsNote || "",
  };
};
