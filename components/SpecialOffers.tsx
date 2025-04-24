'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from 'lucide-react'
import { useState } from 'react'
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import Loader from '@/components/Loader'
import { useLoading } from '@/components/LoadingContext'



interface SpecialOffersProps {
  services: any[]
}

const SpecialOffers = ({ services }: SpecialOffersProps) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 8 },
      },
    },
    created(slider) {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 3000);
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  });
  return (
    <section className="py-16 bg-gray-100 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Trending Tour</h2>
        <div ref={sliderRef} className="keen-slider">
          {services?.length > 0 && services.map((service: any) => (
            <div className="keen-slider__slide" key={service.name}>
              <TourCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface TourCardProps {
  name: string
  location: string
  images: { imgAlbum: Array<string>, imgBanner: string }
  availableFrom: string
  availableTo: string
  createdAt: string
  description: string
  id: string
  packs: { data: Array<{ description: string, name: string, price: number, qty: number }> }
  price: number
  supplierId: string
}

const TourCard = ({
  name,
  location,
  images,
  availableFrom,
  availableTo,
  createdAt,
  description,
  id,
  packs,
  price,
  supplierId
}: TourCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const { setLoading } = useLoading()
  const handleClick = () => {
    setLoading(true)
  }
  return (
    <Card className="group overflow-hidden bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
      <Link href={`/tours/${id}`} onClick={handleClick}>
        <CardContent className="p-0 relative">
          {/* Discount Badge */}
          <div className="absolute left-0 top-0 z-10">
            <div className="bg-green-500 text-white px-4 py-1 rounded-br-lg">
              {price}%
            </div>
          </div>

          {/* Featured Badge */}
          {price && (
            <div className="absolute right-4 top-4 z-10">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Featured
              </div>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={images.imgBanner}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute bottom-4 right-4 z-10 bg-white dark:bg-zinc-700 rounded-full p-2 shadow-lg transition-transform hover:scale-110"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500 dark:stroke-gray-300'}`}
            />
          </button>

          {/* Content */}
          <div className="p-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2">
              <span>✈</span>
              {location}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < price ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500 line-through text-sm">
                ${price.toFixed(2)}
              </span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default SpecialOffers

