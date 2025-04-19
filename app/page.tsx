import Header from '@/components/header'
import HeroSection from '@/components/HeroSection'
import PopularCategories from '@/components/PopularCategories'
import PopularDestinations from '@/components/PopularDestinations'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
// import Services data
import { getServices } from './(protected)/services/services.api'


export default async function Home() {

  // Fetch services
  const services = await getServices();

  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
        <HeroSection />
        <PopularCategories />
        <PopularDestinations />
        <SpecialOffers services={services} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

