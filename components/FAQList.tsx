import type React from "react"
import { Collapse } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import type { FAQListProps } from "../types/faq"

// const { Panel } = Collapse

export const FAQList: React.FC<FAQListProps> = ({ faqs, onEdit, onDelete }) => {
  const items = faqs.map((faq) => ({
    key: faq.id,
    label: faq.question,
    children: (
      <p>{faq.answer}</p>
    ),
    extra: (
      <div onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => onEdit(faq)} className="mr-2">
          <EditOutlined />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(faq.id)}>
          <DeleteOutlined />
        </Button>
      </div>
    )
  }));

  return (
    <Collapse className="w-full" items={items} />
  )
}

