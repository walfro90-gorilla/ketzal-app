import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectType() {
  return (
    <Select >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipo Proveedor</SelectLabel>
          <SelectItem value="agencia_viajes">Agenica de viajes y tours</SelectItem>
          <SelectItem value="traslados">Agencia de traslados</SelectItem>
          <SelectItem value="agencia_local">Agencia de servicios locales</SelectItem>
          <SelectItem value="guia">Guia turistico</SelectItem>
          <SelectItem value="hotel">Hotel y alojamiento</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

