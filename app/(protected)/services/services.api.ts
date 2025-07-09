export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

console.log('BACKEND_URL from services.api.ts:', BACKEND_URL)

// Define ServiceData to match TourCardProps for SpecialOffers
export interface ServiceData {
    id: string;
    supplierId: string;
    name: string;
    description: string;
    price: number;
    location: string;
    availableFrom: string;
    availableTo: string;
    createdAt: string;
    packs: { data: { description: string; name: string; price: number; qty: number }[] };
    images: { imgAlbum: string[]; imgBanner: string };

    cityTo: string;
}
export interface ServiceDateRange {
    availableFrom: string;
    availableTo: string;
}

export interface ServiceDataNew {
    // id: string;
    supplierId: number;
    name: string;
    description: string;
    price: number;
    location: string;
    availableFrom: string;
    availableTo: string;
    createdAt: string;
    packs: { data: { description: string; name: string; price: number; qty: number }[] };
    images: { imgAlbum: string[]; imgBanner: string };
    ytLink?: string;
    sizeTour?: number;
    serviceType?: string;
    serviceCategory?: string;
    stateFrom?: string;
    cityFrom: string;
    cityTo: string;
    stateTo?: string;

    includes?: string[];
    excludes?: string[];

    faqs?: { answer: string, question: string }[];

    itinerary?: { date: string, time: string, title: string, location: string, description: string }[];

    transportProviderID?: number;
    hotelProviderID?: number;
    dates?: ServiceDateRange[];


}

// CREATE service
export async function createService(serviceData: ServiceDataNew) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        })
        await res.json()
        console.log("Service created successfully")
    } catch (error) {
        console.error("Error creating service:", error)
    }
}

// READ serviceS
export async function getServices() {
    console.log('getServices - BACKEND_URL:', BACKEND_URL)
    console.log('getServices - Full URL:', `${BACKEND_URL}/api/services`)
    const res = await fetch(`${BACKEND_URL}/api/services`)
    const data = await res.json()
    return data
}

// READ services with review statistics
export async function getServicesWithReviews() {
    console.log('getServicesWithReviews - BACKEND_URL:', BACKEND_URL)
    console.log('getServicesWithReviews - Full URL:', `${BACKEND_URL}/api/services/with-reviews`)
    const res = await fetch(`${BACKEND_URL}/api/services/with-reviews`)
    const data = await res.json()
    return data
}

// READ service
export async function getService(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`)
    const data = await res.json()
    return await data
}

// UPDATE service
export async function updateService(id: string, serviceData: ServiceData) {
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    })
    return await res.json()

}

// DELETE service
export async function deleteService(id: string) {
    try {
        // First check dependencies
        const dependencies = await checkServiceDependencies(id);
        
        if (dependencies.hasReviews) {
            throw new Error(
                `Cannot delete service. It has ${dependencies.reviewsCount} review(s) associated. ` +
                `Please remove the reviews first.`
            );
        }

        const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete service');
        }

        return await res.json();
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
}

// Check service dependencies before deletion
export async function checkServiceDependencies(id: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/services/${id}/dependencies`);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to check service dependencies');
        }

        return await res.json();
    } catch (error) {
        console.error('Error checking service dependencies:', error);
        throw error;
    }
}