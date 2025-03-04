import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface TransactionStepperProps {
  steps: Step[];
  currentStep: number;
}

export function TransactionStepper({
  steps,
  currentStep,
}: TransactionStepperProps) {
  return (
    <div className="flex items-center space-x-1 mb-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step indicator */}
          <div className="flex items-center flex-1">
            {/* Line before step (except first step) */}
            {index !== 0 && (
              <div
                className={cn(
                  "h-[2px] flex-1 transition-colors",
                  currentStep > step.id
                    ? "bg-primary"
                    : currentStep === step.id
                      ? "bg-primary/30"
                      : "bg-muted"
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors relative group",
                currentStep > step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep === step.id
                    ? "bg-primary/30 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {step.id}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block w-max">
                <div className="bg-popover text-popover-foreground text-xs rounded-md py-1 px-2 shadow-md">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Line after step (except last step) */}
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 transition-colors",
                  currentStep > step.id
                    ? "bg-primary"
                    : currentStep === step.id
                      ? "bg-primary/30"
                      : "bg-muted"
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
