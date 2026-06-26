import { TourGallery } from '@/components/tour-gallery'
import { TourHeader } from '@/components/tour-header'
import { TourInfo } from '@/components/tour-info'
import { TourPricingWithSeats } from '@/components/tour-pricing-with-seats'
import { TourLocation } from '@/components/tour-location'
import { LocalHighlights } from '@/components/local-highlights'
import { OrganizedBy } from '@/components/organized-by'
import { getService, getServicesWithReviews, type ServiceFull } from '@/app/(protected)/services/services.api'
import { getSupplier } from '@/app/(protected)/suppliers/suppliers.api'
import HotelInfo from '@/components/hotel-info'
import TransportProvider from '@/components/transport-provider'
import ReviewSection from '@/components/ReviewSection'
import SpecialOffers from '@/components/SpecialOffers'
import { getUsers, type User } from '@/app/(protected)/users/users.api'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

type Provider = {
  id: string
  name: string
  contactEmail: string | null
  imgLogo: string | null
  createdAt: string | null
  photos?: unknown
  info?: unknown
  description?: string | null
} | null

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const svcRaw = await getService(id)
  if (!svcRaw || 'statusCode' in svcRaw) notFound()
  const service: ServiceFull = svcRaw

  const provider = (await getSupplier(service.supplierId)) as Provider
  const hotelProvider = (await getSupplier(service.hotelProviderID)) as Provider
  const transportProvider = (await getSupplier(service.transportProviderID)) as Provider

  // Catalogo + reviews aggregadas (rating/reviewCount vienen incluidos)
  const allServices = await getServicesWithReviews()
  const tours = (allServices as Array<ServiceFull & { rating?: number; reviewCount?: number }>)
    .filter((s) => s.serviceType === 'tour')
  const thisTourAgg = tours.find((t) => t.id === service.id)
  const averageRating = thisTourAgg?.rating ?? 0
  const reviewCount = thisTourAgg?.reviewCount ?? 0

  const users = await getUsers()
  const session = await auth()

  const availableFrom = service.availableFrom ? new Date(service.availableFrom) : new Date()
  const availableTo = service.availableTo ? new Date(service.availableTo) : new Date()
  const durationInDays = Math.max(
    0,
    Math.round((availableTo.getTime() - availableFrom.getTime()) / (1000 * 60 * 60 * 24))
  )

  // Detectar transporte en bus desde descripcion/nombre/provider/includes
  const lower = (s: string | null | undefined) => (s ?? '').toLowerCase()
  const includesArr = service.includes ?? []
  const hasBusTransport =
    lower(service.description).includes('bus') ||
    lower(service.description).includes('transporte') ||
    lower(service.name).includes('tour') ||
    lower(transportProvider?.name).includes('bus') ||
    lower(transportProvider?.name).includes('transporte') ||
    includesArr.some((x) => lower(x).includes('transporte') || lower(x).includes('bus'))

  // Mapped users para ReviewSection
  const mappedUsers = users.map((user: User) => ({
    id: user.id,
    name: user.name || 'Usuario desconocido',
    image: user.image || '/default-avatar.png',
  }))

  // Safe jsonb defaults
  const images = service.images ?? {}
  const bannerImage = images.imgBanner ?? ''
  const galleryImages = images.imgAlbum ?? []
  const packs = service.packs?.data ?? []
  const itinerary = service.itinerary ?? []
  const faqs = service.faqs ?? []
  const includedList = service.includes ?? []
  const excludedList = service.excludes ?? []

  const tourData = {
    id,
    name: service.name,
    bannerImage,
    itinerary,
    images: galleryImages,
    fromCity: service.cityFrom ?? '',
    toCity: service.cityTo ?? '',
    location: {
      title: service.name,
      address: `${service.cityTo ?? ''}, ${service.stateTo ?? ''}`,
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    included: includedList,
    excluded: excludedList,
    description: service.description ?? '',
    duration: `${durationInDays} dias`,
    tourType: service.serviceCategory ?? '',
    groupSize: `${service.sizeTour ?? 0} viajeros`,
    language: 'English, Spanish',
    price: 5.88,
    originalPrice: service.price,
    rating: Math.round(averageRating * 10) / 10,
    availableFrom: service.availableFrom ?? '',
    availableTo: service.availableTo ?? '',
    packs,
    reviewCount,
    organizer: {
      id: provider?.id ?? '',
      name: provider?.name ?? '',
      memberSince: provider?.createdAt ?? '',
      avatar: provider?.imgLogo ?? '',
    },
    faqs,
    localInfo: {
      climate: 'Tropical, with average temperatures of 25°C (77°F)',
      bestTimeToVisit: 'December to April (dry season)',
      localCuisine: 'Traditional Mayan dishes and fresh tropical fruits',
      wildlife: ['Ketzal birds', 'Howler monkeys', 'Jaguars', 'Toucans'],
    },
    highlights: [] as never[],
  }

  // Reviews para la sección (filter desde catálogo seria N+1; usamos vacío
  // hasta que ReviewSection se cablee directo a ketzal.reviews por service_id).
  const reviewsService: never[] = []

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
                hasBusTransport={hasBusTransport}
                location={`${tourData.fromCity} - ${tourData.toCity}`}
                description={tourData.description}
                organizer={{
                  name: tourData.organizer.name,
                  logo: tourData.organizer.avatar || undefined,
                }}
              />
              <OrganizedBy
                id={tourData.organizer.id}
                name={tourData.organizer.name}
                memberSince={tourData.organizer.memberSince ?? ''}
                avatar={tourData.organizer.avatar ?? ''}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TourInfo tour={tourData} />

                {/* Components legacy esperan shapes hechas para el backend
                    viejo; cast estrecho (no `any`) hasta que se rewrite. */}
                <HotelInfo hotelProvider={hotelProvider as unknown as Parameters<typeof HotelInfo>[0]['hotelProvider']} />
                <TransportProvider transportProvider={transportProvider as unknown as Parameters<typeof TransportProvider>[0]['transportProvider']} />

                <div className="mt-8">
                  <TourLocation
                    itinerary={tourData.itinerary as unknown as Parameters<typeof TourLocation>[0]['itinerary']}
                    location={tourData.location}
                    included={tourData.included}
                    excluded={tourData.excluded}
                  />
                </div>
                <div className="mt-8">
                  <LocalHighlights
                    faqs={tourData.faqs}
                    localInfo={tourData.localInfo}
                    highlights={tourData.highlights}
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Reseñas</h3>
                  <ReviewSection
                    serviceId={tourData.id}
                    reviewsService={reviewsService}
                    users={mappedUsers}
                    session={session}
                  />
                </div>

                <div className="mt-8">
                  <SpecialOffers
                    services={tours as unknown as Parameters<typeof SpecialOffers>[0]['services']}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
