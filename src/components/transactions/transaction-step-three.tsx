import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "@/schemas/transaction.schema";

interface TransactionStepThreeProps {
  form: UseFormReturn<TransactionFormData>;
}

export function TransactionStepThree({ form }: TransactionStepThreeProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="donorDescription"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              Donor Description
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Additional information about the donor"
                className="h-10 px-3 py-2 border rounded-md"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Optional field for additional donor information.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transactionCreatorsNote"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              Transaction Note
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Add a note about this transaction"
                className="h-10 px-3 py-2 border rounded-md"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Optional note for internal reference.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />
    </>
  );
}
