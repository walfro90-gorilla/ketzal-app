"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Plane,
  Handshake,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"



// This is SUPERADMIN data.
const data = {
  teams: [
    {
      name: "Ketzal app",
      logo: Command,
      plan: "Enterprise",
    },

  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: Handshake,
      badge: "10",
    },
    {
      title: "Services",
      url: "/services",
      icon: Plane,
    },
    {
      title: "Users",
      url: "/users",
      icon: Settings2,
    },
    {
      title: "Products",
      url: "/products",
      icon: Sparkles,
    },

  ],
  navSecondary: [
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  workspaces: [
    {
      name: "Services",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },


  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },


  ],
}

// This is ADMIN data.
const dataAdmin = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Services",
      url: "/services",
      icon: Plane,
    },

  ],
}
// This is ADMIN data.
const dataAdminSup = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },

  ],
}

export function SidebarLeft({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    role: "superadmin" | "admin" | "adminsup"
    supplierId: string
  }
}) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />

        {user.role === "superadmin" ? (
          <NavMain items={data.navMain} />
        ) : (
          user.supplierId === null ? (
            <NavMain items={dataAdminSup.navMain} />
          ) : (
            <NavMain items={dataAdmin.navMain} />
          )
        )}

      </SidebarHeader>
      <SidebarContent>
        {/* <NavWorkspaces workspaces={data.workspaces} /> */}
        {/* <NavFavorites favorites={data.favorites} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
