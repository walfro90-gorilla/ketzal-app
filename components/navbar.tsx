"use client"

import * as React from "react"
import { User, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.role === 'superadmin'

  return (
    <div className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-md">
      <NavigationMenu className="max-w-full w-full justify-end p-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-gray-300 hover:border-gray-100 transition-colors">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-gray-600 text-gray-200">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 text-gray-100 border border-gray-600">
                <DropdownMenuItem className="focus:bg-gray-700 focus:text-gray-100">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                {isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-600" />
                    <Link href="/super-admin">
                      <DropdownMenuItem className="focus:bg-gray-700 focus:text-gray-100 cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-blue-400" />
                        <span>Panel Super Admin</span>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem className="focus:bg-gray-700 focus:text-gray-100">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

