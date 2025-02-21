"use client"

import { useState } from "react"
import { Form, Input, DatePicker, TimePicker, Button, Timeline, Card, Typography } from "antd"
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

interface Activity {
  id: number
  title: string
  date: string
  time: string
  description: string
  location: string
}

export default function VirtualItinerary() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const newActivity: Activity = {
      id: Date.now(),
      title: values.title,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      description: values.description,
      location: values.location,
    }

    setActivities((prevActivities) => {
      const updatedActivities = [...prevActivities, newActivity]
      return sortActivities(updatedActivities)
    })

    form.resetFields()
  }

  const sortActivities = (activities: Activity[]) => {
    return activities.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`)
      const dateTimeB = new Date(`${b.date}T${b.time}`)
      return dateTimeA.getTime() - dateTimeB.getTime()
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="mb-8">
        Virtual Itinerary
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Add Activity" className="mb-8">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="time" label="Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Add Activity
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title="Itinerary Timeline" className="mb-8">
          {activities.length === 0 ? (
            <Text>No activities added yet.</Text>
          ) : (
            <Timeline mode="left">
              {activities.map((activity) => (
                <Timeline.Item key={activity.id} label={`${activity.date} ${activity.time}`}>
                  <div className="mb-4">
                    <Title level={4}>{activity.title}</Title>
                    <Text className="block mb-2">
                      <ClockCircleOutlined className="mr-2" />
                      {activity.time}
                    </Text>
                    <Text className="block mb-2">
                      <EnvironmentOutlined className="mr-2" />
                      {activity.location}
                    </Text>
                    {activity.description && <Text className="block">{activity.description}</Text>}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </Card>
      </div>
    </div>
  )
}

