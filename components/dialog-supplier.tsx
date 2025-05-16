import React, { createContext, useContext, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { SupplierFormUser } from "@/app/(protected)/suppliers/new/supplier-form-user"

const DialogContext = createContext({
  isOpen: false, setIsOpen: (open: boolean) => {
    console.log(open)
  }
});

export function DialogSupplier() {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Label

            style={{ cursor: 'pointer' }}
          >
            CREAR
          </Label>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>+ NEW</DialogTitle>
            <DialogDescription>
              Add all information about your travel team.
            </DialogDescription>
          </DialogHeader>
          <SupplierFormUser supplier={{ /* fill with default/empty supplier fields */ }} />
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  return useContext(DialogContext);
}

