"use client"

// import Image from "next/image"

// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DialogSupplier } from "./dialog-supplier"
import React from "react"

import { useDialog } from '@/components/dialog-supplier'


export default function ProfileCardNew({

}: React.ComponentProps<"div">) {



  const { isOpen, setIsOpen } = useDialog()

  console.log("DialogContext", isOpen)

  const handleClick = () => {
    setIsOpen(true)
    console.log(isOpen)
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex justify-between items-center space-y-0 pb-0">
        {/* <h1 >Agency</h1> */}
      </CardHeader>
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4 group">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 via-red-500 to-gray-500 p-[3px]"
          >
            <div className="rounded-full bg-white p-1 h-full w-full">
              <div className="relative" >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-full h-full w-full object-cover"
                  viewBox="0 0 20 20"
                  fill="gray"

                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>

                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <DialogSupplier />
                  {/* <span className="text-white text-sm">Change image</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 onClick={handleClick} className="text-xl font-semibold mb-4">¡Sin Team! 😢</h2>
        <label
          className="w-full text-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Crea o Unete a uno.
        </label>
      </CardContent>
    </Card>
  )
}

