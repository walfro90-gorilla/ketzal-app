import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TourPricingProps {
  price: number
  originalPrice?: number
  discount?: number
}

export function TourPricing({ price, originalPrice, discount = 10 }: TourPricingProps) {
  return (
    <Card className="w-full">
      <div className="relative bg-blue-600 p-4 text-white">
        {discount && (
          <div className="absolute -right-1 -top-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-gray-200 line-through text-sm">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base mb-3">Book A Reservation</h3>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Start Date :</label>
              <input
                type="date"
                className="w-full px-3 py-1.5 text-sm border rounded-md"
                defaultValue="2025-01-09"
              />
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">•</span>
              <span>Start date: 9/1/2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">•</span>
              <span>End date: 12/1/2025</span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">${price.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

