'use client'

import { Facebook, Twitter, Linkedin, Globe, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

const TopBar = () => {
  return (
    <div className="bg-green-600 text-white py-2 transition-transform duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                <Globe className="h-4 w-4 mr-1" />
                English
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                $ USD
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>$ USD</DropdownMenuItem>
              <DropdownMenuItem>€ EUR</DropdownMenuItem>
              <DropdownMenuItem>£ GBP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          {/* Social Media Links */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>

          {/* Login Button */}
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
            <Link href="/login">
              Login
            </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}

export default TopBar

