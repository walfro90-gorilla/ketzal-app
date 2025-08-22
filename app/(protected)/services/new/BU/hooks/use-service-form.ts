"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema } from "@/validations/serviceSchema"
import type { ServiceFormData, Service, ServiceDateRange, FormSummary } from "../types/service-form.types"

// Helper para normalizar imágenes
function normalizeImages(images: unknown): { imgBanner: string; imgAlbum: string[] } {
  if (
    images &&
    typeof images === "object" &&
    !Array.isArray(images) &&
    "imgBanner" in images &&
    "imgAlbum" in images
  ) {
    const imgBanner = (images as any).imgBanner ?? ""
    const imgAlbumRaw = (images as any).imgAlbum
    const imgAlbum = Array.isArray(imgAlbumRaw)
      ? imgAlbumRaw.filter((x): x is string => typeof x === "string")
      : typeof imgAlbumRaw === "string"
        ? [imgAlbumRaw]
        : []
    return { imgBanner: String(imgBanner), imgAlbum }
  }
  return { imgBanner: "", imgAlbum: [] }
}

// Helper para obtener valores por defecto
function getDefaultValues(service?: Service): ServiceFormData {
  return {
    supplierId: service?.supplierId,
    name: service?.name,
    description: service?.description,
    price: service?.price,
    availableFrom: service?.availableFrom,
    availableTo: service?.availableTo,
    images: normalizeImages(service?.images),
    ytLink: service?.ytLink,
    sizeTour: service?.sizeTourM,
    serviceType: service?.serviceType,
    serviceCategory: service?.serviceCategory,
    stateFrom: service?.stateFrom,
    cityFrom: service?.cityFrom,
    stateTo: service?.stateTo,
    cityTo: service?.cityTo,
    includes: service?.includes,
    excludes: service?.excludes,
    faqs: service?.faqs,
    itinerary: service?.activities,
    transportProviderID: service?.transportProviderID,
    hotelProviderID: service?.hotelProviderID,
    packages: service?.packs?.data || [],
    dateRanges: [],
  }
}



export const useServiceForm = (service?: Service) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateRanges, setDateRanges] = useState<ServiceDateRange[]>([])
  const [formSummary, setFormSummary] = useState<FormSummary | null>(null)

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: getDefaultValues(service),
    mode: 'onChange'
  })

  const steps = useMemo(() => [
    { 
      id: 0, 
      title: 'Información Básica', 
      description: 'Datos principales del servicio',
      component: 'BasicInfoSection',
      isComplete: false,
      isRequired: true 
    },
    { 
      id: 1, 
      title: 'Imágenes', 
      description: 'Fotos del servicio',
      component: 'ImagesSection',
      isComplete: false,
      isRequired: true 
    },
    { 
      id: 2, 
      title: 'Precios y Fechas', 
      description: 'Precio y disponibilidad',
      component: 'PricingSection',
      isComplete: false,
      isRequired: true 
    },
    { 
      id: 3, 
      title: 'Ubicación', 
      description: 'Origen y destino',
      component: 'LocationSection',
      isComplete: false,
      isRequired: false 
    },
    { 
      id: 4, 
      title: 'Proveedores', 
      description: 'Transporte y hospedaje',
      component: 'ProvidersSection',
      isComplete: false,
      isRequired: false 
    },
    { 
      id: 5, 
      title: 'Paquetes', 
      description: 'Opciones de paquetes',
      component: 'PackagesSection',
      isComplete: false,
      isRequired: false 
    },
    { 
      id: 6, 
      title: 'Itinerario', 
      description: 'Actividades del tour',
      component: 'ItinerarySection',
      isComplete: false,
      isRequired: false 
    },
    { 
      id: 7, 
      title: 'Servicios Incluidos', 
      description: 'Qué incluye y qué no',
      component: 'IncludesSection',
      isComplete: false,
      isRequired: false 
    },
    { 
      id: 8, 
      title: 'FAQs', 
      description: 'Preguntas frecuentes',
      component: 'FAQsSection',
      isComplete: false,
      isRequired: false 
    },
  ], [])

  const validateStep = (stepId: number): boolean => {
    // For now, let's skip validation to test navigation
    return true
  }

  const updateStepCompletion = (stepId: number, isComplete: boolean) => {
    steps[stepId].isComplete = isComplete
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        updateStepCompletion(currentStep, true)
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepId: number) => {
    if (stepId >= 0 && stepId < steps.length) {
      setCurrentStep(stepId)
    }
  }

  const prepareFormSummary = (): FormSummary => {
    const formData = form.getValues()
    return {
      name: formData.name,
      price: formData.price,
      availableFrom: formData.availableFrom,
      availableTo: formData.availableTo,
      supplier: "Proveedor actual", // Esto se debe obtener del contexto
      imgBanner: formData.images?.imgBanner,
      imgAlbumCount: formData.images?.imgAlbum?.length || 0,
    }
  }

  return {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    steps,
    dateRanges,
    setDateRanges,
    formSummary,
    setFormSummary,
    validateStep,
    updateStepCompletion,
    nextStep,
    previousStep,
    goToStep,
    prepareFormSummary,
    canGoNext: currentStep < steps.length - 1,
    canGoPrevious: currentStep > 0,
    isLastStep: currentStep === steps.length - 1,
    submitForm: async (data: ServiceFormData) => {
      console.log("Submitting form:", data);
      // TODO: Implement form submission logic
    }
  }
} 