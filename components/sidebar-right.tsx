import * as React from "react";
import { Plus } from "lucide-react";

import { Calendars } from "@/components/calendars";
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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import ProfileCard from "./profile-card";

type SidebarRightProps = React.ComponentProps<typeof Sidebar> & {
  session: {
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    calendars: Array<{
      name: string;
      items: string[];
    }>;
  };
};

export function SidebarRight({ session, ...props }: SidebarRightProps) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={session.user} />
      </SidebarHeader>
      <SidebarContent>
        <ProfileCard email="wal@gmail.com" name="wal" avatarUrl="https://firebasestorage.googleapis.com/v0/b/gorilla-labs-960a2.appspot.com/o/wanderLogo.svg?alt=media&token=e4e14aca-db48-4ad5-b0a0-95e07cbef02b"/>
        <SidebarSeparator/>
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
