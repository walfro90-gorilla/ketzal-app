"use client";

import React, { useEffect, useRef } from "react";

interface FormAnnouncementsProps {
  message: string;
  priority?: "polite" | "assertive";
  className?: string;
}

export function FormAnnouncements({ message, priority = "polite", className }: FormAnnouncementsProps) {
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announceRef.current && message) {
      // Clear and then set the message to ensure it's announced
      announceRef.current.textContent = "";
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={announceRef}
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className || ""}`}
      role="status"
    />
  );
}

// Hook para anunciar cambios de paso
export function useStepAnnouncements(currentStep: number, stepTitle: string, totalSteps: number) {
  const [announcement, setAnnouncement] = React.useState("");

  useEffect(() => {
    const message = `Paso ${currentStep + 1} de ${totalSteps}: ${stepTitle}`;
    setAnnouncement(message);
  }, [currentStep, stepTitle, totalSteps]);

  return announcement;
}

// Hook para anunciar errores de validación
export function useValidationAnnouncements(errors: Record<string, unknown>) {
  const [announcement, setAnnouncement] = React.useState("");
  const prevErrorCount = useRef(0);

  useEffect(() => {
    const errorCount = Object.keys(errors).length;
    
    if (errorCount > prevErrorCount.current) {
      const newErrors = errorCount - prevErrorCount.current;
      setAnnouncement(
        `Se ${newErrors === 1 ? 'ha encontrado' : 'han encontrado'} ${newErrors} ${newErrors === 1 ? 'error' : 'errores'} en el formulario`
      );
    } else if (errorCount === 0 && prevErrorCount.current > 0) {
      setAnnouncement("Todos los errores han sido corregidos");
    }
    
    prevErrorCount.current = errorCount;
  }, [errors]);

  return announcement;
} 