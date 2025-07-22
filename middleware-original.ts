import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

 const { auth: middleware } = NextAuth(authConfig)

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/register-admin',
  '/forgot-password',
  '/reset-password',
  "/api/auth/verify-email",
  '/tours/',
  '/tours',
  '/contact',
  '/api/locations',
  '/api/test-simple',
]

function isPublicRoute(pathname: string) {
  // Allow exact matches, any route under /public, and any dynamic /tour/[id] route
  return (
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/tours/') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/')
  );
}

export default middleware((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth?.user
  const userRole = auth?.user?.role

  // DEBUG LOGS para super-admin
  if (nextUrl.pathname.startsWith('/super-admin')) {
    console.log('🔍 MIDDLEWARE DEBUG - Ruta super-admin detectada:')
    console.log('  - Pathname:', nextUrl.pathname)
    console.log('  - isLoggedIn:', isLoggedIn)
    console.log('  - userRole:', userRole)
    console.log('  - auth.user:', auth?.user)
    
    if (!isLoggedIn || userRole !== 'superadmin') {
      console.log('❌ ACCESO DENEGADO - Redirigiendo a login')
      return NextResponse.redirect(new URL('/login', nextUrl))
    } else {
      console.log('✅ ACCESO PERMITIDO - Usuario super-admin verificado')
    }
  }

  // proteger rutas privadas
  if (!isPublicRoute(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()

})



// Config for middleware.ts
export const config = {
  matcher: [
    // Excluye rutas de autenticación de NextAuth y API de la protección del middleware
    '/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta para otras rutas API
    '/(api|trpc)(.*)',
  ],
}