"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle } from "lucide-react"
import { ServiceFormData } from "../../validations/service-form.validation"

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

export function IncludesSection() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ServiceFormData>();
  
  const includes = watch("includes") || [];
  const excludes = watch("excludes") || [];

  const handleCheckboxChange = (list: string[], setList: (value: string[]) => void, otherList: string[], setOtherList: (value: string[]) => void, item: string) => {
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setList(newList);

    // Ensure item is not in the other list
    if (otherList.includes(item)) {
      setOtherList(otherList.filter(i => i !== item));
    }
  };

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
                  <Controller
                    name="includes"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`include-${item.id}`}
                        checked={field.value?.includes(item.name)}
                        onCheckedChange={() => handleCheckboxChange(includes, (v) => setValue("includes", v), excludes, (v) => setValue("excludes", v), item.name)}
                      />
                    )}
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
                  <Controller
                    name="excludes"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`exclude-${item.id}`}
                        checked={field.value?.includes(item.name)}
                        onCheckedChange={() => handleCheckboxChange(excludes, (v) => setValue("excludes", v), includes, (v) => setValue("includes", v), item.name)}
                      />
                    )}
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
      </CardContent>
    </Card>
  )
}
