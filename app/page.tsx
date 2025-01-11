import Header from '@/components/header'
import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import PopularDestinations from '@/components/PopularDestinations'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
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

