'use client'

import { Facebook,  Globe, ChevronDown, User,  Instagram, Youtube, LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Popover } from 'antd'
import { Session } from 'next-auth'

import { useLoading } from '@/components/LoadingContext'
// import { useEffect } from 'react'
// import { set } from 'date-fns'

const TopBar = ({ session }: { session: Session | null }) => {

  useLoading();

  // useEffect(() => {
  //   setLoading(true)

  // }, [])

  const content = (
    <div>
      <Link href={"/home"}>
        <div className="flex items-center">
          <LayoutDashboard className="h-4 w-4 mr-1" />
          Dashboard
        </div>
      </Link>
      <br />
      <Link href={""} onClick={async () => await signOut()}>
        <div className="flex items-center">
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </div>

      </Link>

    </div>
  );
  // console.log("SEssion in topbar: ", session)

  return (
    <div className="bg-green-600 text-white py-2 transition-transform duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                <Globe className="h-4 w-4 mr-1" />
                Latino
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem>Latino</DropdownMenuItem> */}
              <DropdownMenuItem disabled >English</DropdownMenuItem>
              <DropdownMenuItem disabled>中国人</DropdownMenuItem>
              <DropdownMenuItem disabled>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                $ MXN
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled >$ USD</DropdownMenuItem>
              <DropdownMenuItem disabled >€ EUR</DropdownMenuItem>
              <DropdownMenuItem disabled >£ GBP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          {/* Social Media Links */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-green-700"
              onClick={() => window.open('https://www.facebook.com/ketzal.app.mx', '_blank')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>

          {/* Login Button */}
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
            {
              !session ? (
                <Link href="/login">
                  <div className="flex items-center">

                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </div>
                </Link>
              ) : (
                <Link href={""} >
                  <Popover placement="bottom" content={content}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" /> {session.user?.name || "Invitado"} - {session.user.role}
                    </div>
                  </Popover>

                </Link>
              )
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TopBar

