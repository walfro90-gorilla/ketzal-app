"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ServiceFormData } from "../../validations/service-form.validation";
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
import { getGlobalLocations, GlobalLocation } from "@/app/(protected)/global-locations.api";
import { LoadingOverlay } from "../ui/loading-spinner";
import { FormErrorBoundary } from "./error-boundary";
import { ValidationFeedback } from "../ui/form-validation";

// Helper hook to track previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function LocationSection() {
  const { control, setValue, watch } = useFormContext<ServiceFormData>();
  const [locations, setLocations] = useState<GlobalLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for country selectors, initialized from form state
  const [countryFrom, setCountryFrom] = useState<string | undefined>(watch("countryFrom"));
  const [countryTo, setCountryTo] = useState<string | undefined>(watch("countryTo"));

  // Watch current values for dependent dropdowns
  const stateFrom = watch("stateFrom");
  const cityFrom = watch("cityFrom");
  const stateTo = watch("stateTo");
  const cityTo = watch("cityTo");

  // Track previous values to detect changes
  const prevCountryFrom = usePrevious(countryFrom);
  const prevStateFrom = usePrevious(stateFrom);
  const prevCountryTo = usePrevious(countryTo);
  const prevStateTo = usePrevious(stateTo);

  // Get unique countries, states, and cities
  const countries = Array.from(new Set(locations.map(loc => loc.country))).sort();
  
  const statesFrom = countryFrom
    ? Array.from(new Set(locations.filter(loc => loc.country === countryFrom).map(loc => loc.state))).sort()
    : [];
  
  const citiesFrom = stateFrom
    ? locations.filter(loc => loc.state === stateFrom).map(loc => loc.city).sort()
    : [];

  const statesTo = countryTo
    ? Array.from(new Set(locations.filter(loc => loc.country === countryTo).map(loc => loc.state))).sort()
    : [];

  const citiesTo = stateTo
    ? locations.filter(loc => loc.state === stateTo).map(loc => loc.city).sort()
    : [];

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

  // Reset dependent fields only when the parent value actually changes
  useEffect(() => {
    if (prevCountryFrom !== undefined && countryFrom !== prevCountryFrom) {
      setValue("stateFrom", "");
      setValue("cityFrom", "");
    }
  }, [countryFrom, prevCountryFrom, setValue]);

  useEffect(() => {
    if (prevStateFrom !== undefined && stateFrom !== prevStateFrom) {
      setValue("cityFrom", "");
    }
  }, [stateFrom, prevStateFrom, setValue]);

  useEffect(() => {
    if (prevCountryTo !== undefined && countryTo !== prevCountryTo) {
      setValue("stateTo", "");
      setValue("cityTo", "");
    }
  }, [countryTo, prevCountryTo, setValue]);

  useEffect(() => {
    if (prevStateTo !== undefined && stateTo !== prevStateTo) {
      setValue("cityTo", "");
    }
  }, [stateTo, prevStateTo, setValue]);

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

                <FormItem>
                  <FormLabel>País de Origen</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCountryFrom(value);
                      setValue("countryFrom", value, { shouldValidate: true });
                    }}
                    value={countryFrom || ""}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger aria-label="Seleccionar país de origen">
                        <SelectValue placeholder="Selecciona el país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                
                <FormField
                  control={control}
                  name="stateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Origen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!countryFrom || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar estado de origen">
                            <SelectValue placeholder={!countryFrom ? "Primero selecciona un país" : "Selecciona el estado"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statesFrom.map((state) => (
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

                <FormItem>
                  <FormLabel>País de Destino</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCountryTo(value);
                      setValue("countryTo", value, { shouldValidate: true });
                    }}
                    value={countryTo || ""}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger aria-label="Seleccionar país de destino">
                        <SelectValue placeholder="Selecciona el país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormField
                  control={control}
                  name="stateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Destino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!countryTo || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar estado de destino">
                            <SelectValue placeholder={!countryTo ? "Primero selecciona un país" : "Selecciona el estado"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statesTo.map((state) => (
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
            {countryFrom && stateFrom && cityFrom && countryTo && stateTo && cityTo && (
              <div className="mt-4">
                <ValidationFeedback
                  type="success"
                  message={`Ruta configurada: ${cityFrom}, ${stateFrom}, ${countryFrom} → ${cityTo}, ${stateTo}, ${countryTo}`}
                />
              </div>
            )}
          </LoadingOverlay>
        </CardContent>
      </Card>
    </FormErrorBoundary>
  );
}
