'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from 'lucide-react'
import { useState } from 'react'

const destinations = [
  { 
    name: 'Cancún', 
    location: 'México',
    image: 'https://picsum.photos/1200/1300', 
    price: 1500, 
    rating: 4.8, 
    reviews: 120,
    link: '/destination/cancun',
    featured: true
  },
  { 
    name: 'Ciudad de México', 
    location: 'México',
    image: 'https://picsum.photos/1200/1300', 
    price: 800, 
    rating: 4.6, 
    reviews: 95,
    link: '/destination/mexico-city',
    featured: false
  },
  { 
    name: 'Los Cabos', 
    location: 'México',
    image: 'https://picsum.photos/1200/1300', 
    price: 2000, 
    rating: 4.9, 
    reviews: 150,
    link: '/destination/los-cabos',
    featured: true
  },
  { 
    name: 'Oaxaca', 
    location: 'México',
    image: 'https://picsum.photos/1200/1300', 
    price: 1200, 
    rating: 4.7, 
    reviews: 80,
    link: '/destination/oaxaca',
    featured: false
  },
]

const PopularDestinations = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.name} {...destination} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface DestinationCardProps {
  name: string
  location: string
  image: string
  price: number
  rating: number
  reviews: number
  link: string
  featured: boolean
}

const DestinationCard = ({
  name,
  location,
  image,
  price,
  rating,
  reviews,
  link,
  featured
}: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden">
      <Link href={link}>
        <CardContent className="p-0 relative">
          {/* Featured Badge */}
          {featured && (
            <div className="absolute left-4 top-4 z-10">
              <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'
              }`}
            />
          </button>

          {/* Content */}
          <div className="p-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <MapPin className="h-4 w-4" />
              {location}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">{name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {reviews} {reviews === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold">
                ${price.toFixed(2)}
              </span>
              <Button size="sm">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default PopularDestinations

