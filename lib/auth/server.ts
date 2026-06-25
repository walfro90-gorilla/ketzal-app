// Compat shim del `auth()` de NextAuth â€” usa Supabase Auth por debajo.
// Devuelve una shape compatible: { user: { id, email, name, image, role, supplierId } } | null
// + accessToken (token Supabase) para callers que lo consumen.
//
// Reemplaza: import { auth } from "@/lib/auth/server"   â†’   import { auth } from "@/lib/auth/server"
import { createClient } from "@/lib/supabase/server"

export type KetzalSession = {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    role: "user" | "admin" | "superadmin"
    supplierId: string | null
  }
  accessToken: string | null
  expires: string
}

export async function signOut(_opts?: { redirect?: boolean }) {
  void _opts
  const sb = await createClient()
  await sb.auth.signOut()
}

export async function auth(): Promise<KetzalSession | null> {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data: profile } = await sb
    .from("profiles")
    .select("name, role, supplier_id")
    .eq("id", user.id)
    .maybeSingle()
    .returns<{ name: string | null; role: "user" | "admin" | "superadmin"; supplier_id: string | null }>()

  const { data: { session } } = await sb.auth.getSession()

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      name: profile?.name ?? user.email ?? null,
      image: null,
      role: profile?.role ?? "user",
      supplierId: profile?.supplier_id ?? null,
    },
    accessToken: session?.access_token ?? null,
    expires: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : "",
  }
}
