import type { FAQ } from "@/types/faq"

export interface ServiceFormData {
  // Campos básicos
  supplierId?: number
  name?: string
  description?: string
  serviceType?: 'tour' | 'bus' | 'hotel' | 'tickets'
  serviceCategory?: 'ecoturismo' | 'paquete' | 'festival' | 'familiar'
  sizeTour?: number
  ytLink?: string
  
  // Imágenes
  images?: {
    imgBanner: string
    imgAlbum: string[]
  }
  
  // Precios y fechas
  price?: number
  availableFrom?: Date | null
  availableTo?: Date | null
  
  // Ubicación
  stateFrom?: string
  cityFrom?: string
  stateTo?: string
  cityTo?: string
  
  // Proveedores
  transportProviderID?: string
  hotelProviderID?: string
  
  // Paquetes
  packages?: Array<{
    name: string
    description: string
    qty: number
    price: number
  }>
  
  // Itinerario y servicios
  itinerary?: string[]
  includes?: string[]
  excludes?: string[]
  
  // FAQs
  faqs?: FAQ[]
  
  // Rangos de fechas adicionales
  dateRanges?: Array<{
    availableFrom: Date
    availableTo: Date
  }>
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isComplete: boolean;
  isRequired: boolean;
}

export interface GlobalLocation {
  id: number
  country: string
  state: string
  city: string
}

export interface Supplier {
  id: number
  name: string
  supplierType: string
}

export interface Service {
  id: string
  name: string
  supplierId?: number
  description?: string
  price?: number
  location?: string
  availableFrom?: Date | null
  availableTo?: Date | null
  packs?: { data: { name: string; description: string; qty: number; price: number }[] }
  images?: string[]
  ytLink?: string
  sizeTourM?: number
  serviceType?: string
  serviceCategory?: string
  stateFrom?: string
  cityFrom?: string
  stateTo?: string
  cityTo?: string
  includes?: string[]
  excludes?: string[]
  faqs?: FAQ[]
  activities?: string[]
  transportProviderID?: number
  hotelProviderID?: number
}

export interface Session {
  user: {
    id: string
    name?: string | null | undefined
    email?: string | null
    image?: string | null
    supplierId?: string | null
    role: string
  }
}

export interface ServiceFormProps {
  service: Service
  session: Session | null
}

// Tipos para errores de imágenes
export interface ImagesError {
  imgBanner?: { message: string }
  imgAlbum?: { message: string }
}

// Tipo para posibles inputs de imágenes
export interface ImagesInput {
  imgBanner?: unknown
  imgAlbum?: unknown
  [key: string]: unknown
}

// Tipo para rangos de fechas del servicio
export interface ServiceDateRange {
  availableFrom: Date
  availableTo: Date
}

// Tipo para el resumen del formulario
export interface FormSummary {
  name?: string
  price?: number
  availableFrom?: Date | null
  availableTo?: Date | null
  supplier?: string
  imgBanner?: string
  imgAlbumCount?: number
} 