'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054726/if2mczlahxvuce1fiili.png',
    title: 'Tours & Viajes',
    subtitle: 'Agenda tu próxima aventura con nosotros',
  },
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054794/kf4ebaedkpzoxq7zlci3.png',
    title: 'Las Mejores Playas',
    subtitle: 'Descubre el Paraíso en la Tierra',
   
  },
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054798/rarnxbktkbcxillzavwg.png',
    title: 'Reconecta con la Naturaleza',
    subtitle: 'Explora los paisajes más hermosos del mundo',
  
  }
]

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000) // Auto advance every 5 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Image */}
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-12">
              <div className="max-w-4xl">
                <h1 
                  className={`text-5xl md:text-7xl font-bold text-white mb-4 transform transition-all duration-1000 delay-300
                    ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-xl md:text-2xl text-white mb-8 transform transition-all duration-1000 delay-500
                    ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-2 border-white/50 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center group"
      >
        <ChevronLeft className="h-8 w-8 text-white opacity-50 group-hover:opacity-100" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-2 border-white/50 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center group"
      >
        <ChevronRight className="h-8 w-8 text-white opacity-50 group-hover:opacity-100" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection

