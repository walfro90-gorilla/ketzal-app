"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormStep } from "../../types/service-form.types";
import { FormAnnouncements, useStepAnnouncements } from "../accessibility/form-announcements";

interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  const currentStepTitle = steps[currentStep]?.title || "";
  const announcement = useStepAnnouncements(currentStep, currentStepTitle, steps.length);

  const handleKeyDown = (event: React.KeyboardEvent, stepIndex: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStepClick(stepIndex);
    }
  };

  return (
    <div className="w-full">
      <FormAnnouncements message={announcement} />
      
      <nav aria-label="Progreso del formulario" className="w-full">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Button */}
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={index > currentStep && !steps[index - 1]?.isComplete}
                  aria-current={index === currentStep ? "step" : undefined}
                  aria-describedby={`step-${index}-description`}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                    {
                      // Completed step
                      "bg-primary border-primary text-primary-foreground": 
                        index < currentStep || step.isComplete,
                      // Current step
                      "border-primary text-primary bg-primary/10": 
                        index === currentStep,
                      // Future step (accessible)
                      "border-muted-foreground/50 text-muted-foreground hover:border-primary/50 hover:text-primary": 
                        index > currentStep && steps[index - 1]?.isComplete,
                      // Future step (disabled)
                      "border-muted-foreground/30 text-muted-foreground/50 cursor-not-allowed": 
                        index > currentStep && !steps[index - 1]?.isComplete,
                    }
                  )}
                >
                  {index < currentStep || step.isComplete ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p 
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      {
                        "text-primary": index === currentStep,
                        "text-foreground": index < currentStep || step.isComplete,
                        "text-muted-foreground": index > currentStep,
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  <p 
                    id={`step-${index}-description`}
                    className="text-xs text-muted-foreground mt-1 hidden sm:block"
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 ml-4 mr-4">
                  <div 
                    className={cn(
                      "h-0.5 w-full transition-colors duration-200",
                      {
                        "bg-primary": index < currentStep,
                        "bg-muted-foreground/30": index >= currentStep,
                      }
                    )}
                    aria-hidden="true"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile Progress Bar */}
      <div className="mt-4 sm:hidden">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Paso {currentStep + 1} de {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% completado</span>
        </div>
        <div className="mt-2 bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Progreso: ${currentStep + 1} de ${steps.length} pasos completados`}
          />
        </div>
      </div>
    </div>
  );
} 