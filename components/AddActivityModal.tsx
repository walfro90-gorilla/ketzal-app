import type React from "react"
import { Modal, Form, Input, DatePicker, TimePicker, Upload } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { ItineraryItem } from "../types/itinerary"
import type { UploadChangeParam } from "antd/es/upload/interface"

interface AddActivityModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (item: ItineraryItem) => void
  initialValues?: ItineraryItem | null
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values as ItineraryItem)
      form.resetFields()
    })
  }

  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Modal
      visible={visible}
      title={initialValues ? "Edit Activity" : "Add Activity"}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical" initialValues={initialValues || {}}>
        <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="photo" label="Photo" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload listType="picture-card" beforeUpload={() => false}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter a location" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="time" label="Time" rules={[{ required: true, message: "Please select a time" }]}>
          <TimePicker className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddActivityModal

