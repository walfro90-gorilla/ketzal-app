import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react"
import type { ItineraryItem } from "../types/itinerary"
import { format } from "date-fns"

interface ItineraryCardProps {
  item: ItineraryItem
  onEdit: (item: ItineraryItem) => void
  onDelete: (id: number) => void
}

export function ItineraryCard({ item, onEdit, onDelete }: ItineraryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(item.date, "MMMM d, yyyy")}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{item.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPinIcon className="mr-1 h-4 w-4" />
          {item.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <ClockIcon className="mr-1 h-4 w-4" />
          {format(item.time, "HH:mm a")}
        </div>
        {item.photo && (
          <img
            src={item.photo || "/placeholder.svg"}
            alt={item.title}
            className="mt-4 rounded-md w-full h-48 object-cover"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(item)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(item.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

