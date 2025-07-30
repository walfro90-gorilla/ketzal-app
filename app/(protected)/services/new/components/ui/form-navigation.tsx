"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react"

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
  canProceed?: boolean
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  canProceed = true
}: FormNavigationProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex gap-2">
        {!isLastStep ? (
          <Button 
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Creando Servicio...
              </>
            ) : (
              'Crear Servicio'
            )}
          </Button>
        )}
      </div>

      {/* Indicador de progreso */}
      <div className="text-sm text-gray-500">
        {currentStep + 1} de {totalSteps}
      </div>
    </div>
  )
} 