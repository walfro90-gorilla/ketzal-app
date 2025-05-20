'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
// import { useScrollDirection } from '@/hooks/useScrollDirection'

// Import Link from 'next/link'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth' // Import the Session type

// Import components
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TopBar from './TopBar'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  session: Session | null; // Use the Session type or null if session can be absent
}

const Header = ({ session }: HeaderProps) => {
  
  // const scrollDirection = useScrollDirection()
  const [showTopBar, setShowTopBar] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
      setShowTopBar(window.scrollY < 100)
      console.log("SEsion for navbar: ", session)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* TopBar */}
      <div
        className={`transform transition-transform duration-300 ${showTopBar ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <TopBar session={session} />
      </div>

      {/* Main Navigation */}
      <div
        className={`bg-white dark:bg-zinc-900 shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
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
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'contain' }}
                  className="object-contain"
                />
              </div>
              {/* <span className="text-2xl font-bold text-green-600">Ketzal app</span> */}
            </Link>

            {/* Main Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-200 font-medium">Inicio</Link>
              <Link href="/tours" className="text-gray-600 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">Tours</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">Contacto</Link>
              {/* <div className="ml-4"><ThemeToggle /></div> */}
            </nav>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {/* <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-200" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu((v) => !v)}
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {isMounted && showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setShowMobileMenu(false)} />
        )}
        {/* Mobile Menu Drawer */}
        {isMounted && (
          <div
            className={`fixed top-0 right-0 z-50 w-3/4 max-w-xs h-full bg-background text-foreground shadow-lg transform transition-transform duration-300 md:hidden ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ willChange: 'transform' }}
          >
            <div className="flex flex-col h-full p-6 space-y-6">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} aria-label="Cerrar menú">
                  <span className="text-2xl text-gray-600 dark:text-gray-200">×</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-foreground text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Inicio</Link>
                <Link href="/tours" className="text-foreground text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Tours</Link>
                <Link href="/contact" className="text-foreground text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Contacto</Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

