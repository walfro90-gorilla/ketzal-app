export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (faq: Omit<FAQ, "id">) => void
  initialData?: FAQ
}

export interface FAQListProps {
  faqs: FAQ[]
  onEdit: (faq: FAQ) => void
  onDelete: (id: string) => void
}

