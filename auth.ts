import NextAuth from "next-auth"

// No necesitamos PrismaAdapter cuando usamos JWT strategy
// import { PrismaAdapter } from "@auth/prisma-adapter"

// IMPORTING AUTH CONFIG
import authConfig from "@/auth.config"
// import { db } from "@/lib/db"





export const { handlers, signIn, signOut, auth } = NextAuth({
  // No usar PrismaAdapter con JWT strategy
  // adapter: PrismaAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.role = user.role ?? ""
        token.supplierId = user.supplierId ?? ""
        token.id = user.id ?? ""
        
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.supplierId = token.supplierId;
        session.user.id = token.id;
      }
      // Agregar el JWT como accessToken para el frontend
      session.accessToken = token?.accessToken || token?.access_token || token?.jti || token?.sub || null;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role

      // Proteger rutas de super-admin
      if (nextUrl.pathname.startsWith('/super-admin')) {
        return isLoggedIn && userRole === 'superadmin'
      }

      // Permitir rutas públicas
      const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/register-admin',
        '/forgot-password',
        '/reset-password',
        '/api/auth/verify-email',
        '/tours/',
        '/tours',
        '/contact',
        '/api/locations',
        '/api/test-simple',
        '/store',
        '/store/',
        '/cart',
        '/cart/',
        // Flujo Supabase Auth (paralelo a NextAuth durante la migración).
        // /cuenta-sb se auto-protege: la página redirige a /login-sb si no hay
        // sesión Supabase; aquí solo evitamos que el middleware NextAuth la bloquee.
        '/login-sb',
        '/registro-sb',
        '/cuenta-sb',
      ]

      const isPublicRoute = publicRoutes.includes(nextUrl.pathname) ||
        nextUrl.pathname.startsWith('/public') ||
        nextUrl.pathname.startsWith('/tours/') ||
        nextUrl.pathname.startsWith('/api/auth') ||
        nextUrl.pathname.startsWith('/api/')

      if (isPublicRoute) {
        return true
      }

      // Para rutas protegidas, requiere login
      return isLoggedIn
    },
  },
})
