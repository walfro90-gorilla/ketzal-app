"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Globe, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0B3F0B] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/gorilla-labs-960a2.appspot.com/o/Ketzal.app-logo.svg?alt=media&token=cf6d2de8-39c7-4ba8-92dc-b6fbe9aef228"
                  alt="BookPro Logo"
                  layout="fill"
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-bold text-white"> app</span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Ketzal app is an Ultimate Travel Agency and Booking system based on Laravel for Travel Agency, Tour Operator, Car Booking, Space Rental Website booking system.
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xl font-bold mb-6">ADDRESS</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <span>Cd Juarez, Chiuahua, Mexico</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-400">📞</span>
                <span>656 112 1142</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-400">✉</span>
                <span>Ketzal@Gorillabs.dev</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">NEWSLETTER</h3>
            <div className="flex mb-6">
              <Input 
                type="email" 
                placeholder="Your email address..." 
                className="rounded-r-none bg-transparent border-gray-600 focus:border-green-500"
              />
              <Button className="rounded-l-none bg-green-600 hover:bg-green-700">
                <ArrowUp className="h-5 w-5 rotate-45" />
              </Button>
            </div>
            <div>
              <p className="text-gray-300 mb-4">We're social, connect with us:</p>
              <div className="flex space-x-3">
                <Link href="#" className="p-2 rounded-full border border-gray-600 hover:border-green-500 hover:bg-green-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="p-2 rounded-full border border-gray-600 hover:border-green-500 hover:bg-green-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="p-2 rounded-full border border-gray-600 hover:border-green-500 hover:bg-green-500 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="p-2 rounded-full border border-gray-600 hover:border-green-500 hover:bg-green-500 transition-colors">
                  <Globe className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            COPYRIGHT © 2025. All Rights Reserved By Gorillabs.dev 🦍
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-green-600 hover:bg-green-700 rounded-full shadow-lg transition-colors"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  )
}

export default Footer

