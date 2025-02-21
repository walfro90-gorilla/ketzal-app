import { MexicanStatesCitiesSelector } from "@/components/MexicanStatesCitiesSelector"

export default function MexicanStatesCitiesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Mexican State and City</h1>
      <MexicanStatesCitiesSelector />
    </div>
  )
}

