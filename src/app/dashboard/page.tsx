import { auth } from "@/auth"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
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

export default async function Page() {
  const session = await auth();
  const allowedRoles = ["admin", "superadmin", "adminsup"] as const;
  let user: { role: "admin" | "superadmin" | "adminsup"; supplierId: string; name: string; email: string; avatar: string };
  if (session?.user && allowedRoles.includes(session.user.role as any)) {
    user = {
      role: session.user.role as "admin" | "superadmin" | "adminsup",
      supplierId: session.user.supplierId || "",
      name: session.user.name || "",
      email: session.user.email || "",
      avatar: (session.user as any).avatar || ""
    };
  } else {
    user = { role: "admin", supplierId: "", name: "", email: "", avatar: "" };
  }
  return (
    <SidebarProvider>
      <SidebarLeft user={user} />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Panel de control - Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
      <SidebarRight session={{ user, calendars: [] }} supplierData={{ name: "", imgLogo: "" }} />
    </SidebarProvider>
  )
}
