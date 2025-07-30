import { z } from "zod";

export const serviceFormSchema = z.object({
  // Basic Info
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  serviceType: z.string().optional(),
  serviceCategory: z.string().optional(),
  sizeTour: z.number().min(1, "El tamaño del tour debe ser al menos 1").optional(),
  ytLink: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  // Images
  mainImage: z.string().optional(),
  images: z.array(z.string()).optional(),

  // Pricing
  price: z.number().min(0, "El precio debe ser mayor a 0").optional(),
  dateRanges: z.array(z.object({
    startDate: z.string(),
    endDate: z.string(),
    price: z.number()
  })).optional(),

  // Location
  stateFrom: z.string().optional(),
  cityFrom: z.string().optional(),
  stateTo: z.string().optional(),
  cityTo: z.string().optional(),

  // Providers
  transportProviderID: z.string().optional(),
  hotelProviderID: z.string().optional(),

  // Packages
  packages: z.array(z.object({
    name: z.string(),
    description: z.string(),
    qty: z.number(),
    price: z.number()
  })).optional(),

  // Itinerary
  itinerary: z.array(z.any()).optional(),

  // Includes/Excludes
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),

  // FAQs
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

export const serviceFormDefaults: Partial<ServiceFormData> = {
  name: "",
  description: "",
  serviceType: "",
  serviceCategory: "",
  sizeTour: 1,
  ytLink: "",
  price: 0,
  images: [],
  dateRanges: [],
  packages: [],
  itinerary: [],
  includes: [],
  excludes: [],
  faqs: [],
}; 