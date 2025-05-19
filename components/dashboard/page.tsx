"use client"


import { getSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { SidebarLeft } from "../sidebar-left"
import { SidebarRight } from "../sidebar-right"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// import { useUser } from "@/context/UserContext"
import { useEffect, useState, ReactNode } from "react"
// import { set } from "date-fns"

interface SessionType {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    supplierId: string
    role: "superadmin" | "admin" | "adminsup"
  }
  calendars: Array<{
    name: string
    items: string[]
  }>
}

interface DashboardProps {
  session: SessionType // Replace 'any' with your actual session type if available
  children: ReactNode
}

export function Dashboard({ session, children }: DashboardProps) {

  // const { user, setUser } = useUser()
  // const [supplier, setSupplier] = useState<SessionType["user"] | null>(null)
  const [supplierData, setSupplierData] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {

      // setUser(session.user)
      // setSupplier(session.user)

      if (session.user.supplierId === null) {
        return
      } else {
        const supplierDataDB = await getSupplier(session.user.supplierId)
        setSupplierData(supplierDataDB)
      }

    }
    fetchSession()
  }, [session.user])


  return (
    <div className="mt-12 flex flex-col h-screen">
      <SidebarProvider className="mt-12">
        <SidebarLeft user={{
          role: session.user.role || "admin",
          supplierId: session.user?.supplierId || ""
        }} />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      Ketzal admin - Hola, {session.user?.name || "Usuario"} 👋🏻
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div>
            {children}
          </div>
        </SidebarInset>
        <SidebarRight session={session} supplierData={supplierData || { name: "", imgLogo: "" }} />
      </SidebarProvider>
    </div>
  )
}

