import type React from "react"
import { useState } from "react"
import { Form, Input, message, Collapse } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const { Panel } = Collapse

interface FAQ {
  id: string
  question: string
  answer: string
}

export const FAQManager: React.FC = ({onSubmit, initialData}) => {


  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const values = await form.validateFields()
      onSubmit(values)
      onClose()
    } catch (error) {
      console.error("Validation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (faq: FAQ) => {
    form.setFieldsValue(faq)
    setEditingId(faq.id)
  }

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
    message.success("FAQ deleted successfully")
    if (editingId === id) {
      setEditingId(null)
      form.resetFields()
    }
  }

  const filteredFAQs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FAQ Manager</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: FAQ Form */}
        <div className="w-full md:w-1/2">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="question" label="Question" rules={[{ required: true, message: "Please input the question!" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="answer" label="Answer" rules={[{ required: true, message: "Please input the answer!" }]}>
              <Textarea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Right side: FAQ List and Search */}
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search FAQs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Collapse className="w-full">
            {filteredFAQs.map((faq) => (
              <Panel
                header={faq.question}
                key={faq.id}
                extra={
                  <div onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)} className="mr-2">
                      <EditOutlined />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)}>
                      <DeleteOutlined />
                    </Button>
                  </div>
                }
              >
                <p>{faq.answer}</p>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  )
}

