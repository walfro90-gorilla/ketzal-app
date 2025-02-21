import React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerInputProps {
  picker: "hours" | "minutes"
  date: Date
  setDate: (date: Date) => void
  id?: string
}

export function TimePickerInput({ picker, date, setDate, id }: TimePickerInputProps) {
  const [value, setValue] = React.useState(picker === "hours" ? date.getHours() : date.getMinutes())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (isNaN(newValue)) return

    setValue(newValue)

    const newDate = new Date(date)
    if (picker === "hours") {
      newDate.setHours(newValue)
    } else {
      newDate.setMinutes(newValue)
    }
    setDate(newDate)
  }

  return (
    <Input
      id={id}
      type="number"
      value={value}
      onChange={handleChange}
      min={0}
      max={picker === "hours" ? 23 : 59}
      className={cn("w-[48px]", picker === "minutes" && "border-l-0 rounded-l-none")}
    />
  )
}

