'use client'

import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import React, { useEffect, useState } from 'react'

import { fetchKetzalTours } from '@/lib/supabase/services-api'

import type { ServiceData } from './(protected)/services/services.api'
import type { Review, User } from '@/types/review'
import type { Category } from './(public)/categories/categories.api'

// ponytail: services <- Supabase (ketzal.services). Reviews/users/categories
// se stubean a [] hasta migrarlos a Supabase. Asi evitamos fetches al backend
// Railway muerto (CORS + 404 ruidosos en consola).
export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ServiceData[]>([])
  const [reviews] = useState<Review[]>([])
  const [users] = useState<User[]>([])
  const [categories] = useState<Category[]>([])

  useEffect(() => {
    fetchKetzalTours()
      .then((s) => setServices(s as unknown as ServiceData[]))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <PopularCategories services={services} categories={categories} />
        <SpecialOffers services={services as unknown as Parameters<typeof SpecialOffers>[0]['services']} />
        <Testimonials reviews={reviews} users={users} />
      </main>
      <Footer />
    </div>
  )
}
