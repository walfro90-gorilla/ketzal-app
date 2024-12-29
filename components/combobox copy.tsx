"use client"

import * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { SupplierProvider } from "@/context/SupplierContext"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// IMPORTING CONTEXT
import { useSuppliers } from "@/context/SupplierContext"

export function ComboBox({ suppliers }: any) {

  // OBJECT DESTRUCTURING
  const { getIdSupplier } = useSuppliers()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? suppliers.find((supplier) => supplier.id === value)?.name
            : "Select Supplier..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search supplier..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Supplier found.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={supplier.id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    getIdSupplier(supplier.id)  // SETTING THE ID FROM CONTEXT
                    setOpen(false)
                  }}
                >
                  {supplier.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === supplier.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

