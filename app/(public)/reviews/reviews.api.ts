// Reviews sobre Supabase (schema `ketzal`).
import { createClient } from "@/lib/supabase/client"

export interface ReviewData {
  rating: number
  comment: string
  serviceId: number | string
  userId: string
}

type ReviewAliased = {
  id: string
  rating: number
  comment: string | null
  serviceId: string
  userId: string
  createdAt: string
}

const REVIEW_SELECT =
  "id, rating, comment, serviceId:service_id, userId:user_id, createdAt:created_at"

export async function getReviews() {
  const sb = createClient()
  const { data, error } = await sb
    .from("reviews")
    .select(REVIEW_SELECT)
    .order("created_at", { ascending: false })
    .returns<ReviewAliased[]>()
  if (error) throw new Error(`getReviews: ${error.message}`)
  return data ?? []
}

export async function getReview(id: string) {
  const sb = createClient()
  const { data, error } = await sb
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<ReviewAliased>()
  if (error) throw new Error(`getReview: ${error.message}`)
  return data
}

// CREATE — RLS exige user_id = auth.uid().
export async function createReview(reviewData: ReviewData) {
  const sb = createClient()
  const { data, error } = await sb
    .from("reviews")
    .insert({
      service_id: String(reviewData.serviceId),
      user_id: reviewData.userId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    })
    .select(REVIEW_SELECT)
    .single()
    .returns<ReviewAliased>()
  if (error) throw new Error(`createReview: ${error.message}`)
  return data
}

export async function updateReview(id: string, reviewData: Partial<ReviewData>) {
  const patch: Record<string, unknown> = {}
  if (reviewData.rating !== undefined) patch.rating = reviewData.rating
  if (reviewData.comment !== undefined) patch.comment = reviewData.comment
  const sb = createClient()
  const { data, error } = await sb
    .from("reviews")
    .update(patch as never)
    .eq("id", id)
    .select(REVIEW_SELECT)
    .single()
    .returns<ReviewAliased>()
  if (error) throw new Error(`updateReview: ${error.message}`)
  return data
}

export async function deleteReview(id: string) {
  const sb = createClient()
  const { error } = await sb.from("reviews").delete().eq("id", id)
  if (error) throw new Error(`deleteReview: ${error.message}`)
  return { success: true }
}
