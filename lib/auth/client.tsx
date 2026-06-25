"use client"

// Compat shim de `next-auth/react` â€” drop-in para useSession/signOut/SessionProvider.
// Por debajo usa @supabase/supabase-js (createBrowserClient).
//
// Reemplaza el viejo cliente NextAuth React por este modulo.
import { useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

export type SessionUser = {
  id: string
  email: string
  name: string | null
  image: string | null
  role: "user" | "admin" | "superadmin"
  supplierId: string | null
}
export type Session = {
  user: SessionUser
  /** Token Supabase de la sesion actual. Disponible para callers legacy. */
  accessToken: string | null
  expires: string
} | null
export type SessionStatus = "loading" | "authenticated" | "unauthenticated"

type ProfileRow = { name: string | null; role: SessionUser["role"]; supplier_id: string | null }

async function loadSession(): Promise<Session> {
  const sb = createClient()
  const [{ data: { user } }, { data: { session: sbSession } }] = await Promise.all([
    sb.auth.getUser(),
    sb.auth.getSession(),
  ])
  if (!user) return null
  const { data: profile } = await sb
    .from("profiles")
    .select("name, role, supplier_id")
    .eq("id", user.id)
    .maybeSingle()
    .returns<ProfileRow>()
  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      name: profile?.name ?? user.email ?? null,
      image: null,
      role: profile?.role ?? "user",
      supplierId: profile?.supplier_id ?? null,
    },
    accessToken: sbSession?.access_token ?? null,
    expires: sbSession?.expires_at ? new Date(sbSession.expires_at * 1000).toISOString() : "",
  }
}

export function useSession(): { data: Session; status: SessionStatus } {
  const [data, setData] = useState<Session>(null)
  const [status, setStatus] = useState<SessionStatus>("loading")

  useEffect(() => {
    let active = true
    async function refresh() {
      const s = await loadSession()
      if (!active) return
      setData(s)
      setStatus(s ? "authenticated" : "unauthenticated")
    }
    refresh()
    const sb = createClient()
    const { data: { subscription } } = sb.auth.onAuthStateChange(() => { refresh() })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  return { data, status }
}

export async function signOut(opts?: { callbackUrl?: string; redirect?: boolean }) {
  const sb = createClient()
  await sb.auth.signOut()
  if (opts?.redirect !== false) {
    window.location.assign(opts?.callbackUrl ?? "/")
  }
}

// signIn no se usa con flujo Supabase (las pÃ¡ginas /login-sb manejan el form
// directamente). Stub para que los imports no rompan; lanza si se llama.
export async function signIn(_provider?: string, _options?: Record<string, unknown>) {
  void _provider; void _options
  throw new Error("signIn() de next-auth deprecated â€” usa el form en /login (Supabase)")
}

// SessionProvider: con Supabase no necesitamos context wrapper (useSession lee
// directo del cliente Supabase). Passthrough para compat con app/layout.tsx.
export function SessionProvider({ children }: { children: ReactNode; session?: unknown }) {
  return <>{children}</>
}
