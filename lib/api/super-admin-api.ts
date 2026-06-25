// Panel super-admin sobre Supabase (schema `ketzal`).
// Patrón: extras jsonb en suppliers para flags isPending/isApproved, igual que
// la oficina de agencia. RLS exige superadmin (ketzal.is_superadmin()).
import { createClient } from "@/lib/supabase/client"

const SUPPLIER_SELECT =
  "id, name, contactEmail:contact_email, phoneNumber:phone_number, address, description," +
  " supplierType:supplier_type, extras, info, createdAt:created_at"

type SupplierAliased = {
  id: string | number
  name: string | null
  contactEmail: string | null
  phoneNumber: string | null
  address: string | null
  description: string | null
  supplierType: string | null
  extras: Record<string, unknown> | null
  info: Record<string, unknown> | null
  createdAt: string | null
}

export async function fetchSuppliers() {
  const sb = createClient()
  const { data, error } = await sb
    .from("suppliers")
    .select(SUPPLIER_SELECT)
    .order("created_at", { ascending: false })
    .returns<SupplierAliased[]>()
  if (error) throw new Error(`fetchSuppliers: ${error.message}`)
  return data ?? []
}

export async function fetchPendingAdminRequests() {
  const sb = createClient()
  const { data, error } = await sb
    .from("suppliers")
    .select(SUPPLIER_SELECT)
    .filter("extras->>isPending", "eq", "true")
    .order("created_at", { ascending: false })
    .returns<SupplierAliased[]>()
  if (error) throw new Error(`fetchPendingAdminRequests: ${error.message}`)
  return data ?? []
}

export async function approveSupplier(supplierId: string | number, userId: string | number) {
  const sb = createClient()
  // 1) leer extras actuales (jsonb merge)
  const { data: current, error: getErr } = await sb
    .from("suppliers")
    .select("extras")
    .eq("id", String(supplierId))
    .maybeSingle()
  if (getErr) throw new Error(`approveSupplier (read): ${getErr.message}`)
  const newExtras = {
    ...(current?.extras as Record<string, unknown> | null ?? {}),
    isApproved: true,
    isPending: false,
    approvedAt: new Date().toISOString(),
    approvedBy: "superadmin",
  }
  const { error: supErr } = await sb
    .from("suppliers")
    .update({ extras: newExtras })
    .eq("id", String(supplierId))
  if (supErr) throw new Error(`approveSupplier (supplier): ${supErr.message}`)
  // 2) promover usuario a admin
  const { error: profErr } = await sb
    .from("profiles")
    .update({ role: "admin", supplier_id: String(supplierId) })
    .eq("id", String(userId))
  if (profErr) throw new Error(`approveSupplier (profile): ${profErr.message}`)
  return { success: true }
}

export async function rejectSupplier(
  supplierId: string | number,
  _userId: string | number,
  reason?: string
) {
  void _userId
  const sb = createClient()
  const { data: current, error: getErr } = await sb
    .from("suppliers")
    .select("extras")
    .eq("id", String(supplierId))
    .maybeSingle()
  if (getErr) throw new Error(`rejectSupplier (read): ${getErr.message}`)
  const newExtras = {
    ...(current?.extras as Record<string, unknown> | null ?? {}),
    isApproved: false,
    isPending: false,
    rejectedAt: new Date().toISOString(),
    rejectedBy: "superadmin",
    rejectionReason: reason ?? "No especificada",
  }
  const { error } = await sb
    .from("suppliers")
    .update({ extras: newExtras })
    .eq("id", String(supplierId))
  if (error) throw new Error(`rejectSupplier: ${error.message}`)
  return { success: true }
}

export async function fetchSystemStats() {
  const sb = createClient()
  const [users, admins, superadmins, suppliers, services, pending, approved] = await Promise.all([
    sb.from("profiles").select("id", { head: true, count: "exact" }),
    sb.from("profiles").select("id", { head: true, count: "exact" }).eq("role", "admin"),
    sb.from("profiles").select("id", { head: true, count: "exact" }).eq("role", "superadmin"),
    sb.from("suppliers").select("id", { head: true, count: "exact" }),
    sb.from("services").select("id", { head: true, count: "exact" }),
    sb.from("suppliers").select("id", { head: true, count: "exact" }).filter("extras->>isPending", "eq", "true"),
    sb.from("suppliers").select("id", { head: true, count: "exact" }).filter("extras->>isApproved", "eq", "true"),
  ])
  return {
    totalUsers: users.count ?? 0,
    totalAdmins: admins.count ?? 0,
    superAdmins: superadmins.count ?? 0,
    totalSuppliers: suppliers.count ?? 0,
    totalServices: services.count ?? 0,
    pendingRequests: pending.count ?? 0,
    approvedSuppliers: approved.count ?? 0,
    rejectedSuppliers: (suppliers.count ?? 0) - (approved.count ?? 0) - (pending.count ?? 0),
  }
}
