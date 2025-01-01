import { ProductCard } from "@/components/product-card"
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

import { getProducts } from "../../app/(protected)/products/products.api"





export async function Dashboard({children}) {
  const products = await getProducts()


  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Dashboard - Panel de control
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
         
         {
          children
         }
            {/* {
              products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            } */}
          
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}

