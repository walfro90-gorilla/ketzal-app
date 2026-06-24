import { auth } from "./auth"
import { updateSession } from "./lib/supabase/middleware"

// Compone: NextAuth gatea rutas (callback `authorized`); cuando deja pasar,
// refrescamos la cookie de sesión de Supabase. Cuando NextAuth redirige,
// no llega aquí — y como no hay sesión, no hay nada que refrescar.
// ponytail: composición mínima; cuando se retire NextAuth queda solo updateSession.
export default auth(async (req) => {
  return await updateSession(req)
})

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
