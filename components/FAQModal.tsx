import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Table } from "antd";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { FAQModalProps } from "../types/faq";

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      onSubmit(values);
      onClose();
      form.resetFields(); // Resetea el formulario después del envío
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal
      title={initialData ? "Edit FAQ" : "Add New FAQ"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Please input the question!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="answer"
          label="Answer"
          rules={[{ required: true, message: "Please input the answer!" }]}
        >
          <Textarea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>

      {/* <Table columns={columns} dataSource={data} /> */}
    </Modal>
  );
};

export default FAQModal;
