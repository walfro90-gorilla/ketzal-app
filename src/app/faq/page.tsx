import { FAQManager } from "@/components/FAQManager"
import type { FAQ } from "@/types/faq"

export default function FAQPage() {
  const handleFAQSubmit = (faq: FAQ) => {
    // TODO: Implement submission logic (e.g., API call)
    console.log("FAQ submitted:", faq)
  }

  return (
    <div className="container mx-auto py-8">
      <FAQManager onSubmit={handleFAQSubmit} />
    </div>
  )
}

