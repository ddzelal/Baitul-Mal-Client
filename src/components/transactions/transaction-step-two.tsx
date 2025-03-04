import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoIcon, User, Check, XCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "@/schemas/transaction.schema";
import { DonorQueries } from "@/api/queries/donor.queries";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IDonor } from "@/api/types/donor.types";

interface TransactionStepTwoProps {
  form: UseFormReturn<TransactionFormData>;
}

export function TransactionStepTwo({ form }: TransactionStepTwoProps) {
  const promisedAmount = form.watch("promisedAmount");
  const isDonorInfoRequired = promisedAmount && promisedAmount > 0;

  const [emailOpen, setEmailOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<IDonor | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const donorEmail = form.watch("donorEmail");
  const donorPhoneNumber = form.watch("donorPhoneNumber");

  const { data: emailDonors } = DonorQueries.useGetAll({
    PageSize: 5,
    PageNumber: 1,
    SearchTerm: donorEmail || "",
  });

  const { data: phoneDonors } = DonorQueries.useGetAll({
    PageSize: 5,
    PageNumber: 1,
    SearchTerm: donorPhoneNumber || "",
  });

  useEffect(() => {
    if (
      donorEmail &&
      emailDonors?.items &&
      emailDonors.items.length > 0 &&
      !selectedDonor
    ) {
      setEmailOpen(true);
    } else {
      setEmailOpen(false);
    }
  }, [donorEmail, emailDonors, selectedDonor]);

  useEffect(() => {
    if (
      donorPhoneNumber &&
      phoneDonors?.items &&
      phoneDonors.items.length > 0 &&
      !selectedDonor
    ) {
      setPhoneOpen(true);
    } else {
      setPhoneOpen(false);
    }
  }, [donorPhoneNumber, phoneDonors, selectedDonor]);

  const handleSelectDonor = (donor: IDonor) => {
    form.setValue("donorEmail", donor.email || "");
    form.setValue("donorPhoneNumber", donor.phoneNumber || "");
    form.setValue("donorName", donor.name || "");
    form.setValue("donorLastName", donor.lastName || "");
    form.setValue("donorId", donor.id);
    setSelectedDonor(donor);
    setEmailOpen(false);
    setPhoneOpen(false);
  };

  const clearSelectedDonor = () => {
    setSelectedDonor(null);
    form.setValue("donorId", undefined);
  };

  return (
    <>
      {selectedDonor && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-blue-800">Izabrani donator</h3>
              <p className="text-sm text-blue-600">
                {selectedDonor.name} {selectedDonor.lastName}
                {selectedDonor.email && ` | ${selectedDonor.email}`}
                {selectedDonor.phoneNumber && ` | ${selectedDonor.phoneNumber}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelectedDonor}
              className="text-blue-800 hover:text-red-500 hover:bg-blue-100"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Poništi izbor
            </Button>
          </div>
        </div>
      )}

      <FormField
        control={form.control}
        name="donorEmail"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              {isDonorInfoRequired ? "Email*" : "Email"}
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className={cn(
                    "h-10 px-3 py-2 border rounded-md",
                    selectedDonor && "bg-gray-100"
                  )}
                  {...field}
                  value={field.value || ""}
                  ref={emailInputRef}
                  disabled={!!selectedDonor}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value && emailDonors?.items?.length) {
                      setEmailOpen(true);
                    }
                  }}
                />
              </FormControl>

              {/* Predlozi bez popover-a koji uzima fokus */}
              {emailOpen &&
                donorEmail &&
                emailDonors?.items &&
                emailDonors.items.length > 0 && (
                  <div
                    className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Command className="w-full">
                      <CommandList>
                        <CommandGroup heading="Pronađeni donatori">
                          {emailDonors.items.map((donor) => (
                            <CommandItem
                              key={donor.id}
                              onSelect={() => {
                                handleSelectDonor(donor);
                                emailInputRef.current?.focus();
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <div>
                                  <p className="text-sm">{donor.email}</p>
                                  {donor.name && (
                                    <p className="text-xs text-muted-foreground">
                                      {donor.name} {donor.lastName}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  donor.email === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
            </div>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                {isDonorInfoRequired
                  ? "Required for promised amounts. Start typing to see matching donors."
                  : "Optional field. Start typing to see matching donors."}
              </span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="donorPhoneNumber"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              {isDonorInfoRequired ? "Phone Number*" : "Phone Number"}
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+387 61 123 456"
                  className={cn(
                    "h-10 px-3 py-2 border rounded-md",
                    selectedDonor && "bg-gray-100"
                  )}
                  {...field}
                  value={field.value || ""}
                  ref={phoneInputRef}
                  disabled={!!selectedDonor}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value && phoneDonors?.items?.length) {
                      setPhoneOpen(true);
                    }
                  }}
                />
              </FormControl>

              {/* Predlozi bez popover-a koji uzima fokus */}
              {phoneOpen &&
                donorPhoneNumber &&
                phoneDonors?.items &&
                phoneDonors.items.length > 0 && (
                  <div
                    className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Command className="w-full">
                      <CommandList>
                        <CommandGroup heading="Pronađeni donatori">
                          {phoneDonors.items.map((donor) => (
                            <CommandItem
                              key={donor.id}
                              onSelect={() => {
                                handleSelectDonor(donor);
                                phoneInputRef.current?.focus();
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <div>
                                  <p className="text-sm">{donor.phoneNumber}</p>
                                  {donor.name && (
                                    <p className="text-xs text-muted-foreground">
                                      {donor.name} {donor.lastName}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  donor.phoneNumber === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
            </div>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                {isDonorInfoRequired
                  ? "Required for promised amounts. Format: +387 XX XXX XXX. Start typing to see matching donors."
                  : "Optional field. Format: +387 XX XXX XXX. Start typing to see matching donors."}
              </span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">Due Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                className="h-10 px-3 py-2 border rounded-md"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Optional field.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="donorName"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">Donor Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter donor name"
                className={cn(
                  "h-10 px-3 py-2 border rounded-md",
                  selectedDonor && "bg-gray-100"
                )}
                {...field}
                value={field.value || ""}
                disabled={!!selectedDonor}
              />
            </FormControl>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Optional field.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="donorLastName"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sm font-medium">
              Donor Last Name
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter donor last name"
                className={cn(
                  "h-10 px-3 py-2 border rounded-md",
                  selectedDonor && "bg-gray-100"
                )}
                {...field}
                value={field.value || ""}
                disabled={!!selectedDonor}
              />
            </FormControl>
            <FormDescription className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Optional field.</span>
            </FormDescription>
            <FormMessage className="text-xs text-red-500 mt-1" />
          </FormItem>
        )}
      />
    </>
  );
}
