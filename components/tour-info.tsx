import { Star, Clock, Users, Globe, Thermometer, Calendar } from 'lucide-react'

interface TourInfoProps {
  tour: {
    availableFrom: string
    availableTo: string
    fromCity: string
    toCity: string
    description: string
    duration: string
    groupSize: string
    language: string
    rating: number
    reviewCount: number
    localInfo: {
      climate: string
      bestTimeToVisit: string
    }
  }
}

export function TourInfo({ tour }: TourInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`mr-1 ${index < tour.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill='yellow'
          />
        ))}
        <span className="font-bold mr-2">{tour.rating}</span>
        <span className="text-gray-600">({tour.reviewCount} reviews)</span>
      </div>
      <p className="text-gray-700 mb-6">{tour.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <span>{tour.duration}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-2" />
          <span>{tour.groupSize}</span>
        </div>
        <div className="flex items-center">
          <Globe className="mr-2" />
          <span>{tour.fromCity} to {tour.toCity} </span>
        </div>
        <div className="flex items-center">
          <Thermometer className="mr-2" />
          <span>{tour.localInfo.climate}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2" />
          <span>
            {
              new Date(tour.availableFrom).toLocaleDateString("es", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
            }
            -
            {
              new Date(tour.availableTo).toLocaleDateString("es", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
            }
          </span>
        </div>
      </div>
    </div>
  )
}

