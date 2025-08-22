"use client"

import React, { useState } from "react"
import { Control, FieldErrors } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form";
import { ServiceFormData } from "../../validations/service-form.validation";

interface DateRange {
  availableFrom: Date;
  availableTo: Date;
}

export function PricingSection() {
  const {
    control,
    setValue,
    watch
  } = useFormContext<ServiceFormData>();

  const [currentRange, setCurrentRange] = useState<{
    availableFrom: Date | null
    availableTo: Date | null
  }>({ availableFrom: null, availableTo: null })

  const addDateRange = () => {
    if (currentRange.availableFrom && currentRange.availableTo) {
      setValue("dates", [
        ...(watch("dates") || []),
        {
          startDate: currentRange.availableFrom.toISOString(),
          endDate: currentRange.availableTo.toISOString(),
          price: 0, // You might want to add a field for this
        },
      ])
      setCurrentRange({ availableFrom: null, availableTo: null })
    }
  }

  const removeDateRange = (index: number) => {
    const dates = watch("dates") || [];
    setValue("dates", dates.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Precios y Fechas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="price"
          rules={{ required: "El precio es requerido" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Regular</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    field.onChange(isNaN(value) ? undefined : value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* These fields are redundant and will be removed */}
        </div>

        <div className="space-y-4">
          <div>
            <FormLabel className="text-base font-medium">
              Fechas Disponibles Adicionales
            </FormLabel>
            <p className="text-sm text-muted-foreground mb-4">
              Puedes agregar múltiples rangos de fechas para tu servicio
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !currentRange.availableFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentRange.availableFrom ? (
                    format(currentRange.availableFrom, "PPP", { locale: es })
                  ) : (
                    "Selecciona fecha de inicio"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentRange.availableFrom ?? undefined}
                  onSelect={(date) => 
                    setCurrentRange({ ...currentRange, availableFrom: date ?? null, availableTo: null })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">a</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !currentRange.availableTo && "text-muted-foreground"
                  )}
                  disabled={!currentRange.availableFrom}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentRange.availableTo ? (
                    format(currentRange.availableTo, "PPP", { locale: es })
                  ) : (
                    "Selecciona fecha de fin"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentRange.availableTo ?? undefined}
                  onSelect={(date) => 
                    setCurrentRange({ ...currentRange, availableTo: date ?? null })
                  }
                  disabled={(date) => 
                    !currentRange.availableFrom || 
                    date < currentRange.availableFrom
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button 
              type="button" 
              onClick={addDateRange}
              disabled={!currentRange.availableFrom || !currentRange.availableTo}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>

          {(watch("dates") || []).length > 0 && (
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Rangos Agregados:</FormLabel>
              <div className="space-y-2">
                {(watch("dates") || []).map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm">
                      {format(new Date(range.startDate), "PPP", { locale: es })} -{" "}
                      {format(new Date(range.endDate), "PPP", { locale: es })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDateRange(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
