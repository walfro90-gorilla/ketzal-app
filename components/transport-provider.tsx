"use client"

import { MapPin, Wifi, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"



// Define the interface first
interface TransportProvider {
  id: string
  name: string
  info: string[]
  photos: string[]
  services: string[]
}






interface TransportProviderProps {
  transportProvider: TransportProvider;
}

export default function TransportProvider({ transportProvider }: TransportProviderProps) {



  return (
    <div className="w-full max-w-3xl mx-auto p-2">
      <Card className="overflow-hidden border rounded-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-3">
            {/* Left Column: Info and Services */}
            <div className="col-span-3 space-y-3">
              {/* Provider Name */}
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{transportProvider.name}</h2>

              {/* Info Section */}
              <div>
                <h3 className="text-[10px] font-medium mb-1 text-gray-900 dark:text-gray-100">Info:</h3>
                <div className="space-y-0.5">
                  {(transportProvider.info || []).map((line, index) => (
                    <p key={index} className="text-[10px] text-gray-700 dark:text-gray-300 leading-tight">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-[10px] font-medium mb-1 text-gray-900 dark:text-gray-100">Services:</h3>
                <div className="flex gap-2">
                  {(transportProvider.services || []).map((service) => (
                    <div key={service} className="flex items-center gap-0.5">
                      {service === "WiFi" && <Wifi className="h-3 w-3 text-gray-700 dark:text-gray-300" />}
                      {service === "Parking" && <Car className="h-3 w-3 text-gray-700 dark:text-gray-300" />}
                      {service === "Charter" && <MapPin className="h-3 w-3 text-gray-700 dark:text-gray-300" />}
                      <span className="text-[8px] text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Photos */}
            <div className="col-span-2">
              <div className="text-[10px] font-medium mb-1 text-center text-gray-900 dark:text-gray-100">Carousel Photos</div>
              <Carousel className="w-full">
                <CarouselContent>
                  {(transportProvider.photos || []).map((photo, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`${transportProvider.name} vehicle ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-sm"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 h-6 w-6" />
                <CarouselNext className="right-1 h-6 w-6" />
              </Carousel>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

