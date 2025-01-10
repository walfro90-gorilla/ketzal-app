import { TourGallery } from '@/components/tour-gallery'
import { TourHeader } from '@/components/tour-header'
import { TourInfo } from '@/components/tour-info'
import { TourPricing } from '@/components/tour-pricing'
import { TourLocation } from '@/components/tour-location'
import { TourBookingForm } from '@/components/tour-booking-form'
import { LocalHighlights } from '@/components/local-highlights'
import { OrganizedBy } from '@/components/organized-by'

export default function TourPage({ params }: { params: { id: string } }) {
  const tourData = {
    id: params.id,
    name: "Ketzal Eco-Adventure Tour",
    bannerImage: "/placeholder.svg?height=800&width=1600&text=Tour+Banner",
    images: [
      "/placeholder.svg?height=600&width=800&text=Ketzal+Rainforest",
      "/placeholder.svg?height=600&width=800&text=Local+Wildlife",
      "/placeholder.svg?height=600&width=800&text=Mayan+Ruins",
    ],
    location: {
      title: "UK,London,State-23",
      address: "London, UK",
      coordinates: {
        lat: 51.5074,
        lng: -0.1278
      }
    },
    included: [
      "Open Place",
      "Guide Facility",
      "Food",
      "Car Facility"
    ],
    excluded: [
      "Sea Food",
      "Only Guide for Mountain",
      "4 seat Car",
      "No Tent"
    ],
    description: "Embark on an unforgettable journey through the lush rainforests of Central America. Our Ketzal Eco-Adventure Tour offers a unique blend of nature exploration, cultural immersion, and thrilling activities.",
    duration: "5 days",
    tourType: "Nature & Adventure",
    groupSize: "6 to 12 people",
    //location: "Central America",
    language: "English, Spanish",
    price: 5.88,
    originalPrice: 6.03,
    rating: 5,
    reviewCount: 1,
    organizer: {
      name: "showrav Hasan",
      memberSince: "2021",
      avatar: "/placeholder.svg?height=100&width=100"
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
                    location={tourData.location}
                    included={tourData.included}
                    excluded={tourData.excluded}
                  />
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

