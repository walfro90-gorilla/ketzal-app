import { updateSession } from "./lib/supabase/middleware"

// Solo Supabase: refresca la cookie de sesion en cada request del matcher.
// Las rutas protegidas se auto-gateean: las paginas server-side llaman
// auth() de @/lib/auth/server y redirigen si no hay sesion.
export default updateSession

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
