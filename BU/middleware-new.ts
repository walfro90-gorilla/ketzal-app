import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Solo logs para debugging
    console.log("🔍 MIDDLEWARE EJECUTÁNDOSE:", req.nextUrl.pathname)
    console.log("📋 USER ROLE:", req.nextauth.token?.role)
    
    // Verificar acceso a super-admin
    if (req.nextUrl.pathname.startsWith("/super-admin")) {
      const userRole = req.nextauth.token?.role
      console.log("🛡️ VERIFICANDO SUPER-ADMIN ACCESS:", userRole)
      
      if (userRole !== "superadmin") {
        console.log("❌ ACCESO DENEGADO - Rol incorrecto:", userRole)
        // withAuth se encarga de la redirección automáticamente
      } else {
        console.log("✅ ACCESO PERMITIDO - Super admin verificado")
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Para rutas super-admin, verificar rol específico
        if (req.nextUrl.pathname.startsWith("/super-admin")) {
          return token?.role === "superadmin"
        }
        
        // Para otras rutas protegidas, solo verificar que esté logueado
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*"
  ]
}
