// Cliente de servicios (tours) sobre Supabase (schema `ketzal`).
// Reemplaza al viejo backend NestJS. Mantiene los nombres/shape de las
// funciones para no romper consumers; los nombres de campo del DB se aliasan
// a camelCase en el SELECT (sintaxis PostgREST: `aliasJS:column_db`).
import { createClient } from "@/lib/supabase/client"

// ----------------------------------------------------------------------------
// Tipos compartidos
// ----------------------------------------------------------------------------
export interface ServiceData {
  id: string
  supplierId: string
  name: string
  description: string
  price: number
  location: string
  availableFrom: string
  availableTo: string
  createdAt: string
  packs: { id?: string; description: string; name: string; price: number; qty: number }[]
  images: { imgAlbum: string[]; imgBanner: string }
  cityTo: string
}
export interface ServiceDateRange {
  id?: string
  startDate: string
  endDate: string
}
export interface ServiceDataNew {
  supplierId: number | string
  name: string
  description: string
  price: number
  location: string
  createdAt?: string
  packs: { id?: string; description: string; name: string; price: number; qty: number }[]
  images: { imgAlbum: string[]; imgBanner: string }
  ytLink?: string
  sizeTour?: number
  serviceType?: string
  serviceCategory?: string
  countryFrom?: string
  stateFrom?: string
  cityFrom: string
  countryTo?: string
  cityTo: string
  stateTo?: string
  includes?: string[]
  excludes?: string[]
  faqs?: { answer: string; question: string }[]
  itinerary?: { date: string; time: string; title: string; location: string; description: string }[]
  transportProviderID?: number | string
  hotelProviderID?: number | string
  dates?: ServiceDateRange[]
}

// Tipo interno que matchea los campos del SELECT aliasado (PostgREST).
// Se usa con `.returns<ServiceAliased>()` para que supabase-js no infiera
// `GenericStringError[]` en selects con aliasing string.
type ServiceAliased = {
  id: string
  supplierId: string | null
  name: string | null
  description: string | null
  price: number | null
  location: string | null
  availableFrom: string | null
  availableTo: string | null
  createdAt: string | null
  packs: unknown
  images: unknown
  cityTo: string | null
  cityFrom: string | null
  stateFrom: string | null
  stateTo: string | null
  serviceType: string | null
  serviceCategory: string | null
  ytLink: string | null
  sizeTour: number | null
  includes: unknown
  excludes: unknown
  faqs: unknown
  itinerary: unknown
  dates: unknown
  addOns: unknown
  seasonalPrices: unknown
  transportProviderID: string | null
  hotelProviderID: string | null
  currentBookings: number | null
  maxCapacity: number | null
  priceAxo: number | null
  reviews?: { rating: number }[]
}

// Shape completo de un service tras el aliasing PostgREST. Tipa los jsonb
// con la forma esperada por los consumers (tours/[id]/page, service-form, etc).
export interface ServiceFull {
  id: string
  supplierId: string | null
  name: string
  description: string | null
  price: number
  priceAxo: number | null
  location: string | null
  availableFrom: string | null
  availableTo: string | null
  createdAt: string
  packs: { data?: { name: string; description?: string; price: number; qty: number }[] } | null
  images: { imgBanner?: string; imgAlbum?: string[] } | null
  cityFrom: string | null
  cityTo: string | null
  stateFrom: string | null
  stateTo: string | null
  serviceType: string | null
  serviceCategory: string | null
  ytLink: string | null
  sizeTour: number | null
  includes: string[] | null
  excludes: string[] | null
  faqs: { question: string; answer: string }[] | null
  itinerary: {
    id?: string
    date: string
    time: string
    title: string
    location: string
    description: string
  }[] | null
  dates: unknown
  addOns: unknown
  seasonalPrices: unknown
  transportProviderID: string | null
  hotelProviderID: string | null
  currentBookings: number
  maxCapacity: number | null
}

// PostgREST aliasing: regresa los datos ya en camelCase.
const SERVICE_SELECT =
  "id, supplierId:supplier_id, name, description, price, location," +
  " availableFrom:available_from, availableTo:available_to, createdAt:created_at," +
  " packs, images, cityTo:city_to, cityFrom:city_from, stateFrom:state_from, stateTo:state_to," +
  " serviceType:service_type, serviceCategory:service_category, ytLink:yt_link, sizeTour:size_tour," +
  " includes, excludes, faqs, itinerary, dates, addOns:add_ons, seasonalPrices:seasonal_prices," +
  " transportProviderID:transport_provider_id, hotelProviderID:hotel_provider_id," +
  " currentBookings:current_bookings, maxCapacity:max_capacity, priceAxo:price_axo"

