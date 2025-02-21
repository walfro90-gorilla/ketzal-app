import React from "react"
import { Timeline, Typography } from "antd"
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

interface ItineraryItem {
  id: number
  title: string
  date: string
  time: string
  description: string
  location: string
}

interface ItineraryTimelineProps {
  itinerary: ItineraryItem[]
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="mb-8">
        Itinerary Timeline
      </Title>
      {itinerary.length === 0 ? (
        <Text>No activities added yet.</Text>
      ) : (
        <Timeline mode="left">
          {itinerary.map((item) => (
            <Timeline.Item key={item.id} label={`${item.date} ${item.time}`}>
              <div className="mb-4">
                <Title level={4}>{item.title}</Title>
                <Text className="block mb-2">
                  <ClockCircleOutlined className="mr-2" />
                  {item.time}
                </Text>
                <Text className="block mb-2">
                  <EnvironmentOutlined className="mr-2" />
                  {item.location}
                </Text>
                {item.description && <Text className="block">{item.description}</Text>}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </div>
  )
}

export default ItineraryTimeline

