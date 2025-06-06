import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from 'lucide-react'

interface TourLocationProps {
  location: {
    title: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  included: string[]
  excluded: string[]
}

export function TourIncludeExclude({ location, included, excluded }: TourLocationProps) {

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-medium">
       Que incluye el tour?: {location.title}
        </CardTitle>
      </CardHeader>
     
      <CardContent className="pt-6">
        {/* <h3 className="text-lg font-medium mb-4">Included/Excluded :</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="space-y-2">
            {included.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {excluded.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

