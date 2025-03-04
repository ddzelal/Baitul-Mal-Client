import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { currencies } from "@/constants/currency.constants";
import { ProjectQueries } from "@/api/queries/project.queries";
import { useInView } from "react-intersection-observer";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter.hook";
import { CurrencyCode } from "@/interfaces/organization.interface";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "@/schemas/transaction.schema";
import { IUserRole } from "@/interfaces/auth.interface";
import { useAuth } from "@/hooks/use-auth.hook";

interface TransactionStepOneProps {
  form: UseFormReturn<TransactionFormData>;
}

export function TransactionStepOne({ form }: TransactionStepOneProps) {
  const [open, setOpen] = useState(false);
  const formatCurrency = useCurrencyFormatter();
  const currencyCode = form.watch("currencyCode") as CurrencyCode;
  const { user } = useAuth();

  const {
    data: projectsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = ProjectQueries.useGetAllInfinite(
    {
      PageSize: 5,
    },
    user?.role !== IUserRole.Unassigned
  );

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <FormField
        control={form.control}
        name="projectId"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">Project</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-10 px-3 py-2 border rounded-md"
                  >
                    {field.value
                      ? projectsData?.pages
                          .flatMap((page) => page.items)
                          .find((project) => project.id === field.value)?.name
                      : "Select project (optional)"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
                <Command>
                  <CommandInput
                    placeholder="Search projects..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No projects found</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="clear-selection"
                        onSelect={() => {
                          form.setValue("projectId", null);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="text-muted-foreground">
                          No project (direct donation)
                        </span>
                      </CommandItem>

                      {projectsData?.pages.map((page) =>
                        page.items.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.id}
                            onSelect={() => {
                              form.setValue("projectId", project.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === project.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {project.name}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                    {hasNextPage && (
                      <div
                        ref={ref}
                        className="flex items-center justify-center p-2"
                      >
                        {isFetchingNextPage ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Load more
                          </span>
                        )}
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                If no project is selected, funds will go directly to the
                organization.
              </span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currencyName"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">Currency*</FormLabel>
            <Select
              onValueChange={(value) => {
                const currency = currencies.find((c) => c.name === value);
                if (currency) {
                  field.onChange(currency.name);
                  form.setValue("currencyCode", currency.code);
                }
              }}
              value={field.value}
              defaultValue={currencies[0].name}
            >
              <FormControl>
                <SelectTrigger className="h-10 px-3 py-2 border rounded-md">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.name}>
                    {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
                className="h-10 px-3 py-2 border rounded-md"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(0);
                  } else {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const formattedValue = Number(numValue.toFixed(2));
                      field.onChange(formattedValue);
                    }
                  }
                }}
              />
            </FormControl>
            {field.value !== undefined &&
              field.value !== null &&
              field.value > 0 && (
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(field.value, currencyCode)}
                </div>
              )}
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Either Amount or Promised Amount must be filled.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="promisedAmount"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              Promised Amount
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
                className="h-10 px-3 py-2 border rounded-md"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(0);
                  } else {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const formattedValue = Number(numValue.toFixed(2));
                      field.onChange(formattedValue);
                    }
                  }
                }}
              />
            </FormControl>
            {field.value !== undefined &&
              field.value !== null &&
              field.value > 0 && (
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(field.value, currencyCode)}
                </div>
              )}
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                If you enter a promised amount, donor information will be
                required in the next step.
              </span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />
    </>
  );
}
