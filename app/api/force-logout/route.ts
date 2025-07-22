import { signOut } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await signOut({ redirect: false })
    
    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente"
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ 
      error: "Error cerrando sesión",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
