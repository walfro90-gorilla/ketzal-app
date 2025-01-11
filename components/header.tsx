'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, ChevronDown } from 'lucide-react'
import { useScrollDirection } from '@/hooks/useScrollDirection'

// Import Link from 'next/link'
import Link from 'next/link'
import Image from 'next/image'

// Import components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TopBar from './TopBar'






const Header = ({ session }) => {
  
  const scrollDirection = useScrollDirection()
  const [showTopBar, setShowTopBar] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
      setShowTopBar(window.scrollY < 100)
      // console.log("SEsion for navbar: ", session)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* TopBar */}
      <div
        className={`transform transition-transform duration-300 ${showTopBar ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <TopBar session={session} />
      </div>

      {/* Main Navigation */}
      <div
        className={`bg-white shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
          }`}
        style={{
          transform: showTopBar ? 'translateY(0)' : 'translateY(-50px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-16 h-8">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/gorilla-labs-960a2.appspot.com/o/Ketzal.app-logo.svg?alt=media&token=cf6d2de8-39c7-4ba8-92dc-b6fbe9aef228"
                  alt="BookPro Logo"
                  layout="fill"
                  className="object-contain"
                />
              </div>
              {/* <span className="text-2xl font-bold text-green-600">Ketzal app</span> */}
            </Link>

            {/* Main Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-green-600 font-medium">Home</Link>
              <Link href="/tours" className="text-gray-600 hover:text-green-600">Tours</Link>

              <Link href="/blogs" className="text-gray-600 hover:text-green-600">Blogs</Link>

              <Link href="/contact" className="text-gray-600 hover:text-green-600">Contact</Link>

              {/* Pages Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-600 hover:text-green-600">
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/about">About Us</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href="/faq">FAQ</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </nav>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

