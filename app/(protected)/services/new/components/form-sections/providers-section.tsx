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
import { Bus, Hotel } from "lucide-react";
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api";
import { LoadingOverlay } from "../ui/loading-spinner";
import { FormErrorBoundary } from "./error-boundary";
import { ValidationFeedback } from "../ui/form-validation";

interface Supplier {
  id: string;
  name: string;
  type: "transport" | "hotel" | "traslados" | "agencia_viajes" | "agencia_traslados" | "agencia_local" | "guia";
  email?: string;
  phone?: string;
}

export function ProvidersSection() {
  const { control, setValue } = useFormContext<ServiceFormData>();
  
  const [transportProviders, setTransportProviders] = useState<Supplier[]>([]);
  const [hotelProviders, setHotelProviders] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading suppliers...');
        const suppliers = await getSuppliers();
        console.log('Raw suppliers response:', suppliers);
        console.log('Suppliers type:', typeof suppliers);
        console.log('Suppliers length:', suppliers?.length || 0);
        
        if (!Array.isArray(suppliers)) {
          console.error('Suppliers is not an array:', suppliers);
          throw new Error('Suppliers data is not an array');
        }
        
        console.log('All suppliers before filtering:');
        suppliers.forEach((s: Supplier, index: number) => {
          console.log(`Supplier ${index + 1}:`, {
            id: s.id,
            name: s.name,
            type: s.type,
            email: s.email,
            phone: s.phone
          });
        });
        
        const transport = suppliers.filter((s: Supplier) => {
          console.log('Checking supplier:', s.name, 'type:', s.type);
          return s.type === "transport" || s.type === "traslados";
        });
        const hotels = suppliers.filter((s: Supplier) => {
          return s.type === "hotel";
        });
        
        console.log('Transport providers found:', transport.length, transport);
        console.log('Hotel providers found:', hotels.length, hotels);
        
        setTransportProviders(transport);
        setHotelProviders(hotels);
      } catch (err) {
        setError("Error al cargar los proveedores. Por favor, intenta nuevamente.");
        console.error("Error loading suppliers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const handleTransportChange = (value: string) => {
    console.log('Transport provider selected:', value);
    setValue("transportProviderID", value);
  };

  const handleHotelChange = (value: string) => {
    console.log('Hotel provider selected:', value);
    setValue("hotelProviderID", value);
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proveedores de Servicio</CardTitle>
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
          <CardTitle>Proveedores de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={isLoading} text="Cargando proveedores...">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Proveedor de Transporte */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  <h3 className="font-medium">Transporte</h3>
                </div>

                <FormField
                  control={control}
                  name="transportProviderID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor de Transporte</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTransportChange(value);
                        }}
                        value={field.value || ""} 
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar proveedor de transporte">
                            <SelectValue placeholder={
                              transportProviders?.length === 0
                                ? "No hay proveedores disponibles"
                                : "Selecciona un proveedor"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportProviders && transportProviders.length > 0 ? (
                            transportProviders.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{provider.name}</span>
                                  {provider.email && (
                                    <span className="text-xs text-muted-foreground">
                                      {provider.email}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              No hay proveedores disponibles
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {transportProviders.length === 0 && !isLoading && (
                        <ValidationFeedback
                          type="warning"
                          message="No hay proveedores de transporte registrados"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Proveedor de Hotel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  <h3 className="font-medium">Hospedaje</h3>
                </div>

                <FormField
                  control={control}
                  name="hotelProviderID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor de Hospedaje</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleHotelChange(value);
                        }}
                        value={field.value || ""}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Seleccionar proveedor de hospedaje">
                            <SelectValue placeholder={
                              hotelProviders.length === 0
                                ? "No hay proveedores disponibles"
                                : "Selecciona un proveedor"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hotelProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{provider.name}</span>
                                {provider.email && (
                                  <span className="text-xs text-muted-foreground">
                                    {provider.email}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {hotelProviders.length === 0 && !isLoading && (
                        <ValidationFeedback
                          type="warning"
                          message="No hay proveedores de hospedaje registrados"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </LoadingOverlay>
        </CardContent>
      </Card>
    </FormErrorBoundary>
  );
} 