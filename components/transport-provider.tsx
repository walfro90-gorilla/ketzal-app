"use client"

import { useState } from "react"
import { MapPin, Wifi, Car, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"


import { useServices } from "@/context/ServiceContext"

// Define the interface first
interface TransportProvider {
  id: string
  name: string
  info: string[]
  photos: string[]
  services: string[]
}




// Transport provider data with consistent structure
const transportProviders: TransportProvider[] = [
  {
    id: "ado",
    name: "ADO Plus",
    info: [
      "Premium intercity bus service",
      "Executive-class amenities",
      "Connecting major cities across Mexico",
      "Comfort and reliability guaranteed",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "etn",
    name: "ETN Turistar",
    info: [
      "Luxury bus service with spacious seating",
      "Premium amenities for long-distance travel",
      "Throughout Mexico's tourist destinations",
      "Bilingual staff available",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "primera-plus",
    name: "Primera Plus",
    info: [
      "High-quality bus service covering central Mexico",
      "Modern fleet with excellent safety standards",
      "Comfortable seating and amenities",
      "Punctual departures and arrivals",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "omnibus",
    name: "Ómnibus de México",
    info: [
      "Traditional bus service with extensive routes",
      "Connecting major cities and smaller towns",
      "Affordable transportation options",
      "Reliable schedules throughout Mexico",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "estrella-roja",
    name: "Estrella Roja",
    info: [
      "Premium bus service specializing in routes",
      "Between Mexico City, Puebla, and surrounding areas",
      "Excellent amenities and comfort",
      "Modern fleet with safety features",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "tufesa",
    name: "Tufesa",
    info: [
      "Bus service specializing in routes between Mexico",
      "And the southwestern United States",
      "Bilingual staff and border crossing assistance",
      "Comfortable long-distance travel",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "autovias",
    name: "Autovías",
    info: [
      "Regional bus service operating in central Mexico",
      "Comfortable and affordable transportation options",
      "Connecting smaller cities and towns",
      "Regular departure schedules",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "tap",
    name: "Transportes y Autobuses del Pacífico",
    info: [
      "Bus service covering Mexico's Pacific coast",
      "Scenic routes and comfortable travel options",
      "Connecting coastal cities and towns",
      "Modern fleet with amenities",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "futura",
    name: "Futura",
    info: [
      "Modern bus service with select routes",
      "Competitive pricing across northern and central Mexico",
      "Comfortable seating and amenities",
      "Reliable schedules and service",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
  {
    id: "caminante",
    name: "Caminante",
    info: [
      "Regional bus service specializing in routes",
      "To smaller towns and villages",
      "Affordable fares and reliable schedules",
      "Local expertise and knowledge",
    ],
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["WiFi", "Parking", "Charter"],
  },
]





export default function TransportProvider({transportProvider}) {



  return (
    <div className="w-full max-w-3xl mx-auto p-2">


      <Card className="overflow-hidden border rounded-sm">
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-3">
            {/* Left Column: Info and Services */}
            <div className="col-span-3 space-y-3">
              {/* Provider Name */}
              <h2 className="text-sm font-medium">{transportProvider.name}</h2>

              {/* Info Section */}
              <div>
                <h3 className="text-[10px] font-medium mb-1">Info:</h3>
                <div className="space-y-0.5">
                  {transportProvider.info.map((line, index) => (
                    <p key={index} className="text-[10px] text-muted-foreground leading-tight">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-[10px] font-medium mb-1">Services:</h3>
                <div className="flex gap-2">
                  {transportProvider.extras.map((service) => (
                    <div key={service} className="flex items-center gap-0.5">
                      {service === "WiFi" && <Wifi className="h-3 w-3" />}
                      {service === "Parking" && <Car className="h-3 w-3" />}
                      {service === "Charter" && <MapPin className="h-3 w-3" />}
                      <span className="text-[8px]">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Photos */}
            <div className="col-span-2">
              <div className="text-[10px] font-medium mb-1 text-center">Carousel Photos</div>
              <Carousel className="w-full">
                <CarouselContent>
                  {transportProvider.photos.map((photo, index) => (
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

