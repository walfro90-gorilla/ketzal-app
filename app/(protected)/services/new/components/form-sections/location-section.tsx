"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ServiceFormData } from "../../types/service-form.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation } from "lucide-react";
import { getGlobalLocations } from "@/app/(protected)/global-locations.api";
import { LoadingOverlay } from "../ui/loading-spinner";
import { FormErrorBoundary } from "./error-boundary";
import { ValidationFeedback } from "../ui/form-validation";

interface GlobalLocation {
  id: string;
  state: string;
  city: string;
}

export function LocationSection() {
  const { control, setValue, watch } = useFormContext<ServiceFormData>();
  const [locations, setLocations] = useState<GlobalLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Watch current values for dependent dropdowns
  const stateFrom = watch("stateFrom");
  const stateTo = watch("stateTo");

  // Get unique states
  const states = Array.from(new Set(locations.map(loc => loc.state))).sort();
  
  // Get cities for selected states
  const citiesFrom = locations.filter(loc => loc.state === stateFrom).map(loc => loc.city).sort();
  const citiesTo = locations.filter(loc => loc.state === stateTo).map(loc => loc.city).sort();

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGlobalLocations();
        setLocations(data);
      } catch (err) {
        setError("Error al cargar las ubicaciones. Por favor, intenta nuevamente.");
        console.error("Error loading locations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Reset city when state changes
  useEffect(() => {
    setValue("cityFrom", "");
  }, [stateFrom, setValue]);

  useEffect(() => {
    setValue("cityTo", "");
  }, [stateTo, setValue]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación del Servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ValidationFeedback
            type="error"
            message={error}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <FormErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación del Servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={isLoading} text="Cargando ubicaciones...">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origen */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <h3 className="font-medium">Origen</h3>
                </div>
                
                <FormField
                  control={control}
                  name="stateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Origen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar estado de origen">
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="cityFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad de Origen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!stateFrom || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar ciudad de origen">
                            <SelectValue placeholder={
                              !stateFrom 
                                ? "Primero selecciona un estado" 
                                : "Selecciona la ciudad"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {citiesFrom.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Destino */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <h3 className="font-medium">Destino</h3>
                </div>

                <FormField
                  control={control}
                  name="stateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Destino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar estado de destino">
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="cityTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad de Destino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!stateTo || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar ciudad de destino">
                            <SelectValue placeholder={
                              !stateTo 
                                ? "Primero selecciona un estado" 
                                : "Selecciona la ciudad"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {citiesTo.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Validation feedback */}
            {stateFrom && cityFrom && stateTo && cityTo && (
              <div className="mt-4">
                <ValidationFeedback
                  type="success"
                  message={`Ruta configurada: ${cityFrom}, ${stateFrom} → ${cityTo}, ${stateTo}`}
                />
              </div>
            )}
          </LoadingOverlay>
        </CardContent>
      </Card>
    </FormErrorBoundary>
  );
} 