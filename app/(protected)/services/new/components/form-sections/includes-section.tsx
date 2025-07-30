"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

interface TourItem {
  id: string
  name: string
}

const initialItems: TourItem[] = [
  { id: "1", name: "Hotel Accommodation" },
  { id: "2", name: "Breakfast" },
  { id: "3", name: "Guided Tours" },
  { id: "4", name: "Transportation" },
  { id: "5", name: "Entry Fees" },
  { id: "6", name: "Wi-Fi" },
  { id: "7", name: "Lunch" },
  { id: "8", name: "Dinner" },
  { id: "9", name: "Travel Insurance" },
  { id: "10", name: "Personal Expenses" },
]

interface ServiceFormData {
  includes: string[]
  excludes: string[]
}

export function IncludesSection() {
  const { setValue, formState: { errors }, register } = useFormContext<ServiceFormData>();
  
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);

  const handleIncludeChange = (name: string) => {
    setIncludes((prev) => {
      if (prev.includes(name)) {
        const newIncludes = prev.filter((item) => item !== name)
        setValue("includes", newIncludes)
        return newIncludes
      } else {
        const newIncludes = [...prev, name]
        setValue("includes", newIncludes)
        return newIncludes
      }
    })
    
    // Remove from excludes if present
    setExcludes((prev) => {
      const newExcludes = prev.filter((item) => item !== name)
      setValue("excludes", newExcludes)
      return newExcludes
    })
  }

  const handleExcludeChange = (name: string) => {
    setExcludes((prev) => {
      if (prev.includes(name)) {
        const newExcludes = prev.filter((item) => item !== name)
        setValue("excludes", newExcludes)
        return newExcludes
      } else {
        const newExcludes = [...prev, name]
        setValue("excludes", newExcludes)
        return newExcludes
      }
    })
    
    // Remove from includes if present
    setIncludes((prev) => {
      const newIncludes = prev.filter((item) => item !== name)
      setValue("includes", newIncludes)
      return newIncludes
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Servicios Incluidos y No Incluidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Included Services */}
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Servicios Incluidos
            </Label>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {initialItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`include-${item.id}`}
                    checked={includes.includes(item.name)}
                    onCheckedChange={() => handleIncludeChange(item.name)}
                  />
                  <Label 
                    htmlFor={`include-${item.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
            
            {errors.includes && (
              <p className="text-sm text-red-500">{errors.includes.message as string}</p>
            )}
          </div>

          {/* Excluded Services */}
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Servicios No Incluidos
            </Label>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {initialItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exclude-${item.id}`}
                    checked={excludes.includes(item.name)}
                    onCheckedChange={() => handleExcludeChange(item.name)}
                  />
                  <Label 
                    htmlFor={`exclude-${item.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
            
            {errors.excludes && (
              <p className="text-sm text-red-500">{errors.excludes.message as string}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        {(includes.length > 0 || excludes.length > 0) && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Resumen de Selección</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Incluidos ({includes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {includes.map((item) => (
                        <p key={item} className="text-sm">{item}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {excludes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      No Incluidos ({excludes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {excludes.map((item) => (
                        <p key={item} className="text-sm">{item}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Hidden inputs for form registration */}
        <input {...register("includes")} type="hidden" />
        <input {...register("excludes")} type="hidden" />
      </CardContent>
    </Card>
  )
} 