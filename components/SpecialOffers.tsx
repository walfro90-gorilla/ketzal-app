'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from 'lucide-react'
import { useState } from 'react'

const offers = [
  {
    name: 'Louvre Museum',
    location: 'France',
    image: 'https://picsum.photos/1200/1300',
    oldPrice: 6.53,
    newPrice: 5.88,
    discount: 10,
    reviews: 2,
    rating: 2,
    featured: true,
    link: '/tour/louvre-museum'
  },
  {
    name: 'Tour por la Riviera Maya',
    location: 'México',
    image: 'https://picsum.photos/1200/1300',
    oldPrice: 3000,
    newPrice: 2500,
    discount: 17,
    reviews: 15,
    rating: 4,
    featured: true,
    link: '/tour/riviera-maya'
  },
  {
    name: 'Escapada a Guanajuato',
    location: 'México',
    image: 'https://picsum.photos/1200/1300',
    oldPrice: 1800,
    newPrice: 1500,
    discount: 17,
    reviews: 8,
    rating: 5,
    featured: false,
    link: '/tour/guanajuato'
  },
]

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Trending Tour</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <TourCard key={offer.name} {...offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface TourCardProps {
  name: string
  location: string
  image: string
  oldPrice: number
  newPrice: number
  discount: number
  reviews: number
  rating: number
  featured: boolean
  link: string
}

const TourCard = ({
  name,
  location,
  image,
  oldPrice,
  newPrice,
  discount,
  reviews,
  rating,
  featured,
  link
}: TourCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden">
      <Link href={link}>
        <CardContent className="p-0 relative">
          {/* Discount Badge */}
          <div className="absolute left-0 top-0 z-10">
            <div className="bg-green-500 text-white px-4 py-1 rounded-br-lg">
              {discount}%
            </div>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute right-4 top-4 z-10">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
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
            className="absolute bottom-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
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
              <span>✈</span>
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
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
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
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm">
                ${oldPrice.toFixed(2)}
              </span>
              <span className="text-green-600 font-semibold">
                ${newPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default SpecialOffers

