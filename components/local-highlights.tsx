import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LocalHighlightsProps {
  localInfo: {
    localCuisine: string
    wildlife: string[]
  }
  highlights: {
    title: string
    description: string
  }[]
}

export function LocalHighlights({ localInfo, highlights }: LocalHighlightsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Local Information</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Local Cuisine</h3>
          <p className="mb-4">{localInfo.localCuisine}</p>
          <h3 className="font-semibold mb-2">Wildlife You Might See</h3>
          <ul className="list-disc list-inside">
            {localInfo.wildlife.map((animal, index) => (
              <li key={index}>{animal}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tour Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          {highlights.map((highlight, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="font-semibold mb-1">{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

