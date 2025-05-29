export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


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
    const res = await fetch(`${BACKEND_URL}/api/services`)
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
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: 'DELETE',
    })
    await res.json()
    // console.log(data)

}