import { TourGallery } from '@/components/tour-gallery'
import { TourHeader } from '@/components/tour-header'
import { TourInfo } from '@/components/tour-info'
import { TourPricing } from '@/components/tour-pricing'
import { TourLocation } from '@/components/tour-location'
import { TourBookingForm } from '@/components/tour-booking-form'
import { LocalHighlights } from '@/components/local-highlights'
import { OrganizedBy } from '@/components/organized-by'
import { getService } from '@/app/(protected)/services/services.api'
import { getSupplier } from '@/app/(protected)/suppliers/suppliers.api'
import { TourIncludeExclude } from '@/components/tour-include-exclude'

export default async function TourPage({ params }: { params: { id: string } }) {

  //  // Fetch services
  const resolvedParams = await params

  const service = await getService(resolvedParams.id)
  console.log("Service data: ", service)

  const provider = await getSupplier(service.supplierId)
  console.log("Provider data: ", provider)

  const availableFrom = new Date(service.availableFrom);
  const availableTo = new Date(service.availableTo);
  const durationInMilliseconds = availableTo.getTime() - availableFrom.getTime();
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

  const tourData = {



    id: params.id,
    name: service.name,
    bannerImage: service.images.imgBanner,

    itinerary: service.itinerary,

    images: service.images.imgAlbum.map((img) => img),


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
    included: service.includes.map((include) => include), 
    excluded: service.excludes.map((exclude) => exclude),
    description: service.description,
    duration: durationInDays + " days",
    tourType: service.serviceCategory,
    groupSize: service.sizeTour + " people",
    //location: "Central America",
    language: "English, Spanish",
    price: 5.88,
    originalPrice: service.price,
    rating: 5,
    availableFrom: service.availableFrom,
    availableTo: service.availableTo,
    packs: service.packs.data,
    reviewCount: 1,
    organizer: {
      name: provider.name,
      memberSince: provider.createdAt,
      avatar: provider.imgLogo,
    },
    localInfo: {
      climate: "Tropical, with average temperatures of 25°C (77°F)",
      bestTimeToVisit: "December to April (dry season)",
      localCuisine: "Traditional Mayan dishes and fresh tropical fruits",
      wildlife: ["Ketzal birds", "Howler monkeys", "Jaguars", "Toucans"],
    },
    highlights: [
      {
        title: "Rainforest Canopy Tour",
        description: "Zip-line through the treetops for a bird's-eye view of the rainforest.",
      },
      {
        title: "Ancient Mayan Ruins",
        description: "Explore well-preserved Mayan temples and learn about the ancient civilization.",
      },
      {
        title: "Night Wildlife Safari",
        description: "Spot nocturnal animals on a guided night tour through the jungle.",
      },
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
              <TourPricing
                packs={tourData.packs}
                availableFrom={tourData.availableFrom}
                availableTo={tourData.availableTo}
                price={tourData.price}
                originalPrice={tourData.originalPrice}
              />
              <OrganizedBy

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
                  <LocalHighlights localInfo={tourData.localInfo} highlights={tourData.highlights} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <TourBookingForm tourId={tourData.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

