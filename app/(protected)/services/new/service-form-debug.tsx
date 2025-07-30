"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DebugFormProps {
  suppliers?: any[];
  service?: any;
  session?: any;
}

export default function ServiceFormDebug({ suppliers, service, session }: DebugFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();

  const steps = [
    { id: 0, title: "Información Básica", description: "Datos principales del servicio" },
    { id: 1, title: "Imágenes", description: "Fotos del servicio" },
    { id: 2, title: "Precios", description: "Precio y disponibilidad" },
  ];

  const nextStep = () => {
    console.log("Next step clicked, current:", currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      console.log("Moving to step:", currentStep + 1);
    }
  };

  const previousStep = () => {
    console.log("Previous step clicked, current:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      console.log("Moving to step:", currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Servicio</label>
              <Input placeholder="Ej: Tour a la Juárez" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Servicio</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tour">Tour</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Textarea placeholder="Describe tu servicio..." />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Imágenes del Servicio</h3>
            <p className="text-muted-foreground">
              Aquí irían los componentes de carga de imágenes.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p>Componente de imágenes (en desarrollo)</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Precios y Fechas</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Precio</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <p className="text-muted-foreground">
              Aquí irían los componentes de fechas y precios.
            </p>
          </div>
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-blue-800 font-medium">🔧 Modo Debug - Formulario de Prueba</h3>
          <p className="text-blue-700 text-sm mt-1">
            Paso actual: {currentStep + 1} de {steps.length} - {steps[currentStep]?.title}
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index < currentStep 
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }
              `}>
                {index + 1}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>

        {/* Debug Console */}
        <div className="bg-gray-50 border rounded-md p-4">
          <h4 className="font-medium mb-2">Debug Console:</h4>
          <p className="text-sm text-gray-600">
            Abre la consola del navegador (F12) para ver los logs de navegación.
          </p>
        </div>
      </div>
    </FormProvider>
  );
} 