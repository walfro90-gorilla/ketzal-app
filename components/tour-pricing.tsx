"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TourPricingProps {
  packs?: any[],
  availableFrom: string,
  availableTo: string | null,
  price: number
  originalPrice?: number
  discount?: number
}

export function TourPricing({ packs, availableFrom, availableTo, price, originalPrice, discount = 10 }: TourPricingProps) {
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [selectedPacks, setSelectedPacks] = useState<any[]>([]);

  const handleAddPack = () => {
    const pack = packs?.find(p => p.name === selectedPack);
    if (pack) {
      setSelectedPacks([...selectedPacks, pack]);
    }
  };

  return (
    <Card className="w-full">
      <div className="relative bg-blue-600 p-4 text-white">
        {discount && (
          <div className="absolute -right-1 -top-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {
              selectedPacks.reduce((total, pack) => total + pack.price, 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }
          </span>

          {originalPrice && (
            <span className="text-gray-200 line-through text-sm">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base mb-3">Haz tu reservas aqui 👇🏻</h3>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">•</span>
                <span>Desde :
                  {
                    new Date(availableFrom).toLocaleDateString("es", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">•</span>
                <span>Hasta :
                  {
                    availableTo ? new Date(availableTo).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }) : "No end date"
                  }
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Paquetes:</label>

              <select
                className="w-full px-3 py-1.5 text-sm border rounded-md"
                value={selectedPack}
                onChange={(e) => setSelectedPack(e.target.value)}
              >
                <option value="" disabled>Selecccione paquete</option>
                {packs?.map((pack, index) => (
                  <option key={index} value={pack.name}>
                    {pack.name} - {pack.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    } ({pack.qty} available)
                  </option>
                ))}
              </select>
              <Button className="mt-2" onClick={handleAddPack}>Agregar</Button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-base mb-2">Paquetes seleccionados:</h4>
            <ul className="list-disc list-inside">
              {selectedPacks.map((pack, index) => (
                <li key={index}>
                  {pack.name} - {pack.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  }
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">


                {
                  selectedPacks.reduce((total, pack) => total + pack.price, 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }



              </span>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Reservar Ahora
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

