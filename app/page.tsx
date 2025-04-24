'use client'

import Header from '@/components/header'
import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import PopularDestinations from '@/components/PopularDestinations'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import React, { useEffect, useState } from 'react'

// import Services data
import { getServices } from './(public)/services/services.api'
import { getReviews } from './(public)/reviews/reviews.api'
import { getUsers } from './(protected)/users/users.api'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any>(null)
  const [reviews, setReviews] = useState<any>(null)
  const [users, setUsers] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [servicesData, reviewsData, usersData] = await Promise.all([
        getServices(),
        getReviews(),
        getUsers(),
      ])
      setServices(servicesData)
      setReviews(reviewsData)
      setUsers(usersData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
        <HeroSection />
        <PopularCategories />
        <PopularDestinations />
        <SpecialOffers services={services} />
        <Testimonials reviews={reviews} users={users} />
      </main>
      <Footer />
    </div>
  )
}

