import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionFormData,
  transactionSchema,
} from "@/schemas/transaction.schema";
import { TransactionQueries } from "@/api/queries/transaction.queries";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { currencies } from "@/constants/currency.constants";
import { toast } from "./use-toast";

interface ApiError {
  response?: {
    data?: {
      Message?: string;
      ErrorCode?: string;
      Details?: string;
      StackTrace?: string;
    };
  };
  message?: string;
}

interface UseTransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSuccess?: () => void;
}

export const useTransactionForm = ({
  initialData,
  onSuccess,
}: UseTransactionFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      promisedAmount: initialData?.promisedAmount || 0,
      projectId: initialData?.projectId || null,
      currencyName: initialData?.currencyName || currencies[0].name,
      currencyCode: initialData?.currencyCode || currencies[0].code,
      dueDate: initialData?.dueDate || null,
      donorName: initialData?.donorName || "",
      donorLastName: initialData?.donorLastName || "",
      donorPhoneNumber: initialData?.donorPhoneNumber || "",
      donorEmail: initialData?.donorEmail || "",
      donorDescription: initialData?.donorDescription || "",
      transactionCreatorsNote: initialData?.transactionCreatorsNote || "",
    },
  });

  const { mutate: createTransaction, isPending } =
    TransactionQueries.useCreateTransaction();

  // Watch for Amount and Promised Amount values to validate if at least one is filled
  const amount = form.watch("amount");
  const promisedAmount = form.watch("promisedAmount");
  const hasValidAmounts =
    (amount && amount > 0) || (promisedAmount && promisedAmount > 0);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsToValidateByStep(currentStep);
    const result = await form.trigger(fieldsToValidate);

    if (!hasValidAmounts) {
      form.setError("amount", {
        type: "custom",
        message: "Either Amount or Promised Amount must be filled",
      });
      return;
    }

    const projectId = form.getValues("projectId");
    if (projectId === "00000000-0000-0000-0000-000000000000") {
      form.setValue("projectId", null);
    }

    if (result) {
      nextStep();
    }
  };

  const getFieldsToValidateByStep = (
    step: number
  ): (keyof TransactionFormData)[] => {
    switch (step) {
      case 1:
        return ["currencyName", "currencyCode"];
      case 2:
        if (promisedAmount && promisedAmount > 0) {
          return [
            "donorName",
            "donorLastName",
            "donorPhoneNumber",
            "donorEmail",
            "dueDate",
          ];
        }
        return [];
      case 3:
        return ["donorDescription", "transactionCreatorsNote"];
      default:
        return [];
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    if (!hasValidAmounts) {
      form.setError("amount", {
        type: "custom",
        message: "Either Amount or Promised Amount must be filled",
      });
      return;
    }

    const submissionData = {
      ...data,
      projectId: data.projectId || null,
      donorName: data.donorName || null,
      donorLastName: data.donorLastName || null,
      donorPhoneNumber: data.donorPhoneNumber || null,
      donorEmail: data.donorEmail || null,
      donorDescription: data.donorDescription || null,
      transactionCreatorsNote: data.transactionCreatorsNote || null,
    };

    createTransaction(submissionData, {
      onSuccess: () => {
        form.reset();
        setCurrentStep(1);
        onSuccess?.();
        toast({
          title: "Transaction created successfully",
          description: "Transaction has been created successfully",
        });
      },
      onError: (error: ApiError) => {
        handleSubmissionError(error, form);
      },
    });
  };

  return {
    form,
    currentStep,
    isPending,
    hasValidAmounts,
    handleNext,
    prevStep,
    onSubmit,
  };
};

// Helper function to handle submission errors
function handleSubmissionError(
  error: ApiError,
  form: UseFormReturn<TransactionFormData>
) {
  console.error("Error submitting data:", error);

  if (error?.response?.data?.Message) {
    const errorMessage = error.response.data.Message;

    if (errorMessage.includes("Project Id")) {
      form.setError("projectId", {
        type: "custom",
        message:
          "Invalid project selected. Please select a valid project or no project.",
      });
    } else if (errorMessage.includes("Amount")) {
      form.setError("amount", {
        type: "custom",
        message: errorMessage,
      });
    } else if (errorMessage.includes("Promised Amount")) {
      form.setError("promisedAmount", {
        type: "custom",
        message: errorMessage,
      });
    } else {
      form.setError("root", {
        type: "custom",
        message: `Error creating transaction: ${errorMessage}`,
      });
    }
  } else {
    form.setError("root", {
      type: "custom",
      message: "Error creating transaction. Please try again.",
    });
  }
}
