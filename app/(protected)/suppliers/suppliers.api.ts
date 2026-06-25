// Suppliers sobre Supabase (schema `ketzal`).
// Mantiene el alias `type = supplier_type` para compat con el frontend viejo.
import { createClient } from "@/lib/supabase/client"

type SupplierAliased = {
  id: string
  name: string
  contactEmail: string | null
  phoneNumber: string | null
  address: string | null
  description: string | null
  imgLogo: string | null
  type: string | null
  supplierType: string | null
  supplierSubType: string | null
  location: unknown
  photos: unknown
  extras: unknown
  info: unknown
  createdAt: string | null
  updatedAt: string | null
}

type SupplierDuplicateRow = {
  id: string
  name: string
  contactEmail: string | null
}

const SUPPLIER_SELECT =
  "id, name, contactEmail:contact_email, phoneNumber:phone_number, address, description," +
  " imgLogo:img_logo, type:supplier_type, supplierType:supplier_type, supplierSubType:supplier_sub_type," +
  " location, photos, extras, info, createdAt:created_at, updatedAt:updated_at"

export async function getSuppliers() {
  const sb = createClient()
  const { data, error } = await sb
    .from("suppliers")
    .select(SUPPLIER_SELECT)
    .order("created_at", { ascending: false })
    .returns<SupplierAliased[]>()
  if (error) throw new Error(`getSuppliers: ${error.message}`)
  return data ?? []
}

export async function getSupplier(id: string | number | null | undefined) {
  if (!id) return null
  const sb = createClient()
  const { data, error } = await sb
    .from("suppliers")
    .select(SUPPLIER_SELECT)
    .eq("id", String(id))
    .maybeSingle()
    .returns<SupplierAliased>()
  if (error) throw new Error(`getSupplier: ${error.message}`)
  return data
}

export async function searchSuppliers(name?: string, email?: string) {
  const sb = createClient()
  let q = sb.from("suppliers").select(SUPPLIER_SELECT).limit(20)
  if (name) q = q.ilike("name", `%${name}%`)
  if (email) q = q.ilike("contact_email", `%${email}%`)
  const { data, error } = await q.returns<SupplierAliased[]>()
  if (error) throw new Error(`searchSuppliers: ${error.message}`)
  return data ?? []
}

export async function checkDuplicateSupplier(name?: string, email?: string, excludeId?: string) {
  const sb = createClient()
  const fallbackId = "00000000-0000-0000-0000-000000000000"
  const excl = excludeId || fallbackId
  const [byName, byEmail] = await Promise.all([
    name
      ? sb
          .from("suppliers")
          .select("id, name, contactEmail:contact_email")
          .eq("name", name)
          .neq("id", excl)
          .returns<SupplierDuplicateRow[]>()
      : Promise.resolve({ data: [] as SupplierDuplicateRow[], error: null }),
    email
      ? sb
          .from("suppliers")
          .select("id, name, contactEmail:contact_email")
          .eq("contact_email", email)
          .neq("id", excl)
          .returns<SupplierDuplicateRow[]>()
      : Promise.resolve({ data: [] as SupplierDuplicateRow[], error: null }),
  ])
  if (byName.error) throw new Error(`checkDuplicateSupplier: ${byName.error.message}`)
  if (byEmail.error) throw new Error(`checkDuplicateSupplier: ${byEmail.error.message}`)
  const nameRows = (byName.data ?? []) as SupplierDuplicateRow[]
  const emailRows = (byEmail.data ?? []) as SupplierDuplicateRow[]
  const merged: Array<{ id: string; name: string; contactEmail: string }> = [
    ...nameRows,
    ...emailRows,
  ].map((r) => ({ id: r.id, name: r.name, contactEmail: r.contactEmail ?? "" }))
  return {
    nameExists: nameRows.length > 0,
    emailExists: emailRows.length > 0,
    existingSuppliers: merged,
  }
}

