"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Wifi, Coffee, Utensils, Car, Dumbbell, Waves, Snowflake } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"

// Define the hotel data type
interface Hotel {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  description: string
  photos: string[]
  services: string[]
}

// Sample hotel data (simulating a database)
const hotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Velas Riviera Maya",
    location: {
      latitude: 20.6848,
      longitude: -87.0501,
      address: "Carretera Cancun Tulum Km 62, Playa del Carmen 77710, Mexico",
    },
    description:
      "Luxury all-inclusive resort with stunning ocean views, world-class spa, and gourmet dining options. Located on the pristine beaches of the Riviera Maya, this resort offers a perfect blend of natural beauty and modern luxury.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "2",
    name: "One&Only Palmilla",
    location: {
      latitude: 22.9671,
      longitude: -109.7722,
      address: "Carr. Transpeninsular Km. 7.5, San José del Cabo 23400, Mexico",
    },
    description:
      "Iconic luxury resort in Los Cabos offering spectacular views of the Sea of Cortez, private beach access, and personalized service. Each room features a private terrace and the resort boasts world-renowned restaurants.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "3",
    name: "Rosewood Mayakoba",
    location: {
      latitude: 20.7253,
      longitude: -86.9571,
      address: "Ctra. Federal Cancún-Playa del Carmen Km 298, Playa del Carmen 77710, Mexico",
    },
    description:
      "Nestled along the Riviera Maya, this luxury resort features private lagoon suites, a Greg Norman championship golf course, and a world-class spa. The resort is built around winding lagoons and pristine beaches.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "4",
    name: "Las Ventanas al Paraíso",
    location: {
      latitude: 22.9906,
      longitude: -109.8058,
      address: "Carretera Transpeninsular Km. 19.5, San José del Cabo 23400, Mexico",
    },
    description:
      "A Rosewood Resort offering unparalleled luxury and service. Features include private infinity pools, a holistic spa, and innovative cuisine. The resort's architecture blends Mexican tradition with modern elegance.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "5",
    name: "Four Seasons Mexico City",
    location: {
      latitude: 19.4241,
      longitude: -99.1769,
      address: "Paseo de la Reforma 500, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX, Mexico",
    },
    description:
      "Elegant oasis in the heart of Mexico City's financial district. Built around a lush garden courtyard, this hotel offers refined accommodations, a spa, and multiple dining options featuring both local and international cuisine.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "air-conditioning"],
  },
  {
    id: "6",
    name: "Banyan Tree Mayakoba",
    location: {
      latitude: 20.7314,
      longitude: -86.9541,
      address: "Carretera Federal Chetumal-Puerto Juárez Km. 298, Playa del Carmen 77710, Mexico",
    },
    description:
      "Asian-inspired luxury villas set within the eco-conscious Mayakoba resort complex. Each villa features a private pool and garden, while the resort offers a PGA golf course, spa treatments, and multiple dining options.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "7",
    name: "St. Regis Punta Mita",
    location: {
      latitude: 20.7737,
      longitude: -105.5337,
      address: "Lote H-4, Carretera Federal 200, km 19.5, Punta Mita 63734, Mexico",
    },
    description:
      "Luxury beachfront resort on the Riviera Nayarit featuring Mediterranean-inspired architecture, butler service, and two Jack Nicklaus Signature golf courses. The resort offers three infinity pools and a Remède Spa.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "8",
    name: "Belmond Maroma Resort & Spa",
    location: {
      latitude: 20.7128,
      longitude: -86.9778,
      address: "Carretera Cancún-Tulum Km 51, Punta Maroma, Playa del Carmen 77710, Mexico",
    },
    description:
      "Intimate luxury resort nestled between jungle and sea on one of the Riviera Maya's most pristine beaches. Features include thatched-roof accommodations, a world-class spa, and authentic Mexican cuisine.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
  {
    id: "9",
    name: "Ritz-Carlton Mexico City",
    location: {
      latitude: 19.4275,
      longitude: -99.1753,
      address: "Av. Paseo de la Reforma 509, Cuauhtémoc, 06500 Ciudad de México, CDMX, Mexico",
    },
    description:
      "Soaring 58-story luxury hotel offering panoramic views of Chapultepec Park. Features include spacious rooms with floor-to-ceiling windows, a Mediterranean-inspired restaurant, and a spa with indoor pool.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "air-conditioning"],
  },
  {
    id: "10",
    name: "Hotel Xcaret México",
    location: {
      latitude: 20.5827,
      longitude: -87.1195,
      address: "Carretera Chetumal Puerto Juárez Km 282, Playa del Carmen 77710, Mexico",
    },
    description:
      "All-inclusive eco-resort offering unlimited access to Xcaret parks. The resort features Mexican-inspired architecture, multiple swimming pools, a spa, and ten restaurants serving diverse cuisines.",
    photos: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: ["wifi", "restaurant", "pool", "spa", "gym", "parking", "beach-access", "air-conditioning"],
  },
]

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

export default function HotelInfo({ hotelProvider }) {
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
                {hotelProvider.extras.map((service) => (
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