// Mapper camelCase -> snake_case para insert/update.
type ServiceRow = Record<string, unknown>
function toRow(input: Partial<ServiceDataNew>): ServiceRow {
  const m: ServiceRow = {}
  if (input.supplierId !== undefined) m.supplier_id = String(input.supplierId)
  if (input.name !== undefined) m.name = input.name
  if (input.description !== undefined) m.description = input.description
  if (input.price !== undefined) m.price = input.price
  if (input.location !== undefined) m.location = input.location
  if (input.packs !== undefined) m.packs = input.packs
  if (input.images !== undefined) m.images = input.images
  if (input.ytLink !== undefined) m.yt_link = input.ytLink
  if (input.sizeTour !== undefined) m.size_tour = input.sizeTour
  if (input.serviceType !== undefined) m.service_type = input.serviceType
  if (input.serviceCategory !== undefined) m.service_category = input.serviceCategory
  if (input.stateFrom !== undefined) m.state_from = input.stateFrom
  if (input.cityFrom !== undefined) m.city_from = input.cityFrom
  if (input.stateTo !== undefined) m.state_to = input.stateTo
  if (input.cityTo !== undefined) m.city_to = input.cityTo
  if (input.includes !== undefined) m.includes = input.includes
  if (input.excludes !== undefined) m.excludes = input.excludes
  if (input.faqs !== undefined) m.faqs = input.faqs
  if (input.itinerary !== undefined) m.itinerary = input.itinerary
  if (input.dates !== undefined) m.dates = input.dates
  if (input.transportProviderID !== undefined)
    m.transport_provider_id = input.transportProviderID ? String(input.transportProviderID) : null
  if (input.hotelProviderID !== undefined)
    m.hotel_provider_id = input.hotelProviderID ? String(input.hotelProviderID) : null
  return m
}

// ----------------------------------------------------------------------------
// READ
// ----------------------------------------------------------------------------
export async function getServices() {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .select(SERVICE_SELECT)
    .order("created_at", { ascending: false })
    .returns<ServiceAliased[]>()
  if (error) throw new Error(`getServices: ${error.message}`)
  return data ?? []
}

export async function getServicesWithReviews() {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .select(SERVICE_SELECT + ", reviews(rating)")
    .order("created_at", { ascending: false })
    .returns<ServiceAliased[]>()
  if (error) throw new Error(`getServicesWithReviews: ${error.message}`)
  return (data ?? []).map((row) => {
    const ratings = row.reviews ?? []
    const avg = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0
    const { reviews: _r, ...rest } = row
    void _r
    return { ...rest, rating: avg, reviewCount: ratings.length }
  })
}

export async function getService(
  id: string
): Promise<ServiceFull | { statusCode: number; message: string }> {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .select(SERVICE_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<ServiceFull>()
  if (error) {
    return { statusCode: 404, message: error.message }
  }
  return data ?? { statusCode: 404, message: "Service not found" }
}

// ----------------------------------------------------------------------------
// WRITE (RLS: requiere superadmin o dueño del supplier)
// ----------------------------------------------------------------------------
export async function createService(serviceData: ServiceDataNew) {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .insert(toRow(serviceData) as never)
    .select(SERVICE_SELECT)
    .single()
    .returns<ServiceAliased>()
  if (error) {
    console.error("createService error:", error)
    return { error: error.message }
  }
  return { success: "Service created successfully!", data }
}

export async function updateService(id: string, serviceData: Partial<ServiceDataNew>) {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .update(toRow(serviceData) as never)
    .eq("id", id)
    .select(SERVICE_SELECT)
    .single()
    .returns<ServiceAliased>()
  if (error) throw new Error(`updateService: ${error.message}`)
  return data
}

export async function deleteService(id: string) {
  const deps = await checkServiceDependencies(id)
  if (deps.hasReviews) {
    throw new Error(
      `Cannot delete service. It has ${deps.reviewsCount} review(s) associated. ` +
        "Please remove the reviews first."
    )
  }
  const sb = createClient()
  const { error } = await sb.from("services").delete().eq("id", id)
  if (error) throw new Error(`deleteService: ${error.message}`)
  return { success: true }
}

export async function checkServiceDependencies(id: string) {
  const sb = createClient()
  const { count, error } = await sb
    .from("reviews")
    .select("id", { head: true, count: "exact" })
    .eq("service_id", id)
  if (error) throw new Error(`checkServiceDependencies: ${error.message}`)
  const reviewsCount = count ?? 0
  return { hasReviews: reviewsCount > 0, reviewsCount, canDelete: reviewsCount === 0 }
}
