import { useState, useEffect } from "react"
import type { FAQ } from "../types/faq"

interface UseFAQsProps {
  initialFAQs?: FAQ[]
  onFAQsChange?: (faqs: FAQ[]) => void
}

export const useFAQs = ({ initialFAQs = [], onFAQsChange }: UseFAQsProps) => {
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs)

  useEffect(() => {
    setFAQs(initialFAQs)
  }, [initialFAQs])

  const handleUpdate = (newFAQs: FAQ[]) => {
    setFAQs(newFAQs)
    onFAQsChange?.(newFAQs)
  }

  const addFAQ = (newFAQ: Omit<FAQ, "id">) => {
    const faq: FAQ = { ...newFAQ, id: Date.now().toString() }
    handleUpdate([...faqs, faq])
  }

  const updateFAQ = (updatedFAQ: FAQ) => {
    const newFAQs = faqs.map((faq) =>
      faq.id === updatedFAQ.id ? updatedFAQ : faq
    )
    handleUpdate(newFAQs)
  }

  const deleteFAQ = (id: string) => {
    const newFAQs = faqs.filter((faq) => faq.id !== id)
    handleUpdate(newFAQs)
  }

  return { faqs, addFAQ, updateFAQ, deleteFAQ }
}
