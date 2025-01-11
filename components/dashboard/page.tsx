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

import { useUser } from "@/context/UserContext"
import { useEffect, useState } from "react"
import { set } from "date-fns"






export function Dashboard({ session, children }) {

  const { user, setUser } = useUser()
  const [supplier, setSupplier] = useState(null)
  const [supplierData, setSupplierData] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {

      setUser(session.user)
      setSupplier(session.user)

      if (session.user.supplierId === null) {
        return
      } else {
        const supplierDataDB = await getSupplier(session.user.supplierId)
        setSupplierData(supplierDataDB)
      }

    }
    fetchSession()
  }, [session.user, setUser])


  return (
    <div className="mt-24 flex flex-col h-screen">

      <SidebarProvider className="mt-12">
        <SidebarLeft user={session.user} />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      Ketzal admin - Hola, {session.user.name} 👋🏻
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div >
            {
              children
            }
          </div>
        </SidebarInset>
        <SidebarRight session={session} supplierData={supplierData} />
      </SidebarProvider>
    </div>
  )
}

