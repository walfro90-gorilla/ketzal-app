"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Route } from "lucide-react"
import VirtualItinerary from "@/components/virtual-itinerary-custom"

export function ItinerarySection() {
  const { register, formState: { errors } } = useFormContext()

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
          
          <VirtualItinerary />
        </div>

        {errors.itinerary && (
          <p className="text-sm text-red-500">{errors.itinerary.message as string}</p>
        )}

        {/* Hidden input for form registration */}
        <input {...register("itinerary")} type="hidden" />
      </CardContent>
    </Card>
  )
} 