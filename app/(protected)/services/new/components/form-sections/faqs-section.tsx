"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus, Search } from "lucide-react"
import { useState } from "react"
import { FAQModal } from "@/components/FAQModal"
import { FAQList } from "@/components/FAQList"
import { useFAQs } from "@/hooks/useFAQs"
import type { FAQ } from "@/types/faq"

interface ServiceFormData {
  faqs: FAQ[]
}

export function FAQsSection() {
  const { setValue, watch, formState: { errors }, register } = useFormContext<ServiceFormData>();
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>(undefined)
  
  const currentFAQs = watch("faqs") || []

  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useFAQs({
    initialFAQs: currentFAQs,
    onFAQsChange: (updatedFAQs) => setValue("faqs", updatedFAQs, { shouldValidate: true }),
  })

  // Filter FAQs based on search term
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = () => {
    setEditingFAQ(undefined)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFAQ(undefined)
  }

  const handleSubmitFAQ = (faq: Omit<FAQ, "id">) => {
    if (editingFAQ) {
      updateFAQ({ ...faq, id: editingFAQ.id })
    } else {
      addFAQ(faq)
    }
    handleCloseModal()
  }

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteFAQ(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Preguntas Frecuentes (FAQs)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Agrega preguntas frecuentes para ayudar a los usuarios a entender mejor tu servicio.
          </p>
          
          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleOpenModal}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar FAQ
            </Button>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              <FAQList 
                faqs={filteredFAQs} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No se encontraron FAQs que coincidan con tu búsqueda." : "No hay FAQs configuradas aún."}
              </div>
            )}
          </div>
        </div>

        {errors.faqs && (
          <p className="text-sm text-red-500">{errors.faqs.message as string}</p>
        )}

        {/* FAQ Modal */}
        <FAQModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSubmit={handleSubmitFAQ} 
          initialData={editingFAQ} 
        />

        {/* Hidden input for form registration */}
        <input {...register("faqs")} type="hidden" />
      </CardContent>
    </Card>
  )
}
