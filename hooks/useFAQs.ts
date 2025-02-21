import { useState } from "react"
import type { FAQ } from "../types/faq"

export const useFAQs = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([])

  const addFAQ = (newFAQ: Omit<FAQ, "id">) => {
    const faq: FAQ = { ...newFAQ, id: Date.now().toString() }
    setFAQs([...faqs, faq])
  }

  const updateFAQ = (updatedFAQ: FAQ) => {
    setFAQs(faqs.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq)))
  }

  const deleteFAQ = (id: string) => {
    setFAQs(faqs.filter((faq) => faq.id !== id))
  }

  return { faqs, addFAQ, updateFAQ, deleteFAQ }
}

