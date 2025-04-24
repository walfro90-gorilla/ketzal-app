import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from 'lucide-react'
import Itinerary from "./itinerary"

interface TourLocationProps {
  itinerary: {
    id: string
    title: string
    description: string
    time: string
    location: string
    date: string
  }[]
  location: {
    title: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  included: string[]
  excluded: string[]
}

export function TourLocation({ itinerary, location, included, excluded }: TourLocationProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=10`


  console.log("itinerary: ", itinerary)
  return (
    <Card className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Itinerario 🗺️</CardTitle>
      </CardHeader>
      <div className="aspect-[4/3] w-full relative">
        <Itinerary itineraryData={itinerary} />
      </div>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Que incluye tu tour?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="space-y-2">
            {included.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-gray-900 dark:text-gray-100">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {excluded.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-gray-900 dark:text-gray-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

