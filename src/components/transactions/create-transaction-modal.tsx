import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { TransactionFormData } from "@/schemas/transaction.schema";
import { TransactionStepper } from "./transaction-stepper";
import { TransactionStepOne } from "./transaction-step-one";
import { TransactionStepTwo } from "./transaction-step-two";
import { TransactionStepThree } from "./transaction-step-three";
import { TRANSACTION_STEPS } from "@/constants/transaction.constants";
import { useTransactionForm } from "@/hooks/use-transaction-form.hook";

interface CreateTransactionModalProps {
  trigger?: React.ReactNode;
  initialData?: Partial<TransactionFormData>;
  onSuccess?: () => void;
}

export function CreateTransactionModal({
  trigger,
  initialData,
  onSuccess,
}: CreateTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    form,
    currentStep,
    isPending,
    hasValidAmounts,
    handleNext,
    prevStep,
    onSubmit,
  } = useTransactionForm({
    initialData,
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TransactionStepOne form={form} />;
      case 2:
        return <TransactionStepTwo form={form} />;
      case 3:
        return <TransactionStepThree form={form} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90">
            Create Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[500px] md:w-full h-[90vh] md:h-auto rounded-lg shadow-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            {TRANSACTION_STEPS[currentStep - 1].title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {TRANSACTION_STEPS[currentStep - 1].description}
          </DialogDescription>
        </DialogHeader>

        <TransactionStepper
          steps={TRANSACTION_STEPS}
          currentStep={currentStep}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-2 py-3 overflow-y-auto max-h-[calc(90vh-250px)] md:max-h-[60vh]"
          >
            {renderStepContent()}
          </form>
        </Form>

        {/* Display root form error if any */}
        {form.formState.errors.root && (
          <div className="px-4 py-2 mb-2 text-sm text-red-500 bg-red-50 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 mt-6 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => (currentStep === 1 ? setIsOpen(false) : prevStep())}
            className="w-full sm:w-auto"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < TRANSACTION_STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              disabled={!hasValidAmounts}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending || !hasValidAmounts}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
