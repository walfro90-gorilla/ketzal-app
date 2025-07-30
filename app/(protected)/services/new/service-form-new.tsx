"use client";

import React, { Suspense, lazy } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema, serviceFormDefaults, ServiceFormData } from "./validations/service-form.validation";
import { useServiceForm } from "./hooks/use-service-form";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { FormErrorBoundary } from "./components/form-sections/error-boundary";

// Props interface to match legacy form integration
interface ServiceFormNewProps {
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
const FormStepper = lazy(() => import("./components/ui/form-stepper").then(m => ({ default: m.FormStepper })));
const FormNavigation = lazy(() => import("./components/ui/form-navigation").then(m => ({ default: m.FormNavigation })));
const FormSummary = lazy(() => import("./components/ui/form-summary").then(m => ({ default: m.FormSummary })));

// Loading fallback component
const SectionLoader = () => (
  <Card>
    <CardContent className="py-8">
      <LoadingSpinner text="Cargando sección..." />
    </CardContent>
  </Card>
);

export default function ServiceFormNew({ suppliers, service, session }: ServiceFormNewProps) {
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
        // Add more fields as needed
      } : {})
    },
    mode: "onChange"
  });

  const {
    currentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
  } = useServiceForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Suspense fallback={<SectionLoader />}>
            <BasicInfoSection />
          </Suspense>
        );
      
      case 1:
        return (
          <Suspense fallback={<SectionLoader />}>
            <ImagesSection />
          </Suspense>
        );
      
      case 2:
        return (
          <Suspense fallback={<SectionLoader />}>
            <PricingSection />
          </Suspense>
        );

      case 3:
        return (
          <Suspense fallback={<SectionLoader />}>
            <LocationSection />
          </Suspense>
        );

      case 4:
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProvidersSection />
          </Suspense>
        );

      case 5:
        return (
          <Suspense fallback={<SectionLoader />}>
            <PackagesSection />
          </Suspense>
        );

      case 6:
        return (
          <Suspense fallback={<SectionLoader />}>
            <ItinerarySection />
          </Suspense>
        );

      case 7:
        return (
          <Suspense fallback={<SectionLoader />}>
            <IncludesSection />
          </Suspense>
        );

      case 8:
        return (
          <Suspense fallback={<SectionLoader />}>
            <FAQsSection />
          </Suspense>
        );

      case 9:
        return (
          <Suspense fallback={<SectionLoader />}>
            <FormSummary data={methods.watch()} />
          </Suspense>
        );
      
      default:
        return (
          <Suspense fallback={<SectionLoader />}>
            <BasicInfoSection />
          </Suspense>
        );
    }
  };

  return (
    <FormErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FormProvider {...methods}>
          <div className="space-y-8">
            {/* Development Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-blue-800 font-medium">🚀 Nuevo Formulario Activo</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Formulario refactorizado con optimizaciones de performance y accesibilidad.
                  {service && !service.statusCode && <span className="ml-2">Editando: {service.name}</span>}
                </p>
              </div>
            )}
            
            {/* Form Stepper */}
            <Suspense fallback={<LoadingSpinner text="Cargando navegación..." />}>
              <FormStepper 
                steps={steps}
                currentStep={currentStep}
                onStepClick={goToStep}
              />
            </Suspense>

            {/* Current Step Content */}
            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

            {/* Navigation */}
            <Suspense fallback={<LoadingSpinner text="Cargando controles..." />}>
              <FormNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={nextStep}
                onPrevious={previousStep}
                onSubmit={() => console.log("Submit form")}
                isSubmitting={false}
                canProceed={true}
              />
            </Suspense>
          </div>
        </FormProvider>
      </div>
    </FormErrorBoundary>
  );
}

// Export both the default and named export for compatibility
export { ServiceFormNew }; 