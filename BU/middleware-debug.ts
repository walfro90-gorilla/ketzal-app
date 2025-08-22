import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log('🔍 MIDDLEWARE ACTIVADO - Ruta:', request.nextUrl.pathname)
  
  // Si es la ruta super-admin, mostrar información detallada
  if (request.nextUrl.pathname.startsWith('/super-admin')) {
    console.log('🛡️ RUTA SUPER-ADMIN DETECTADA')
    
    // Verificar headers
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    console.log('📋 HEADERS:')
    console.log('  - Authorization:', authHeader)
    console.log('  - Cookies:', cookieHeader ? 'Presentes' : 'Ausentes')
    
    // Por ahora, permitir el acceso para debugging
    console.log('✅ PERMITIENDO ACCESO TEMPORALMENTE PARA DEBUG')
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Configuración simplificada para testing
    '/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
