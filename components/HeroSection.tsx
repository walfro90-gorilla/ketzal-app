'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import { ChevronLeft, ChevronRight, ShoppingBag, Calendar, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054726/if2mczlahxvuce1fiili.png',
    title: 'Tours & Viajes',
    subtitle: 'Agenda tu próxima aventura con nosotros',
  },
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054798/rarnxbktkbcxillzavwg.png',
    title: 'Las Mejores Playas',
    subtitle: 'Descubre el Paraíso en la Tierra',
   
  },
  {
    image: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v1745054794/kf4ebaedkpzoxq7zlci3.png',
    title: 'Reconecta con la Naturaleza',
    subtitle: 'Explora los paisajes más hermosos del mundo',
  
  }
]

// Función para generar URLs optimizadas para diferentes dispositivos
const getOptimizedImageUrl = (baseUrl: string, isMobile: boolean = false) => {
  const cloudinaryBase = 'https://res.cloudinary.com/dgmmzh8nb/image/upload/'
  const imageId = baseUrl.split('/').pop()
  
  if (isMobile) {
    // Para móviles: menor resolución, orientación vertical optimizada
    return `${cloudinaryBase}c_fill,w_768,h_1024,q_auto,f_auto,dpr_auto/${imageId}`
  } else {
    // Para escritorio: alta resolución, orientación horizontal
    return `${cloudinaryBase}c_fill,w_1920,h_1080,q_auto,f_auto,dpr_auto/${imageId}`
  }
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Distancia mínima para considerar un swipe
  const minSwipeDistance = 50

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Manejo de gestos táctiles
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000) // Auto advance every 5 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="relative h-screen w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
              <OptimizedImage
                src={getOptimizedImageUrl(slide?.image ? slide.image : '/placeholder.svg', isMobile)}
                alt={slide.title}
                aspectRatio="auto"
                sizes={isMobile ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'}
                className="object-cover h-full w-full"
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-4xl">
                <h1 
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-4 transform transition-all duration-1000 delay-300 leading-tight
                    ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-sm sm:text-base md:text-xl lg:text-2xl text-white mb-4 sm:mb-6 md:mb-8 transform transition-all duration-1000 delay-500 leading-relaxed
                    ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {slide.subtitle}
                </p>
                
                {/* Action Buttons */}
                <div 
                  className={`flex flex-wrap gap-3 sm:gap-4 transform transition-all duration-1000 delay-700
                    ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <Link href="/tours">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                      <Calendar className="h-4 w-4 mr-2" />
                      Explorar Tours
                    </Button>
                  </Link>
                  <Link href="/store">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Visitar Tienda
                    </Button>
                  </Link>
                  <Link href="/planners">
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                      <Compass className="h-4 w-4 mr-2" />
                      Crear Planner
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border-2 border-white/50 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center group backdrop-blur-sm"
        aria-label="Anterior imagen"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white opacity-50 group-hover:opacity-100" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border-2 border-white/50 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center group backdrop-blur-sm"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white opacity-50 group-hover:opacity-100" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-6 sm:w-8 bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection

