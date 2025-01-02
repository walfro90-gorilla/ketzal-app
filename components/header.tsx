"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

const Logo = () => (
  <div className="logo-box">
    <div className="logo">
      <Link href="">
        <Image src="https://firebasestorage.googleapis.com/v0/b/gorilla-labs-960a2.appspot.com/o/Ketzal.app-logo.svg?alt=media&token=cf6d2de8-39c7-4ba8-92dc-b6fbe9aef228" alt="logo" width={90} height={350} />
      </Link>
    </div>
  </div>
)

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <NavigationMenuItem>
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink className="block py-2 px-4 text-sm hover:bg-gray-100">
        {children}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
)

const LanguageSelector = () => (
  <div className="language">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <i className="fa-thin fa-globe"></i>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="p-2 w-48">
              <li>
                <Link href="" className="flex items-center p-2 hover:bg-gray-100">
                  <Image src="" alt="English" width={20} height={20} className="mr-2" />
                  <span>English</span>
                </Link>
              </li>
              <li>
                <Link href="" className="flex items-center p-2 hover:bg-gray-100">
                  <Image src="" alt="Spanish" width={20} height={20} className="mr-2" />
                  <span>Spanish</span>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/destinations", label: "Destinations" },
    { href: "/packages", label: "Packages" },
    { href: "/faqs", label: "Faqs" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className={`main-header header-style-two bg-green-700/80 backdrop-blur-sm ${isScrolled ? 'fixed-header' : ''}`}>
      <div className={`header-lower ${isScrolled ? 'sticky-header animated slideInDown bg-transparent' : ''}`}>
        <div className="custom-container mx-auto px-4">
          <div className="inner-container flex items-center justify-between py-4">
            <div className="left-column">
              <Logo />
            </div>
            <div className="middle-column hidden lg:flex items-center">
              <nav className="main-menu">
                <NavigationMenu>
                  <NavigationMenuList>
                    {navItems.map((item) => (
                      <NavItem key={item.href} href={item.href}>{item.label}</NavItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>
            </div>
            <div className="right-column flex items-center">
              <LanguageSelector />
              <div className="sign-up ml-4 flex">
                <Button asChild variant="outline" className="mr-2">
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
              <div className="lg:hidden ml-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Image src="" alt="Menu" width={24} height={24} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="py-2 px-4 hover:bg-gray-100">
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto pt-6">
                      <div className="social-links flex justify-center space-x-4">
                        <a href="#" className="text-white hover:text-gray-900"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-white hover:text-gray-900"><i className="fab fa-facebook-square"></i></a>
                        <a href="#" className="text-white hover:text-gray-900"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="text-white hover:text-gray-900"><i className="fab fa-instagram"></i></a>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

