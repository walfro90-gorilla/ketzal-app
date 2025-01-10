import Header from '@/components/header'
import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import PopularDestinations from '@/components/PopularDestinations'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow w-full flex flex-col">
        <HeroSection />
        <PopularCategories />
        <PopularDestinations />
        <SpecialOffers />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

