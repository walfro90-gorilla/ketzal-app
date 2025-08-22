"use client";

import { useState } from "react";
import { Input, DatePicker, TimePicker, Button, Timeline, Card, Typography, Popconfirm } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined, DeleteOutlined } from "@ant-design/icons";
import type dayjs from "dayjs";
import { UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Activity {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
}

interface VirtualItineraryProps {
  activities: any[];
  addActivity: UseFieldArrayAppend<any, "itinerary">;
  removeActivity: UseFieldArrayRemove;
}

export default function VirtualItinerary({ activities, addActivity, removeActivity }: VirtualItineraryProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!title || !date || !time || !location) {
      alert("Please fill in all required fields");
      return;
    }

    const newActivity: Omit<Activity, 'id'> & { id?: number } = {
      id: Date.now(),
      title,
      date: date.format("YYYY-MM-DD"),
      time: time.format("HH:mm"),
      description,
      location,
    };

    addActivity(newActivity);

    setTitle("");
    setDate(null);
    setTime(null);
    setDescription("");
    setLocation("");
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="mb-8">
        Itinerario virtual 🗺️
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="🆕 Actividad" className="mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1">
                Titulo *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingrese titulo de la actividad"
              />
            </div>
            <div>
              <label htmlFor="date" className="block mb-1">
                Fecha: *
              </label>
              <DatePicker id="date" value={date} onChange={(value) => setDate(value)} className="w-full" />
            </div>
            <div>
              <label htmlFor="time" className="block mb-1">
                Hora *
              </label>
              <TimePicker
                id="time"
                value={time}
                onChange={(value) => setTime(value)}
                format="HH:mm"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">
                Descripcion
              </label>
              <TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Ingresa descripcion de la actividad."
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-1">
                Lugar *
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ingresa lugar de actividad."
              />
            </div>
            <Button type="primary" onClick={handleSubmit} className="w-full">
              ➕ Actividad
            </Button>
          </div>
        </Card>

        <Card title="Itinerario - Timeline" className="mb-8">
          {sortedActivities.length === 0 ? (
            <Text>No se han agregado actividades.</Text>
          ) : (
            <Timeline mode="left">
              {sortedActivities.map((activity, index) => (
                <Timeline.Item key={activity.id} label={`${activity.date} ${activity.time}`}>
                  <div className="mb-4 relative pr-8">
                    <Title level={4} className="mb-2">
                      {activity.title}
                    </Title>
                    <Text className="block mb-2">
                      <ClockCircleOutlined className="mr-2" />
                      {activity.time}
                    </Text>
                    <Text className="block mb-2">
                      <EnvironmentOutlined className="mr-2" />
                      {activity.location}
                    </Text>
                    {activity.description && <Text className="block">{activity.description}</Text>}
                    <Popconfirm
                      title="Delete this activity?"
                      onConfirm={() => removeActivity(index)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="absolute top-0 right-0"
                        aria-label="Delete activity"
                      />
                    </Popconfirm>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </Card>
      </div>
    </div>
  );
}
