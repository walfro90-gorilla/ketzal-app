'use client'

import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import React, { useEffect, useState } from 'react'

import { fetchKetzalTours } from '@/lib/supabase/services-api'
import { getReviews } from './(public)/reviews/reviews.api'
import { getUsers } from './(protected)/users/users.api'
import { getCategories } from './(public)/categories/categories.api'

import type { ServiceData } from './(protected)/services/services.api'
import type { Review, User } from '@/types/review'
import type { Category } from './(public)/categories/categories.api'

// ponytail: home rinde siempre. Servicios vienen de Supabase (ketzal.services).
// Reviews/users/categories siguen apuntando al backend Railway que está caído;
// fallos individuales -> array vacío (no bloquean la pagina). Migrar cuando se ocupe.
export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ServiceData[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const settle = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
      try { return await p } catch { return fallback }
    }
    Promise.all([
      settle(fetchKetzalTours() as unknown as Promise<ServiceData[]>, [] as ServiceData[]),
      settle(getReviews() as Promise<Review[]>, [] as Review[]),
      settle(getUsers() as unknown as Promise<User[]>, [] as User[]),
      settle(getCategories() as Promise<Category[]>, [] as Category[]),
    ]).then(([s, r, u, c]) => {
      setServices(s)
      setReviews(r)
      setUsers(u)
      setCategories(Array.isArray(c) ? c : [])
      setLoading(false)
    })
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
