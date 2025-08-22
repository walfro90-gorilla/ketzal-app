"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";
import VirtualItinerary from "@/components/virtual-itinerary-custom";
import { ServiceFormData } from "../../validations/service-form.validation";

export function ItinerarySection() {
  const { control, formState: { errors } } = useFormContext<ServiceFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Itinerario del Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configura el itinerario detallado de tu servicio. Agrega actividades, horarios y descripciones para cada día.
          </p>
          
          <VirtualItinerary activities={fields} addActivity={append} removeActivity={remove} />
        </div>

        {errors.itinerary && (
          <p className="text-sm text-red-500">{errors.itinerary.message as string}</p>
        )}
      </CardContent>
    </Card>
  );
}
