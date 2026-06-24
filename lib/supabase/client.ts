/**
 * Cliente Supabase para componentes de navegador ("use client").
 * Sesión basada en cookies vía @supabase/ssr (App Router).
 *
 *   const supabase = createClient()
 *   const { data } = await supabase.from('services').select('*')  // schema 'ketzal' (default expuesto)
 */
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

export function createClient() {
  return createBrowserClient<Database, "ketzal">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "ketzal" } }
  )
}
