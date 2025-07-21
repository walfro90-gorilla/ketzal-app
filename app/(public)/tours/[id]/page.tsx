import { TourGallery } from '@/components/tour-gallery'
import { TourHeader } from '@/components/tour-header'
import { TourInfo } from '@/components/tour-info'
import { TourPricingWithSeats } from '@/components/tour-pricing-with-seats'
import { TourLocation } from '@/components/tour-location'
// import { TourBookingForm } from '@/components/tour-booking-form'
import { LocalHighlights } from '@/components/local-highlights'
import { OrganizedBy } from '@/components/organized-by'
import { getService, getServices } from '@/app/(protected)/services/services.api'
import { getSupplier } from '@/app/(protected)/suppliers/suppliers.api'
// import { TourIncludeExclude } from '@/components/tour-include-exclude'
// import HotelSearch from '@/hotel-search'
import HotelInfo from '@/components/hotel-info'
// import TransportProviderSearch from '@/transport-provider-search'
import TransportProvider from '@/components/transport-provider'
import ReviewSection from '@/components/ReviewSection'
// import TourCarousel from '@/components/TourCarousel'
import SpecialOffers from '@/components/SpecialOffers'
import { getReviews } from '../../reviews/reviews.api'
import { getUsers } from '@/app/(protected)/users/users.api'
import { auth } from '@/auth'
import type { Service } from '@/components/service-card'

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch services
  const service = await getService(id)
  // console.log("Service data: ", service)

  const provider = await getSupplier(service.supplierId)
  // console.log("Provider data: ", provider)

  const hotelProvider = await getSupplier(service.hotelProviderID)
  // console.log("Hotel Provider data: ", hotelProvider)

  const transportProvider = await getSupplier(service.transportProviderID)
  // console.log("Transport Provider data: ", transportProvider)

  const tours = (await getServices()).filter((service: Service) => service.serviceType === 'tour')

  // Reviews fetching
  const reviewsService = (await getReviews()).filter((review: { serviceId: number }) => review.serviceId === Number(id))
  // console.log("reviews: ", reviewsService)

  const users = (await getUsers())
  // console.log("users: ", users)

  const session = await auth()
  // console.log("Session: ", session)

  const availableFrom = new Date(service.availableFrom);
  const availableTo = new Date(service.availableTo);
  const durationInMilliseconds = availableTo.getTime() - availableFrom.getTime();
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

  // Calculate average rating and review count dynamically
  const averageRating = reviewsService.length > 0 
    ? reviewsService.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviewsService.length 
    : 0;
  const reviewCount = reviewsService.length;

  // Detectar automáticamente si el tour incluye transporte en bus
  const hasBusTransport = 
    service.description?.toLowerCase().includes('bus') ||
    service.description?.toLowerCase().includes('transporte') ||
    service.name?.toLowerCase().includes('tour') ||
    transportProvider?.name?.toLowerCase().includes('bus') ||
    transportProvider?.name?.toLowerCase().includes('transporte') ||
    service.includes?.some((include: string) => 
      include.toLowerCase().includes('transporte') || 
      include.toLowerCase().includes('bus')
    ) ||
    false;

  // Map users to correct type for ReviewSection
  const mappedUsers = users.map((user) => ({
    id: user.id,
    name: user.name || 'Usuario desconocido', // Handle null name
    image: user.image || '/default-avatar.png', // Handle null image
  }));

  const tourData = {
    id: id,
    name: service.name,
    bannerImage: service.images.imgBanner,

    itinerary: service.itinerary,

    images: service.images.imgAlbum.map((img: string) => img),

    fromCity: service.cityFrom,
    toCity: service.cityTo,

    location: {
      title: service.title,
      address: service.cityTo + ", " + service.stateTo,
      coordinates: {
        lat: 51.5074,
        lng: -0.1278
      }
    },
    included: service.includes.map((include: string) => include),
    excluded: service.excludes.map((exclude: string) => exclude),
    description: service.description,
    duration: durationInDays + " dias",
    tourType: service.serviceCategory,
    groupSize: service.sizeTour + "  viajeros",
    //location: "Central America",
    language: "English, Spanish",
    price: 5.88,
    originalPrice: service.price,
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    availableFrom: service.availableFrom,
    availableTo: service.availableTo,
    packs: service.packs.data,
    reviewCount: reviewCount,
    organizer: {
      id: provider.id,
      name: provider.name,
      memberSince: provider.createdAt,
      avatar: provider.imgLogo,
    },
    faqs: service.faqs,
    localInfo: {
      climate: "Tropical, with average temperatures of 25°C (77°F)",
      bestTimeToVisit: "December to April (dry season)",
      localCuisine: "Traditional Mayan dishes and fresh tropical fruits",
      wildlife: ["Ketzal birds", "Howler monkeys", "Jaguars", "Toucans"],
    },
    highlights: [
    ],
  }

  return (
    <div>
      <TourHeader
        title={tourData.name}
        bannerImage={tourData.bannerImage}
        duration={tourData.duration}
        tourType={tourData.tourType}
        groupSize={tourData.groupSize}
        location={tourData.location.address}
        rating={tourData.rating}
        reviewCount={tourData.reviewCount}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <TourGallery images={tourData.images} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <TourPricingWithSeats
                packs={tourData.packs}
                availableFrom={tourData.availableFrom}
                availableTo={tourData.availableTo}
                price={tourData.price}
                originalPrice={tourData.originalPrice}
                title={tourData.name}
                idService={tourData.id}
                bannerImage={tourData.bannerImage}
                hasBusTransport={hasBusTransport} // Detectado automáticamente
                location={`${tourData.fromCity} - ${tourData.toCity}`}
                description={tourData.description}
                organizer={{
                  name: tourData.organizer.name,
                  logo: tourData.organizer.avatar
                }}
              />
              <OrganizedBy

                id={tourData.organizer.id}
                name={tourData.organizer.name}
                memberSince={tourData.organizer.memberSince}
                avatar={tourData.organizer.avatar}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TourInfo tour={tourData} />


                <HotelInfo hotelProvider={hotelProvider} />



                <TransportProvider transportProvider={transportProvider} />

                <div className="mt-8">
                  <TourLocation
                    itinerary={tourData.itinerary}
                    location={tourData.location}
                    included={tourData.included}
                    excluded={tourData.excluded}
                  />
                  {/* <TourIncludeExclude
                    location={tourData.location}
                    included={tourData.included}
                    excluded={tourData.excluded}
                  /> */}
                </div>
                <div className="mt-8">
                  <LocalHighlights faqs={tourData.faqs} localInfo={tourData.localInfo} highlights={tourData.highlights} />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Reseñas</h3>
                  <ReviewSection
                    serviceId={tourData.id}
                    reviewsService={reviewsService}
                    users={mappedUsers}
                    session={session} // Pass session as Session | null
                  />

                </div>

                <div className="mt-8">
                  <SpecialOffers services={tours} />

                </div>
              </div>
              {/* <div className="lg:col-span-1">
                <TourBookingForm tourId={tourData.id} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

