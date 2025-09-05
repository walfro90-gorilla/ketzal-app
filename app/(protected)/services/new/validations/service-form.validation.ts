import { z } from "zod";

export const serviceFormSchema = z.object({
  // Basic Info
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  serviceType: z.string().min(1, "El tipo de servicio es requerido"),
  serviceCategory: z.string().min(1, "La categoría del servicio es requerida"),
  sizeTour: z.number().min(1, "El tamaño del tour debe ser al menos 1").optional(),
  ytLink: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  // Images
  images: z.object({
    imgBanner: z.string().min(1, "La imagen de banner es requerida"),
    imgAlbum: z.array(z.string()).min(3, "Se requieren al menos 3 imágenes en el álbum"),
  }),

  // Pricing
  price: z.number().min(0, "El precio no puede ser negativo"),
  dates: z.array(z.object({
    id: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    price: z.number()
  })).optional(),

  // Location
  countryFrom: z.string().optional(),
  stateFrom: z.string().optional(),
  cityFrom: z.string().optional(),
  countryTo: z.string().optional(),
  stateTo: z.string().optional(),
  cityTo: z.string().optional(),

  // Providers
  transportProviderID: z.string().optional(),
  hotelProviderID: z.string().optional(),

  // Packages
  packs: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    qty: z.number(),
    price: z.number()
  })).optional(),

  // Itinerary
  itinerary: z.array(z.object({
    id: z.number(),
    title: z.string().min(1, "El título es requerido"),
    date: z.string().min(1, "La fecha es requerida"),
    time: z.string().min(1, "La hora es requerida"),
    description: z.string(),
    location: z.string().min(1, "La ubicación es requerida"),
  })).optional(),

  // Includes/Excludes
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),

  // FAQs
  faqs: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string()
  })).optional(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

export const serviceFormDefaults: Partial<ServiceFormData> = {
  name: "",
  description: "",
  serviceType: "tour",
  serviceCategory: "ecoturismo",
  sizeTour: 1,
  ytLink: "",
  price: 0,
  images: {
    imgBanner: "",
    imgAlbum: [],
  },
  dates: [],
  countryFrom: "",
  stateFrom: "",
  cityFrom: "",
  countryTo: "",
  stateTo: "",
  cityTo: "",
  packs: [],
  itinerary: [],
  includes: [],
  excludes: [],
  faqs: [],
};
