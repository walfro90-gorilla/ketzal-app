/**
 * Cliente Supabase para Server Components / Server Actions / Route Handlers.
 * Lee y escribe la sesión en cookies (App Router, Next 15 — cookies() es async).
 *
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 */
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import ws from "ws"
import type { Database } from "./database.types"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database, "ketzal">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "ketzal" },
      // Node < 22 no trae WebSocket nativo; supabase-js construye el cliente
      // realtime al instanciar. En el server (Node) le damos `ws`. El browser
      // y el middleware (Edge) usan el WebSocket nativo y no lo necesitan.
      // Cast: `ws` cumple el contrato en runtime; su tipo no coincide 1:1 con
      // el WebSocket del DOM que espera supabase-js.
      realtime: { transport: ws as unknown as typeof WebSocket },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Invocado desde un Server Component (no puede escribir cookies).
            // Si el middleware refresca la sesión, se puede ignorar.
          }
        },
      },
    }
  )
}
