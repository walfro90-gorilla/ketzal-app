"use client"

// import { X } from 'lucide-react'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ProfileCardProps {
  email: string
  name: string
  avatarUrl: string
  onClose?: () => void
}

export default function ProfileCard({
  // email = "walfre.am@gmail.com",
  name = "Walfre",
  avatarUrl = "/placeholder.svg",
  // onClose
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white dark:bg-gray-950 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex justify-between items-center space-y-0 pb-0">
        {/* <h1 >Agency</h1> */}
      </CardHeader>
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4 group">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 p-[3px]"
          >
            <div className="rounded-full bg-white p-1 h-full w-full">
              <div className="relative">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt={name || "Avatar"}
                  width={96}
                  height={96}
                  className="rounded-full h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">Change image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">¡Hola, {name}!</h2>
        <Button
          variant="outline"
          className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Administrar tu Cuenta
        </Button>
      </CardContent>
    </Card>
  )
}

