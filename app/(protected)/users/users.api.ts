// Users sobre Supabase. Datos vienen de `ketzal.profiles` (1:1 con auth.users).
// El cliente no puede leer auth.users directamente (RLS), así que `password`
// y `emailVerified` se quedan undefined/null en la shape devuelta.
import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  name: string | null
  email: string
  password?: string
  emailVerified: Date | null
  image: string | null
  role: "user" | "admin" | "superadmin"
  supplierId: number | string | null
  supplier?: {
    id: number | string
    name: string
    contactEmail: string
  } | null
  createdAt: Date
}

const PROFILE_SELECT =
  "id, name, email, image, role, supplierId:supplier_id, createdAt:created_at," +
  " supplier:suppliers(id, name, contactEmail:contact_email)"

type Row = {
  id: string
  name: string | null
  email: string
  image: string | null
  role: User["role"]
  supplierId: string | null
  createdAt: string
  supplier: { id: string; name: string; contactEmail: string } | null
}

function toUser(r: Row): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    image: r.image,
    role: r.role,
    supplierId: r.supplierId,
    supplier: r.supplier,
    createdAt: new Date(r.createdAt),
    emailVerified: null, // vive en auth.users, no expuesto
  }
}

export async function getUsers(): Promise<User[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from("profiles")
    .select(PROFILE_SELECT)
    .order("created_at", { ascending: false })
    .returns<Row[]>()
  if (error) throw new Error(`getUsers: ${error.message}`)
  return data?.map(toUser) ?? []
}

export async function getUser(id: string): Promise<User | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<Row>()
  if (error) throw new Error(`getUser: ${error.message}`)
  return data ? toUser(data) : null
}

export async function searchUsers(name?: string, email?: string): Promise<User[]> {
  const sb = createClient()
  let q = sb.from("profiles").select(PROFILE_SELECT).limit(20)
  if (name) q = q.ilike("name", `%${name}%`)
  if (email) q = q.ilike("email", `%${email}%`)
  const { data, error } = await q.returns<Row[]>()
  if (error) throw new Error(`searchUsers: ${error.message}`)
  return data?.map(toUser) ?? []
}

// UPDATE: solo el dueño puede editar su perfil; superadmin puede tocar role.
export async function updateUser(id: string, input: Partial<User> & Record<string, unknown>) {
  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.image !== undefined) patch.image = input.image
  if (input.role !== undefined) patch.role = input.role
  if (input.supplierId !== undefined)
    patch.supplier_id = input.supplierId === null ? null : String(input.supplierId)
  const sb = createClient()
  const { data, error } = await sb
    .from("profiles")
    .update(patch as never)
    .eq("id", id)
    .select(PROFILE_SELECT)
    .maybeSingle()
    .returns<Row>()
  if (error) throw new Error(`updateUser: ${error.message}`)
  return data ? toUser(data) : null
}

// CREATE: el alta canónica es `supabase.auth.signUp` con app:'ketzal'; el
// trigger crea el perfil. Esta función queda como no-op compat para no romper
// callers viejos — la auth pasa por lib/supabase/auth-actions.
export async function createUser(_userData: unknown) {
  void _userData
  throw new Error("createUser deprecated: usa ketzalSignUp() de lib/supabase/auth-actions")
}

// DELETE: borrar el profile cascadea desde auth.users. Aquí solo aceptamos
// borrado cuando ya no hay deps (el caller decide).
export async function deleteUser(id: string) {
  const sb = createClient()
  const { error } = await sb.from("profiles").delete().eq("id", id)
  if (error) throw new Error(`deleteUser: ${error.message}`)
  return { success: true }
}
