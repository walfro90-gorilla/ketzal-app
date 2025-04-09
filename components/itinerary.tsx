"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin } from "lucide-react"

type ItineraryItem = {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
}

// const itineraryData: ItineraryItem[] = [
//   {
//     id: 1739902881667,
//     date: "2025-02-21",
//     time: "13:00",
//     location: "Villahumada",
//     description: "llegamos a comer",
//   },
//   {
//     id: 1739902848001,
//     date: "2025-02-21",
//     time: "22:00",
//     location: "Cd Juarez",
//     description: "salidmos rumbo a nuestro destino",
//   },
//   {
//     id: 1739902899883,
//     date: "2025-02-28",
//     time: "15:00",
//     location: "CDMX",
//     description: "llegamos anmnuiestro destino",
//   },
// ]

export default function Itinerary({ itineraryData }: { itineraryData: ItineraryItem[] }) {

  const sortedData = [...itineraryData].sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date)
    if (dateComparison !== 0) return dateComparison
    return a.time.localeCompare(b.time)
  })

  const groupedData = sortedData.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = []
      }
      acc[item.date].push(item)
      return acc
    },
    {} as Record<string, ItineraryItem[]>,
  )

  return (
    <Card className="w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">

      <CardContent className="p-2 sm:p-4">
        <ScrollArea className="h-[60vh] sm:h-[70vh] pr-2 sm:pr-4">
          {Object.entries(groupedData).map(([date, items]) => (
            <div key={date} className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                {new Date(date).toLocaleDateString("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {items.map((item) => (
                <Card key={item.id} className="mb-3 sm:mb-4">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium ml-2">{item.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

