"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationFeedbackProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export function ValidationFeedback({ type, message, className }: ValidationFeedbackProps) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "text-green-600 bg-green-50 border-green-200",
    error: "text-red-600 bg-red-50 border-red-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200", 
    info: "text-blue-600 bg-blue-50 border-blue-200",
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "flex items-center gap-2 p-3 rounded-md border text-sm",
      colors[type],
      className
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface FormStepValidationProps {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  className?: string;
}

export function FormStepValidation({ isValid, errors, warnings = [], className }: FormStepValidationProps) {
  if (isValid && warnings.length === 0) {
    return (
      <ValidationFeedback
        type="success"
        message="Esta sección está completa"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {errors.map((error, index) => (
        <ValidationFeedback
          key={`error-${index}`}
          type="error"
          message={error}
        />
      ))}
      {warnings.map((warning, index) => (
        <ValidationFeedback
          key={`warning-${index}`}
          type="warning"
          message={warning}
        />
      ))}
    </div>
  );
} 