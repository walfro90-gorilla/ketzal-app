'use client';

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const testimonials = [
  { name: 'María González', image: 'https://picsum.photos/1200/1300', text: 'Increíble experiencia en Cancún. El servicio fue excelente y las playas son hermosas.' },
  { name: 'Juan Pérez', image: 'https://picsum.photos/1200/1300', text: 'El tour por la Ciudad de México superó mis expectativas. Muy recomendado.' },
  { name: 'Ana Rodríguez', image: 'https://picsum.photos/1200/1300', text: 'La escapada a Guanajuato fue mágica. Definitivamente volveré a reservar con ustedes.' },
]

const Testimonials = () => {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Lo que dicen nuestros clientes</h2>
        <div className="flex justify-center">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <h3 className="ml-4 text-lg font-semibold">{testimonials[current].name}</h3>
              </div>
              <p className="text-gray-600">{testimonials[current].text}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${current === idx ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

