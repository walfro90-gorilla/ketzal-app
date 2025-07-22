export { auth as middleware } from "./auth"

export const config = {
  matcher: [
    // Proteger rutas específicas
    "/super-admin/:path*",
    "/dashboard/:path*", 
    "/profile/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}