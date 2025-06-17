"use client"

import { useEffect, useState } from "react"
import { Select, Button } from "antd"
import { getGlobalLocations } from "@/app/(protected)/global-locations.api"

export function MexicanStatesCitiesSelector() {
  const [globalLocations, setGlobalLocations] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    getGlobalLocations().then((data: any[]) => setGlobalLocations(data))
  }, [])

  useEffect(() => {
    if (selectedState) {
      setCities(
        Array.from(
          new Set(
            globalLocations.filter((l) => l.state === selectedState).map((l) => l.city)
          )
        )
      )
    } else {
      setCities([])
    }
    setSelectedCity(null)
  }, [selectedState, globalLocations])

  const handleStateChange = (value: string) => {
    setSelectedState(value)
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
  }

  const handleClearSelection = () => {
    setSelectedState(null)
    setSelectedCity(null)
    setCities([])
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow sm:flex-row sm:space-x-4 sm:space-y-0">
      <Select
        className="w-full sm:w-1/2"
        placeholder="Selecciona el Estado"
        onChange={handleStateChange}
        value={selectedState}
        options={Array.from(new Set(globalLocations.map((l) => l.state))).map((state) => ({ value: state, label: state }))}
        showSearch
        filterOption={(input, option) =>
          (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0
        }
        notFoundContent={<div className="text-gray-500">No hay estados disponibles</div>}
      />
      <Select
        className="w-full sm:w-1/2"
        placeholder="Selecciona la Ciudad"
        onChange={handleCityChange}
        value={selectedCity}
        disabled={!selectedState}
        options={cities.map((city) => ({ value: city, label: city }))}
        notFoundContent={<div className="text-gray-500">No hay ciudades disponibles</div>}
        showSearch
        filterOption={(input, option) =>
          (option?.label?.toLowerCase() ?? "").indexOf(input.toLowerCase()) >= 0
        }
      />
      <Button onClick={handleClearSelection} className="w-full sm:w-auto">
        Limpiar selección
      </Button>
    </div>
  )
}

