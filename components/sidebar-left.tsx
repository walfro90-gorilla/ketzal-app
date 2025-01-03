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
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
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
      title: "Services & Tours",
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
    // {
    //   title: "Calendar",
    //   url: "#",
    //   icon: Calendar,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    // },
    // {
    //   title: "Templates",
    //   url: "#",
    //   icon: Blocks,
    // },
    // {
    //   title: "Trash",
    //   url: "#",
    //   icon: Trash2,
    // },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  workspaces: [
    {
      name: "Services & Tours",
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
    // {
    //   name: "Personal Life Management",
    //   emoji: "🏠",
    //   pages: [
    //     {
    //       name: "Daily Journal & Reflection",
    //       url: "#",
    //       emoji: "📔",
    //     },
    //     {
    //       name: "Health & Wellness Tracker",
    //       url: "#",
    //       emoji: "🍏",
    //     },
    //     {
    //       name: "Personal Growth & Learning Goals",
    //       url: "#",
    //       emoji: "🌟",
    //     },
    //   ],
    // },
    // {
    //   name: "Professional Development",
    //   emoji: "💼",
    //   pages: [
    //     {
    //       name: "Career Objectives & Milestones",
    //       url: "#",
    //       emoji: "🎯",
    //     },
    //     {
    //       name: "Skill Acquisition & Training Log",
    //       url: "#",
    //       emoji: "🧠",
    //     },
    //     {
    //       name: "Networking Contacts & Events",
    //       url: "#",
    //       emoji: "🤝",
    //     },
    //   ],
    // },
    // {
    //   name: "Creative Projects",
    //   emoji: "🎨",
    //   pages: [
    //     {
    //       name: "Writing Ideas & Story Outlines",
    //       url: "#",
    //       emoji: "✍️",
    //     },
    //     {
    //       name: "Art & Design Portfolio",
    //       url: "#",
    //       emoji: "🖼️",
    //     },
    //     {
    //       name: "Music Composition & Practice Log",
    //       url: "#",
    //       emoji: "🎵",
    //     },
    //   ],
    // },
    // {
    //   name: "Home Management",
    //   emoji: "🏡",
    //   pages: [
    //     {
    //       name: "Household Budget & Expense Tracking",
    //       url: "#",
    //       emoji: "💰",
    //     },
    //     {
    //       name: "Home Maintenance Schedule & Tasks",
    //       url: "#",
    //       emoji: "🔧",
    //     },
    //     {
    //       name: "Family Calendar & Event Planning",
    //       url: "#",
    //       emoji: "📅",
    //     },
    //   ],
    // },

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
    // {
    //   name: "Family Recipe Collection & Meal Planning",
    //   url: "#",
    //   emoji: "🍳",
    // },
    // {
    //   name: "Fitness Tracker & Workout Routines",
    //   url: "#",
    //   emoji: "💪",
    // },
    // {
    //   name: "Book Notes & Reading List",
    //   url: "#",
    //   emoji: "📚",
    // },
    // {
    //   name: "Sustainable Gardening Tips & Plant Care",
    //   url: "#",
    //   emoji: "🌱",
    // },
    // {
    //   name: "Language Learning Progress & Resources",
    //   url: "#",
    //   emoji: "🗣️",
    // },
    // {
    //   name: "Home Renovation Ideas & Budget Tracker",
    //   url: "#",
    //   emoji: "🏠",
    // },
    // {
    //   name: "Personal Finance & Investment Portfolio",
    //   url: "#",
    //   emoji: "💰",
    // },
    // {
    //   name: "Movie & TV Show Watchlist with Reviews",
    //   url: "#",
    //   emoji: "🎬",
    // },

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
      title: "Services & Tours",
      url: "/services",
      icon: Plane,
    },

  ],
}

export function SidebarLeft({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & { role: "admin" | "superadmin" }) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />

        {role === "superadmin" ? (
          <NavMain items={data.navMain} />
        ) : (
          <NavMain items={dataAdmin.navMain} />
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
