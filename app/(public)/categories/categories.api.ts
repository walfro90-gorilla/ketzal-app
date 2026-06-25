// Categories sobre Supabase. El campo `link` no existe en DB — se deriva
// client-side para compat con `PopularCategories`.
import { createClient } from "@/lib/supabase/client"

export interface Category {
  id?: string
  name: string
  image: string
  link: string
  description?: string
}

type CategoryRow = { id: string; name: string; image: string | null; description: string | null }

function withLink(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? "",
    description: row.description ?? undefined,
    link: `/tours?cat=${encodeURIComponent(row.name)}`,
  }
}

export async function getCategories(): Promise<Category[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from("categories")
    .select("id, name, image, description")
    .order("name")
  if (error) throw new Error(`getCategories: ${error.message}`)
  return (data ?? []).map(withLink)
}

export async function getCategory(id: string): Promise<Category | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from("categories")
    .select("id, name, image, description")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(`getCategory: ${error.message}`)
  return data ? withLink(data) : null
}

// CREATE/UPDATE/DELETE: RLS exige superadmin.
export async function createCategory(input: Omit<Category, "id" | "link">): Promise<Category> {
  const sb = createClient()
  const { data, error } = await sb
    .from("categories")
    .insert({ name: input.name, image: input.image, description: input.description } as never)
    .select("id, name, image, description")
    .single()
  if (error) throw new Error(`createCategory: ${error.message}`)
  return withLink(data)
}

export async function updateCategory(id: string, input: Partial<Category>): Promise<Category> {
  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.image !== undefined) patch.image = input.image
  if (input.description !== undefined) patch.description = input.description
  const sb = createClient()
  const { data, error } = await sb
    .from("categories")
    .update(patch as never)
    .eq("id", id)
    .select("id, name, image, description")
    .single()
  if (error) throw new Error(`updateCategory: ${error.message}`)
  return withLink(data)
}

export async function deleteCategory(id: string) {
  const sb = createClient()
  const { error } = await sb.from("categories").delete().eq("id", id)
  if (error) throw new Error(`deleteCategory: ${error.message}`)
  return { success: true }
}
