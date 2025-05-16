"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { ItineraryCard } from "./ItineraryCard"
import { AddActivityDialog } from "./AddActivityDialog"
import ItineraryTimeline from "./ItineraryTimeline"
import type { ItineraryItem } from "../types/itinerary"
import { useToast } from "@/components/ui/use-toast"
import { Tabs } from "antd"

// const { TabPane } = Tabs

export function ItineraryBuilder() {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null)
  const { showToast } = useToast()

  const handleAddItem = (item: ItineraryItem) => {
    const newItem = {
      ...item,
      date: new Date(item.date),
      time: new Date(item.time),
      id: editingItem ? editingItem.id : Date.now(),
    }

    if (editingItem) {
      setItineraryItems((items) => items.map((i) => (i.id === editingItem.id ? newItem : i)))
      setEditingItem(null)
      showToast({
        title: "Activity updated",
        description: "Your activity has been successfully updated.",
      })
    } else {
      setItineraryItems((items) => [...items, newItem])
      showToast({
        title: "Activity added",
        description: "Your new activity has been added to the itinerary.",
      })
    }
    setIsDialogOpen(false)
  }

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (id: number) => {
    setItineraryItems((items) => items.filter((item) => item.id !== id))
    showToast({
      title: "Activity deleted",
      description: "The activity has been removed from your itinerary.",
    })
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Itinerario - Constructor</h1>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Card View",
            children: (
              <div className="space-y-4">
                {itineraryItems.map((item) => (
                  <ItineraryCard key={item.id} item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} />
                ))}
              </div>
            ),
          },
          {
            key: "2",
            label: "Timeline View",
            children: <ItineraryTimeline itinerary={itineraryItems} />,
          },
        ]}
      />
      <Button onClick={() => setIsDialogOpen(true)}  size="lg">
        <PlusIcon className="mr-2 h-4 w-4" /> Add Activity
      </Button>
      <AddActivityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddItem}
        initialValues={editingItem}
      />
    </div>
  )
}

