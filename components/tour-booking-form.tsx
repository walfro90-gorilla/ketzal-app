'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TourBookingForm({ tourId }: { tourId: string }) {
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [language, setLanguage] = useState('english')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log('Booking submitted:', { tourId, date, guests, language })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="language">Preferred Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Book Now</Button>
        </form>
      </CardContent>
    </Card>
  )
}

