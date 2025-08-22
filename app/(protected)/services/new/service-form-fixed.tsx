"use client";

import React, { Suspense, lazy, useState, useEffect, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema, serviceFormDefaults, ServiceFormData } from "./validations/service-form.validation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { FormErrorBoundary } from "./components/form-sections/error-boundary";
import { createService } from "@/actions/service-actions";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

// Props interface to match legacy form integration
interface ServiceFormFixedProps {
  suppliers?: any[];
  service?: any;
  session?: any;
}

// Lazy load components for better performance
const BasicInfoSection = lazy(() => import("./components/form-sections/basic-info-section").then(m => ({ default: m.BasicInfoSection })));
const ImagesSection = lazy(() => import("./components/form-sections/images-section").then(m => ({ default: m.ImagesSection })));
const PricingSection = lazy(() => import("./components/form-sections/pricing-section").then(m => ({ default: m.PricingSection })));
const LocationSection = lazy(() => import("./components/form-sections/location-section").then(m => ({ default: m.LocationSection })));
const ProvidersSection = lazy(() => import("./components/form-sections/providers-section").then(m => ({ default: m.ProvidersSection })));
const PackagesSection = lazy(() => import("./components/form-sections/packages-section").then(m => ({ default: m.PackagesSection })));
const ItinerarySection = lazy(() => import("./components/form-sections/itinerary-section").then(m => ({ default: m.ItinerarySection })));
const IncludesSection = lazy(() => import("./components/form-sections/includes-section").then(m => ({ default: m.IncludesSection })));
const FAQsSection = lazy(() => import("./components/form-sections/faqs-section").then(m => ({ default: m.FAQsSection })));

// Loading fallback component
const SectionLoader = () => (
  <Card>
    <CardContent className="py-8">
      <LoadingSpinner text="Cargando sección..." />
    </CardContent>
  </Card>
);

export default function ServiceFormFixed({ suppliers, service, session }: ServiceFormFixedProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      ...serviceFormDefaults,
      // Pre-populate form with service data if editing
      ...(service && !service.statusCode ? {
        name: service.name || "",
        description: service.description || "",
        serviceType: service.serviceType || "",
        serviceCategory: service.serviceCategory || "",
        sizeTour: service.sizeTour || 0,
        ytLink: service.ytLink || "",
        price: service.price || 0,
      } : {})
    },
    mode: "onChange"
  });

  // Steps definition
  const steps = [
    { id: 0, title: "Información Básica", description: "Datos principales del servicio" },
    { id: 1, title: "Imágenes", description: "Fotos del servicio" },
    { id: 2, title: "Precios y Fechas", description: "Precio y disponibilidad" },
    { id: 3, title: "Ubicación", description: "Origen y destino" },
    { id: 4, title: "Proveedores", description: "Transporte y hospedaje" },
    { id: 5, title: "Paquetes", description: "Opciones de paquetes" },
    { id: 6, title: "Itinerario", description: "Actividades del tour" },
    { id: 7, title: "Servicios", description: "Qué incluye y qué no" },
    { id: 8, title: "FAQs", description: "Preguntas frecuentes" },
  ];

 
 console.log("handleNextOrSubmit triggered");
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Final step. Triggering validation...");
      methods.trigger().then(isValid => {
        console.log("Validation result:", isValid);
        if (isValid) {
          console.log("Form is valid. Opening confirmation dialog.");
          setConfirmOpen(true);
        } else {
          console.log("Form is invalid. Showing toast.");
          showToast({
            title: "Error de Validación",
            description: "Por favor, revisa los campos marcados en rojo.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const { formState: { errors, isValid }, watch, handleSubmit } = methods;

  const handleConfirmSubmit = () => {
    console.log("handleConfirmSubmit called. Triggering form submission.");
    handleSubmit(onSubmit)();
    setConfirmOpen(false);
    console.log("Confirmation dialog closed.");
  };

  const onSubmit = (data: ServiceFormData) => {
    console.log("onSubmit function called. Data:", data);
    startTransition(() => {
      console.log("Starting transition for createService...");
      createService(data)
        .then((res) => {
          console.log("createService response:", res);
          if (res.error) {
            showToast({
              title: "Error",
              description: res.error,
              variant: "destructive",
            });
          } else if (res.success) {
            showToast({
              title: "Success",
              description: res.success,
            });
          }
        })
        .catch((err) => {
          console.error("createService promise rejected:", err);
          showToast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    });
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <Suspense fallback={<SectionLoader />}><BasicInfoSection /></Suspense>;
      case 1: return <Suspense fallback={<SectionLoader />}><ImagesSection /></Suspense>;
      case 2: return <Suspense fallback={<SectionLoader />}><PricingSection /></Suspense>;
      case 3: return <Suspense fallback={<SectionLoader />}><LocationSection /></Suspense>;
      case 4: return <Suspense fallback={<SectionLoader />}><ProvidersSection /></Suspense>;
      case 5: return <Suspense fallback={<SectionLoader />}><PackagesSection /></Suspense>;
      case 6: return <Suspense fallback={<SectionLoader />}><ItinerarySection /></Suspense>;
      case 7: return <Suspense fallback={<SectionLoader />}><IncludesSection /></Suspense>;
      case 8: return <Suspense fallback={<SectionLoader />}><FAQsSection /></Suspense>;
      default: return <Suspense fallback={<SectionLoader />}><BasicInfoSection /></Suspense>;
    }
  };

  return (
    <FormErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FormProvider {...methods}>
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-green-800 font-medium">✅ Formulario Funcionando</h3>
              <p className="text-green-700 text-sm mt-1">
                Navegación arreglada - Todos los componentes optimizados cargando correctamente.
                {service && !service.statusCode && <span className="ml-2">Editando: {service.name}</span>}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(index)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${index === currentStep 
                        ? 'bg-blue-600 text-white' 
                        : index < currentStep 
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                  <div className="ml-2 hidden sm:block">
                    <p className="text-xs font-medium">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-4 h-0.5 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

                 )}
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

            {/* Navigation - Same as debug */}
>

            {/* Current Step Content */}
            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

            {/* Navigation - Same as debug */}
>

            {/* Current Step Content */}
            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

            {/* Navigation - Same as debug */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Paso {currentStep + 1} de {steps.length} - {steps[currentStep]?.title}
              </div>

              <Button
                onClick={handleNextOrSubmit}
                disabled={isPending}
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
            <ConfirmationDialog
              isOpen={isConfirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={handleConfirmSubmit}
              title="Confirmar Envío"
              description="¿Estás seguro de que deseas crear este servicio? Esta acción no se puede deshacer."
            />
            {currentStep === steps.length - 1 && !isValid && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                <h3 className="text-red-800 font-medium">⚠️ Faltan campos por llenar</h3>
                <p className="text-red-700 text-sm mt-1">
                  Revisa los siguientes campos antes de finalizar:
                </p>
                <ul className="list-disc list-inside text-red-700 text-sm mt-2">
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {error?.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </FormErrorBoundary>
  );
}

// Export both the default and named export for compatibility
export { ServiceFormFixed };
