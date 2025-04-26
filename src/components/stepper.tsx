"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type StepperProps = {
  currentStep: number;
  steps: string[];
  className?: string;
  onStepClick?: (step: number) => void;
  icons?: React.ReactNode[]; // Add icons prop
};

export function Stepper({
  currentStep = 1,
  steps = ["Wygląd", "Smak", "Opakowanie"],
  className,
  onStepClick,
  icons, // Add icons to component props
}: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative flex-1"
          >
            {/* Step connector line */}
            {index > 0 && (
              <div
                className={cn(
                  "absolute top-4 h-0.5 w-full -left-1/2",
                  index <= currentStep - 1 ? "bg-primary" : "bg-muted"
                )}
              />
            )}

            {/* Step button */}
            <button
              onClick={() => onStepClick?.(index + 1)}
              disabled={!onStepClick}
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                index + 1 < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index + 1 === currentStep
                  ? "border-primary bg-background text-primary"
                  : "border-muted bg-muted text-muted-foreground",
                onStepClick && "cursor-pointer"
              )}
            >
              {index + 1 < currentStep ? (
                <CheckIcon className="h-4 w-4" />
              ) : icons && icons[index] ? (
                icons[index]
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </button>

            {/* Step label */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                index + 1 <= currentStep
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
