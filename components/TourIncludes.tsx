"use client"

import React, { useState } from "react"
import { Checkbox, List, Typography } from "antd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

const { Title } = Typography

interface TourItem {
  id: string
  name: string
}

const initialItems: TourItem[] = [
  { id: "1", name: "Hotel Accommodation" },
  { id: "2", name: "Breakfast" },
  { id: "3", name: "Guided Tours" },
  { id: "4", name: "Transportation" },
  { id: "5", name: "Entry Fees" },
  { id: "6", name: "Wi-Fi" },
  { id: "7", name: "Lunch" },
  { id: "8", name: "Dinner" },
  { id: "9", name: "Travel Insurance" },
  { id: "10", name: "Personal Expenses" },
]

export default function TourIncludes() {
  
  const [includes, setIncludes] = useState<string[]>([])
  const [notIncludes, setNotIncludes] = useState<string[]>([])

  const handleIncludeChange = (id: string) => {
    setIncludes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        setNotIncludes((prev) => prev.filter((item) => item !== id))
        return [...prev, id]
      }
    })
  }

  const handleNotIncludeChange = (id: string) => {
    setNotIncludes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        setIncludes((prev) => prev.filter((item) => item !== id))
        return [...prev, id]
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tour Inclusions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Title level={4} className="mb-4 flex items-center">
              <CheckCircle2 className="mr-2 text-green-500" />
              Includes
            </Title>
            <List
              dataSource={initialItems}
              renderItem={(item) => (
                <List.Item>
                  <Checkbox checked={includes.includes(item.id)} onChange={() => handleIncludeChange(item.id)}>
                    {item.name}
                  </Checkbox>
                </List.Item>
              )}
            />
          </div>
          <div>
            <Title level={4} className="mb-4 flex items-center">
              <XCircle className="mr-2 text-red-500" />
              Not Includes
            </Title>
            <List
              dataSource={initialItems}
              renderItem={(item) => (
                <List.Item>
                  <Checkbox checked={notIncludes.includes(item.id)} onChange={() => handleNotIncludeChange(item.id)}>
                    {item.name}
                  </Checkbox>
                </List.Item>
              )}
            />
          </div>
        </div>
        <div className="mt-6">
          <Title level={4}>Selected Items</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <List
                  dataSource={initialItems.filter((item) => includes.includes(item.id))}
                  renderItem={(item) => <List.Item>{item.name}</List.Item>}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Not Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <List
                  dataSource={initialItems.filter((item) => notIncludes.includes(item.id))}
                  renderItem={(item) => <List.Item>{item.name}</List.Item>}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <Button className="mt-6" onClick={() => console.log({ includes, notIncludes })}>
          Save Selections
        </Button>
      </CardContent>
    </Card>
  )
}

