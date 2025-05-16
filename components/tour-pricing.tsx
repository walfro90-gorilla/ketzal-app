"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TourPricingProps {
  packs?: { name: string; price: number; qty: number }[],
  availableFrom: string,
  availableTo: string | null,
  price: number
  originalPrice?: number
  discount?: number
}

export function TourPricing({ packs, availableFrom, availableTo, originalPrice, discount = 10 }: TourPricingProps) {
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [selectedPacks] = useState<{ name: string; price: number; qty: number }[]>([]);

 

  return (
    <Card className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
      <div className="relative bg-blue-600 dark:bg-zinc-700 p-4 text-white dark:text-gray-100">
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
            <span className="text-gray-200 dark:text-gray-400 line-through text-sm">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-gray-100">Haz tu reservas aqui 👇🏻</h3>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span className="text-gray-900 dark:text-gray-100">Desde :
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
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span className="text-gray-900 dark:text-gray-100">Hasta :
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
              <label className="text-sm text-gray-600 dark:text-gray-300">Paquetes:</label>

              <select
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600"
                value={selectedPack}
                onChange={(e) => setSelectedPack(e.target.value)}
              >
                <option value="" disabled>Selecccione paquete</option>
                {packs?.map((pack, index) => (
                  <option key={index} value={pack.name} className="bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100">
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
              <Button className="mt-2">Agregar</Button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-base mb-2 text-gray-900 dark:text-gray-100">Paquetes seleccionados:</h4>
            <ul className="list-disc list-inside">
              {selectedPacks.map((pack, index) => (
                <li key={index} className="text-gray-900 dark:text-gray-100">
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

          <div className="pt-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-300">Total:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
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
            <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800">
              Reservar Ahora
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

