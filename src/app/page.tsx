import Header from '@/components/header'
import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import PopularDestinations from '@/components/PopularDestinations'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import BlogSection from '@/components/BlogSection'
import Footer from '@/components/Footer'
import { getServices } from '@/app/(public)/services/services.api'
import { getCategories } from '@/app/(public)/categories/categories.api'
import { getReviews } from '@/app/(public)/reviews/reviews.api'
import { getUsers } from '@/app/(protected)/users/users.api'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth();
  const services = await getServices();
  const categories = await getCategories();
  const reviews = await getReviews();
  const users = await getUsers();

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      <main className="flex-grow">
        <HeroSection />
        <PopularCategories services={services} categories={categories} />
        <PopularDestinations />
        <SpecialOffers services={services} />
        <Testimonials reviews={reviews} users={users} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}

