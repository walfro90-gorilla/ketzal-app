"use server";

import { z } from "zod";
import { serviceFormSchema, ServiceFormData } from "@/app/(protected)/services/new/validations/service-form.validation";
import { auth } from "@/auth";
import { 
  createService as createServiceAPI, 
  ServiceDataNew 
} from "@/app/(protected)/services/services.api";

export async function createService(values: ServiceFormData) {
  const session = await auth();

  if (!session?.user?.id || !session.user.supplierId) {
    return { error: "Unauthorized or no supplier associated with user." };
  }

  const validatedFields = serviceFormSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Zod validation failed:", validatedFields.error.flatten().fieldErrors);
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  
  const supplierId = parseInt(session.user.supplierId, 10);
  if (isNaN(supplierId)) {
    return { error: "Invalid supplier ID in session." };
  }

  // Construct the payload matching the ServiceDataNew interface from services.api.ts
  const serviceData: ServiceDataNew = {
    ...data,
    supplierId: supplierId,
    location: "", // Set a default or get from form if available
    createdAt: new Date().toISOString(),
    // Ensure optional fields are handled correctly
    ytLink: data.ytLink || "",
    sizeTour: data.sizeTour || 0,
    serviceType: data.serviceType || "tour",
    serviceCategory: data.serviceCategory || "ecoturismo",
    stateFrom: data.stateFrom || "",
    cityFrom: data.cityFrom || "",
    stateTo: data.stateTo || "",
    cityTo: data.cityTo || "",
    includes: data.includes || [],
    excludes: data.excludes || [],
    faqs: data.faqs || [],
    itinerary: data.itinerary || [],
    transportProviderID: data.transportProviderID ? parseInt(data.transportProviderID, 10) : undefined,
    hotelProviderID: data.hotelProviderID ? parseInt(data.hotelProviderID, 10) : undefined,
    dates: data.dates?.map(d => ({
      startDate: d.startDate,
      endDate: d.endDate,
    })) || [],
    packs: data.packs || []
  };

  try {
    const result = await createServiceAPI(serviceData);
    if (result.error) {
      return { error: result.error };
    }
    return { success: "Service created successfully!" };
  } catch (error) {
    console.error("API error creating service:", error);
    return { error: "Failed to create service via API." };
  }
}
