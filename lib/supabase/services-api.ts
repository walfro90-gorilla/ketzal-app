/**
 * Lecturas de catálogo desde el schema `ketzal` en Supabase.
 * RLS permite lectura pública (anon), así que esto corre en el navegador.
 */
import { createClient } from "./client"

export type KetzalTour = {
  id: string
  name: string
  price: number
  location: string | null
  description: string | null
  serviceType: string | null
  availableFrom: string | null
  availableTo: string | null
  images: unknown
  rating: number
  reviewCount: number
}

export async function fetchKetzalTours(): Promise<KetzalTour[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from("services")
    .select("id,name,description,price,location,service_type,available_from,available_to,images")
    .eq("service_type", "tour")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    location: r.location,
    description: r.description,
    serviceType: r.service_type,
    availableFrom: r.available_from,
    availableTo: r.available_to,
    images: r.images,
    // ponytail: rating/reviewCount 0 hasta que agreguemos aggregate de ketzal.reviews
    rating: 0,
    reviewCount: 0,
  }))
}
