"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import AddToPlannerButton from "@/components/travel-planner/AddToPlannerButton";
import AddToPlannerButtonWithSeats from "@/components/travel-planner/AddToPlannerButtonWithSeats";
import { Bus, Users, Star } from "lucide-react";

interface TourPricingProps {
  packs?: { name: string; price: number; qty: number }[],
  availableFrom: string,
  availableTo: string | null,
  price: number,
  originalPrice?: number,
  discount?: number,
  title?: string,
  idService?: string,
  bannerImage?: string,
  // Nuevas props para selector de asientos
  hasBusTransport?: boolean,
  tourType?: string,
  location?: string,
  description?: string,
  organizer?: {
    name: string,
    logo?: string
  }
}

export function TourPricingWithSeats({ 
  packs, 
  availableFrom, 
  availableTo, 
  originalPrice, 
  title, 
  idService, 
  bannerImage, 
  discount = 10,
  hasBusTransport = false,
  tourType: _tourType = "tour", // eslint-disable-line @typescript-eslint/no-unused-vars
  location = "",
  description = "",
  organizer
}: TourPricingProps) {
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [selectedPacks] = useState<{ name: string; price: number; qty: number }[]>([]);
  const [passengerCount, setPassengerCount] = useState(1);

  const { addToCart, items } = useCart();

  // Determinar si el tour incluye transporte en bus
  const shouldShowSeatSelector = hasBusTransport || 
    title?.toLowerCase().includes('tour') ||
    description?.toLowerCase().includes('bus') ||
    description?.toLowerCase().includes('transporte');

  const handleAddPack = () => {
    const selectedPackData = packs?.find(pack => pack.name === selectedPack);
    if (!selectedPackData || !idService || !title) return;

    addToCart({
      id: `${idService}_${selectedPackData.name}`,
      serviceId: idService,
      serviceName: title,
      packageType: selectedPackData.name,
      packageDescription: `Paquete ${selectedPackData.name}`,
      price: selectedPackData.price,
      quantity: 1,
      availableQty: selectedPackData.qty,
      imgBanner: bannerImage,
    });
    setSelectedPack("");

    console.log("Adding to cart with bannerImage:", bannerImage);
    console.log("Items in cart:", items);
  }

  const selectedPackData = packs?.find(pack => pack.name === selectedPack);
  const totalPrice = selectedPacks.reduce((total, pack) => total + pack.price, 0);

  return (
    <Card className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
      <div className="relative bg-blue-600 dark:bg-zinc-700 p-4 text-white dark:text-gray-100">
        {discount && (
          <div className="absolute -right-1 -top-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        {/* Indicador de transporte incluido */}
        {shouldShowSeatSelector && (
          <div className="absolute -left-1 -top-1">
            <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
              <Bus className="w-3 h-3 mr-1" />
              ¡Nuevo! Elige tu asiento
            </Badge>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold">
            {totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          {originalPrice && (
            <span className="text-gray-200 dark:text-gray-400 line-through text-sm">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-gray-100">
              Haz tu reserva aquí 👇🏻
            </h3>

            <div className="space-y-1 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span className="text-gray-900 dark:text-gray-100">
                  Desde: {new Date(availableFrom).toLocaleDateString("es", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span className="text-gray-900 dark:text-gray-100">
                  Hasta: {availableTo ? new Date(availableTo).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }) : "No end date"}
                </span>
              </div>
              
              {shouldShowSeatSelector && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Bus className="w-4 h-4" />
                  <span className="font-medium">Incluye transporte en bus premium</span>
                </div>
              )}
            </div>

            {/* Selección de paquete */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
                  Paquetes disponibles:
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedPack}
                  onChange={(e) => setSelectedPack(e.target.value)}
                >
                  <option value="" disabled>Seleccione un paquete</option>
                  {packs?.map((pack, index) => (
                    <option key={index} value={pack.name}>
                      {pack.name} - {pack.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ({pack.qty} disponibles)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de número de pasajeros */}
              {selectedPack && shouldShowSeatSelector && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
                    Número de pasajeros:
                  </label>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <select
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                    >
                      {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'pasajero' : 'pasajeros'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Botón tradicional para agregar paquete al carrito */}
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700" 
                onClick={handleAddPack}
                disabled={!selectedPack}
              >
                Agregar al Carrito
              </Button>
            </div>
          </div>

          {/* Lista de paquetes seleccionados */}
          {selectedPacks.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-base mb-2 text-gray-900 dark:text-gray-100">
                Paquetes seleccionados:
              </h4>
              <ul className="list-disc list-inside">
                {selectedPacks.map((pack, index) => (
                  <li key={index} className="text-gray-900 dark:text-gray-100">
                    {pack.name} - {pack.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sección de reserva con selector de asientos */}
          {selectedPack && (
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600 dark:text-gray-300">Precio base:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedPackData?.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {shouldShowSeatSelector && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      ¡Experiencia Premium!
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Selecciona tus asientos preferidos en nuestro bus de lujo. 
                    Asientos frontales (+$25) y con mesa (+$15) disponibles.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {/* Botón con selector de asientos o botón tradicional */}
                {shouldShowSeatSelector ? (
                  <AddToPlannerButtonWithSeats
                    serviceId={idService || ""}
                    serviceName={title || ""}
                    price={selectedPackData?.price || 0}
                    imgBanner={bannerImage}
                    packageType={selectedPack}
                    packageDescription={`Paquete ${selectedPack} - ${description}`}
                    type="tour"
                    availableFrom={availableFrom}
                    availableTo={availableTo}
                    location={location}
                    description={description}
                    enableSeatSelection={true}
                    passengerCount={passengerCount}
                    tourInfo={{
                      route: {
                        origin: location.split(' - ')[0] || location,
                        destination: location.split(' - ')[1] || "Destino"
                      },
                      operator: {
                        name: organizer?.name || "Ketzal Tours",
                        logo: organizer?.logo
                      }
                    }}
                  />
                ) : (
                  <AddToPlannerButton 
                    serviceId={idService || ""}
                    serviceName={title || ""}
                    price={selectedPackData?.price || 0}
                    imgBanner={bannerImage}
                    packageType={selectedPack}
                    packageDescription={`Paquete ${selectedPack}`}
                    type="tour"
                    availableFrom={availableFrom}
                    availableTo={availableTo}
                    location={location}
                    description={description}
                  />
                )}

                {/* Botón de reserva rápida */}
                <Button
                  className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={handleAddPack}
                  disabled={!selectedPack}
                >
                  Reservar Ahora - {selectedPackData?.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
