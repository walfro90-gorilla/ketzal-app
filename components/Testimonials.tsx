'use client';

// import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Avatar } from 'antd';
import { Rate } from 'antd';

type Review = {
  userId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
};

type User = {
  id: string;
  image: string;
  name: string;
};

interface TestimonialsProps {
  reviews: Review[];
  users: User[];
}

const Testimonials = ({reviews, users}: TestimonialsProps) => {
  const [current, setCurrent] = useState(0)
  
  // Asegurar que current esté dentro del rango válido
  useEffect(() => {
    if (reviews && reviews.length > 0 && current >= reviews.length) {
      setCurrent(0);
    }
  }, [reviews, current]);
  
  useEffect(() => {
    // Solo configurar el intervalo si hay reviews
    if (!reviews || reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [reviews])

  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Lo que dicen nuestros clientes</h2>
        
        {/* Verificar si hay reviews disponibles */}
        {!reviews || reviews.length === 0 ? (
          <div className="w-full flex justify-center">
            <Card className="w-4/5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <CardContent className="p-6 w-full flex flex-col items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  No hay testimonios disponibles en este momento.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center">
              <Card className="w-4/5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <CardContent className="p-6 w-full flex flex-col items-center justify-center">
                  {/* Verificar que el review actual existe */}
                  {reviews[current] && (
                    <>
                      <div className="flex flex-col items-center mb-4">
                        <Avatar
                          src={users.find(user => user.id === reviews[current].userId)?.image || '/default-avatar.png'}
                          alt={users.find(user => user.id === reviews[current].userId)?.name || 'Avatar de usuario'}
                          size={50}
                        />
                        <h3 className="mt-2 text-gray-900 dark:text-gray-100">
                          {users.find(user => user.id === reviews[current].userId)?.name || 'Usuario desconocido'}
                        </h3>
                        <Rate disabled value={reviews[current].rating || 0} />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-center">
                        {reviews[current].comment || 'Sin comentario'}
                      </p>
                      <small className="text-gray-400 dark:text-gray-400 mt-2">
                        {reviews[current].createdAt ? new Date(reviews[current].createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }) : 'Fecha no disponible'}
                      </small>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${current === idx ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Testimonials