// CREATE: solo superadmin por RLS.
export async function createSupplier(input: Record<string, unknown>) {
  const sb = createClient()
  const row: Record<string, unknown> = {
    name: input.name,
    contact_email: input.contactEmail ?? input.contact_email,
    phone_number: input.phoneNumber ?? input.phone_number,
    address: input.address,
    description: input.description,
    img_logo: input.imgLogo ?? input.img_logo,
    supplier_type: input.supplierType ?? input.type ?? input.supplier_type,
    supplier_sub_type: input.supplierSubType ?? input.supplier_sub_type,
    location: input.location,
    photos: input.photos,
    extras: input.extras,
    info: input.info,
  }
  const { data, error } = await sb
    .from("suppliers")
    .insert(row as never)
    .select(SUPPLIER_SELECT)
    .single()
    .returns<SupplierAliased>()
  if (error) throw new Error(`createSupplier: ${error.message}`)
  return data
}

export async function updateSupplier(id: string, input: Record<string, unknown>) {
  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.contactEmail !== undefined) patch.contact_email = input.contactEmail
  if (input.phoneNumber !== undefined) patch.phone_number = input.phoneNumber
  if (input.address !== undefined) patch.address = input.address
  if (input.description !== undefined) patch.description = input.description
  if (input.imgLogo !== undefined) patch.img_logo = input.imgLogo
  if (input.supplierType !== undefined || input.type !== undefined)
    patch.supplier_type = (input.supplierType ?? input.type) as string
  if (input.supplierSubType !== undefined) patch.supplier_sub_type = input.supplierSubType
  if (input.location !== undefined) patch.location = input.location
  if (input.photos !== undefined) patch.photos = input.photos
  if (input.extras !== undefined) patch.extras = input.extras
  if (input.info !== undefined) patch.info = input.info
  const sb = createClient()
  const { data, error } = await sb
    .from("suppliers")
    .update(patch as never)
    .eq("id", id)
    .select(SUPPLIER_SELECT)
    .single()
    .returns<SupplierAliased>()
  if (error) throw new Error(`updateSupplier: ${error.message}`)
  return data
}

export async function checkSupplierDependencies(id: string) {
  const sb = createClient()
  const [services, transport, hotel, users] = await Promise.all([
    sb.from("services").select("id", { head: true, count: "exact" }).eq("supplier_id", id),
    sb.from("services").select("id", { head: true, count: "exact" }).eq("transport_provider_id", id),
    sb.from("services").select("id", { head: true, count: "exact" }).eq("hotel_provider_id", id),
    sb.from("profiles").select("id", { head: true, count: "exact" }).eq("supplier_id", id),
  ])
  const supplier = await getSupplier(id)
  const sCount = services.count ?? 0
  const tCount = transport.count ?? 0
  const hCount = hotel.count ?? 0
  const uCount = users.count ?? 0
  const total = sCount + tCount + hCount + uCount
  return {
    supplier,
    services: Array.from({ length: sCount }),
    transportServices: Array.from({ length: tCount }),
    hotelServices: Array.from({ length: hCount }),
    users: Array.from({ length: uCount }),
    totalDependencies: total,
    canDelete: total === 0,
  }
}

export async function deleteSupplier(id: string) {
  const deps = await checkSupplierDependencies(id)
  if (!deps.canDelete) {
    const name = (deps.supplier as { name?: string } | null)?.name ?? id
    throw new Error(
      `Cannot delete supplier "${name}". It has ${deps.totalDependencies} dependencies: ` +
        `${deps.services.length} services, ${deps.users.length} users, ` +
        `${deps.transportServices.length} transport services, ${deps.hotelServices.length} hotel services.`
    )
  }
  const sb = createClient()
  const { error } = await sb.from("suppliers").delete().eq("id", id)
  if (error) throw new Error(`deleteSupplier: ${error.message}`)
  return { success: true }
}
