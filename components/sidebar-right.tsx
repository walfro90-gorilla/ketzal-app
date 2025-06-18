import * as React from "react";
// import { Plus } from "lucide-react";

// import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import ProfileCard from "./profile-card";
import ProfileCardNew from "./profile-card-new";
// import { get } from "http";
// import { getSupplier } from "@/app/(protected)/suppliers/suppliers.api";
import { useEffect, useState } from "react";
// import { set } from "date-fns";

// SidebarRight component
type SidebarRightProps = React.ComponentProps<typeof Sidebar> & {
  session: {
    user: {
      name: string;
      email: string;
      avatar: string;
      supplierId: string;
      role: "superadmin" | "admin" | "adminsup" | "user";
    };
    calendars: Array<{
      name: string;
      items: string[];
    }>;
  };
  supplierData: {
    name: string;
    imgLogo: string;
  }
};

export function SidebarRight({ session, supplierData, ...props }: SidebarRightProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (supplierData) {
      setIsLoading(false);
    }
    if (session) {
      setIsLoading(false);
    }
  }, [supplierData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show supplierData in console when component displays
  // console.log("supplierData:", supplierData);
  // console.log("Session:", session);
  // console.log("Supplier ID:", session.user.supplierId);
  // console.log("Role:", session.user.role);

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={{
          name: session?.user?.name || "Usuario",
          email: session?.user?.email || "Sin email",
          image: session?.user?.avatar || "/placeholder.svg",
          role: session?.user?.role || "user"
        }} />
      </SidebarHeader>
      <SidebarContent>

        {
          session.user.supplierId ? (
            <ProfileCard email="wal@gmail.com" name={supplierData.name} avatarUrl={supplierData.imgLogo} />
          ) : (
            <ProfileCardNew />
          )
        }

        <SidebarSeparator />
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        {/* <Calendars calendars={session.calendars} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              {/* <Plus />
              <span>New Calendar</span> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
