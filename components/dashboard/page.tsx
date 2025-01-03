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






export async function Dashboard({ session, children }) {



  return (
    <SidebarProvider>
      <SidebarLeft role={session.user.role} />
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
      <SidebarRight session={session} />
    </SidebarProvider>
  )
}

