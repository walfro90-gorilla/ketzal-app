'use client'

import { Clock, Users, MapPin, Building2 } from 'lucide-react'

interface TourHeaderProps {
  duration: string
  tourType: string
  groupSize: string
  location: string
  rating: number
  reviewCount: number
  title: string
  bannerImage: string
}

export function TourHeader({
  duration,
  tourType,
  groupSize,
  location,
  rating,
  reviewCount,
  title,
  bannerImage,
}: TourHeaderProps) {


  return (


    <div className="relative w-full">
      {/* Banner Section */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-4 container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        </div>
      </div>

      {/* Info Section */}
      <div className="relative w-full bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 shrink-0 text-white" />
              <div>
                <div className="text-sm font-medium text-white/90">Duracion</div>
                <div className="text-white">{duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 shrink-0 text-white" />
              <div>
                <div className="text-sm font-medium text-white/90">Tipo</div>
                <div className="text-white">{tourType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 shrink-0 text-white" />
              <div>
                <div className="text-sm font-medium text-white/90">Tamaño</div>
                <div className="text-white">{groupSize}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 shrink-0 text-white" />
              <div>
                <div className="text-sm font-medium text-white/90">Lugar</div>
                <div className="text-white">{location}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 bg-blue-600 px-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{rating}</div>
            <div className="text-sm">/5</div>
            <div className="text-sm whitespace-nowrap">{reviewCount} Review</div>
          </div>
        </div>
      </div>
    </div>
  )
}

