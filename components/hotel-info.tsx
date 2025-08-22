"use client"

import type React from "react"

import { MapPin, Wifi, Coffee, Utensils, Car, Dumbbell, Waves, Snowflake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"

// Define the hotel data type
// interface Hotel {
//   id: string
//   name: string
//   location: {
//     latitude: number
//     longitude: number
//     address: string
//   }
//   description: string
//   photos: string[]
//   services: string[]
// }

// Service icon mapping
const serviceIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-3 w-3" />,
  restaurant: <Utensils className="h-3 w-3" />,
  pool: <Waves className="h-3 w-3" />,
  parking: <Car className="h-3 w-3" />,
  gym: <Dumbbell className="h-3 w-3" />,
  "air-conditioning": <Snowflake className="h-3 w-3" />,
  "beach-access": <Waves className="h-3 w-3" />,
  spa: <Coffee className="h-3 w-3" />,
}

interface HotelProvider {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  photos: string[];
  extras: string[];
}

export default function HotelInfo({ hotelProvider }: { hotelProvider: HotelProvider }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 text-gray-900 dark:text-gray-100">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Left column - Description and Photos */}
            <div className="md:col-span-3 p-3 border-r">
              <h2 className="text-lg font-bold mb-2">{hotelProvider.name}</h2>
              <div className="text-xs flex items-center gap-1 text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                {hotelProvider.location.address}
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-1">Description</h3>
                <p className="text-xs text-muted-foreground line-clamp-4">{hotelProvider.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.isArray(hotelProvider.extras) && hotelProvider.extras.map((service) => (
                  <Badge key={service} variant="outline" className="flex items-center gap-1 px-2 py-0 text-[10px]">
                    {serviceIcons[service]}
                    <span className="capitalize">{service.replace("-", " ")}</span>
                  </Badge>
                ))}
              </div>
              <div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {hotelProvider.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="overflow-hidden rounded">
                          <Image
                            src={photo || "/placeholder.svg"}
                            alt={`${hotelProvider.name} - Photo ${index + 1}`}
                            width={600}
                            height={400}
                            className="w-full object-cover h-[150px]"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="h-6 w-6 -left-3" />
                  <CarouselNext className="h-6 w-6 -right-3" />
                </Carousel>
              </div>
            </div>
            {/* Right column - Map */}
            <div className="md:col-span-2 p-0">
              <div className="h-full min-h-[250px] relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${hotelProvider.location.latitude},${hotelProvider.location.longitude}&zoom=15`}
                ></iframe>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}

