"use client"

import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Package, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { ServiceFormData } from "../../validations/service-form.validation"

export function PackagesSection() {
  const { control, register, formState: { errors } } = useFormContext<ServiceFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "packs",
  });

  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    qty: 1,
    price: 0,
  });

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.description && newPackage.qty > 0 && newPackage.price > 0) {
      append(newPackage);
      setNewPackage({ name: "", description: "", qty: 1, price: 0 });
    }
  };

  const handleInputChange = (field: keyof typeof newPackage, value: string | number) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: field === 'qty' || field === 'price' ? Number(value) : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Paquetes del Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Package Form */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Agregar Nuevo Paquete</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageName">Nombre del Paquete</Label>
              <Input
                id="packageName"
                value={newPackage.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Básico, Premium, VIP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageDescription">Descripción</Label>
              <Input
                id="packageDescription"
                value={newPackage.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descripción del paquete"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageQty">Cantidad</Label>
              <Input
                id="packageQty"
                type="number"
                min="1"
                value={newPackage.qty}
                onChange={(e) => handleInputChange("qty", e.target.value)}
                placeholder="Cantidad disponible"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packagePrice">Precio</Label>
              <Input
                id="packagePrice"
                type="number"
                min="0"
                step="0.01"
                value={newPackage.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Precio del paquete"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddPackage}
            disabled={!newPackage.name || !newPackage.description || newPackage.qty <= 0 || newPackage.price <= 0}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Paquete
          </Button>
        </div>

        {/* Packages List */}
        {fields.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Paquetes Configurados</Label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                    <Input {...register(`packs.${index}.name`)} placeholder="Nombre" className="col-span-1" />
                    <Input {...register(`packs.${index}.description`)} placeholder="Descripción" className="col-span-1" />
                    <Controller
                      control={control}
                      name={`packs.${index}.qty`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="number"
                          onBlur={onBlur}
                          onChange={e => onChange(parseInt(e.target.value, 10))}
                          value={value}
                          placeholder="Cantidad"
                          className="col-span-1"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`packs.${index}.price`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          type="number"
                          onBlur={onBlur}
                          onChange={e => onChange(parseFloat(e.target.value))}
                          value={value}
                          placeholder="Precio"
                          className="col-span-1"
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.packs && (
          <p className="text-sm text-red-500">{errors.packs.message as string}</p>
        )}
      </CardContent>
    </Card>
  )
}
