import { signOut } from "@/lib/auth/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await signOut({ redirect: false })
    
    return NextResponse.json({
      success: true,
      message: "SesiÃ³n cerrada exitosamente"
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ 
      error: "Error cerrando sesiÃ³n",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
