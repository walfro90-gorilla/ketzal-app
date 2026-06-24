/**
 * Helper para refrescar la sesión de Supabase en cada request (App Router).
 *
 * AÚN NO está cableado al middleware.ts raíz (que hoy usa NextAuth). Cuando
 * se haga el swap completo a Supabase Auth, invocar `updateSession(request)`
 * desde middleware.ts para mantener viva la cookie de sesión. Se deja listo
 * para no acoplarlo antes de tiempo y no romper el flujo NextAuth actual.
 *
 * Ref: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: refresca el token. No metas lógica entre createServerClient y getUser.
  await supabase.auth.getUser()

  return supabaseResponse
}
