import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      authenticated: !!session?.user,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        supplierId: session.user.supplierId,
      } : null,
      debug: {
        session: session ? "Session exists" : "No session found",
        userRole: session?.user?.role || "No role",
      }
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json({ 
      error: "Error getting session",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
