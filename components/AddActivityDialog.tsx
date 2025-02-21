"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ItineraryItem } from "../types/itinerary"
import { useForm, Controller } from "react-hook-form"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerDemo } from "./TimePickerDemo"
import { Upload, message, Form } from "antd"
import { PlusOutlined } from "@ant-design/icons"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (item: ItineraryItem) => void
  initialValues?: ItineraryItem | null
}

export function AddActivityDialog({ open, onOpenChange, onSubmit, initialValues }: AddActivityDialogProps) {

  const { control, handleSubmit, reset, setValue } = useForm<ItineraryItem>({
    defaultValues: initialValues || {
      title: "",
      date: new Date(),
      time: new Date(),
      description: "",
      location: "",
      photo: "",
    },
  })

  const [form] = Form.useForm()

  const onSubmitForm = (data: ItineraryItem) => {
    const combinedDateTime = new Date(data.date)
    combinedDateTime.setHours(data.time.getHours())
    combinedDateTime.setMinutes(data.time.getMinutes())

    onSubmit({
      ...data,
      date: combinedDateTime,
      time: combinedDateTime,
    })
    reset()
  }

  const handleImageUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`)
      setValue("photo", info.file.response.url) // Assuming the server returns the URL in the response
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit Activity" : "Add Activity"}</DialogTitle>
        </DialogHeader>


        <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmitForm)}>
          <div className="grid gap-4 py-4">
            <Form.Item name="title" label="title" rules={[{ required: true, message: "Please input the Title!" }]}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => <Input id="title" className="col-span-3" {...field} />}
              />
            </Form.Item>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>

            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input
                    id="date"
                    className="col-span-3"
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Controller
                name="time"
                control={control}
                render={({ field }) => <TimePickerDemo date={field.value} setDate={field.onChange} />}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" className="col-span-3" {...field} />}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => <Input id="location" className="col-span-3" {...field} />}
               />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Photo
              </Label>
              <Controller
                name="photo"
                control={control}
                render={({ field }) => (
                  <Upload
                    name="photo"
                    listType="picture-card"
                    className="avatar-uploader col-span-3"
                    showUploadList={false}
                    action="/api/upload" // You need to implement this API endpoint
                    onChange={handleImageUpload}
                  >
                    {field.value ? (
                      <img src={field.value || "/placeholder.svg"} alt="activity" style={{ width: "100%" }} />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                )}
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="submit">{initialValues ? "Update" : "Add"} Activity</Button>
          </DialogFooter>

        </Form>


      </DialogContent>
    </Dialog>
  )
}

