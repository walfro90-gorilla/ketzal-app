"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Package, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface ServicePackage {
  name: string
  description: string
  qty: number
  price: number
}

interface ServiceFormData {
  packs: {
    data: ServicePackage[]
  }
}

export function PackagesSection() {
  const { setValue, formState: { errors }, register } = useFormContext<ServiceFormData>();
  
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [currentPackage, setCurrentPackage] = useState<ServicePackage>({
    name: "",
    description: "",
    qty: 0,
    price: 0
  });

  const handleAddPackage = () => {
    if (currentPackage.name && currentPackage.description && currentPackage.qty > 0 && currentPackage.price > 0) {
      const newPackages = [...packages, { ...currentPackage }]
      setPackages(newPackages)
      setValue("packs", { data: newPackages })
      
      // Reset form
      setCurrentPackage({
        name: "",
        description: "",
        qty: 0,
        price: 0
      })
    }
  }

  const handleDeletePackage = (index: number) => {
    const newPackages = packages.filter((_, i) => i !== index)
    setPackages(newPackages)
    setValue("packs", { data: newPackages })
  }

  const handleInputChange = (field: keyof ServicePackage, value: string | number) => {
    setCurrentPackage(prev => ({
      ...prev,
      [field]: field === 'qty' || field === 'price' ? Number(value) : value
    }))
  }

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
                value={currentPackage.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Básico, Premium, VIP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageDescription">Descripción</Label>
              <Input
                id="packageDescription"
                value={currentPackage.description}
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
                value={currentPackage.qty || ""}
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
                value={currentPackage.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Precio del paquete"
              />
            </div>
          </div>

          <Button 
            type="button" 
            onClick={handleAddPackage}
            disabled={!currentPackage.name || !currentPackage.description || currentPackage.qty <= 0 || currentPackage.price <= 0}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Paquete
          </Button>
        </div>

        {/* Packages List */}
        {packages.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Paquetes Configurados</Label>
            
            <div className="space-y-3">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{pkg.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.description}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Cantidad: {pkg.qty}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Precio: ${pkg.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePackage(index)}
                    className="text-red-500 hover:text-red-700"
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

        {/* Hidden input for form registration */}
        <input {...register("packs")} type="hidden" />
      </CardContent>
    </Card>
  )
} 