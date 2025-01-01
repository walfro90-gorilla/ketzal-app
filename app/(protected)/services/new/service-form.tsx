"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ComboBox } from "@/components/combobox"
import { Label } from "@radix-ui/react-label"
import { on } from "events"
import { Controller, useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSuppliers } from "@/context/SupplierContext"
// API services import
import { createService, updateService } from "../services.api"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { use, useEffect, useState } from "react"

export function ServiceForm({ service }: any) {


    const values = useSuppliers()
    console.log("Supplier context:", values.idSupplier)
    console.log("Value sobject:", values)

    const { getIdSupplier } = useSuppliers()

    // STATE FOR suppliers
    const [suppliers, setSuppliers] = useState([])

    // USE EFFECT TO FETCH suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const suppliersData = await getSuppliers()
                setSuppliers(suppliersData)

            } catch (error) {
                console.log("Failed to fetch suppliers", error)
            }
        }
        fetchSuppliers()
    }, [])

    const { control, register, handleSubmit, setValue } = useForm(
        {
            defaultValues: {
                supplierId: service?.supplierId,
                name: service?.name,
                description: service?.description,
                price: service?.price,
                location: service?.location,
                availableFrom: service?.availableFrom,
                availableTo: service?.availableTo,
            }
        }
    )
    const router = useRouter()
    const params = useParams<{ id: string }>()
    // const { idSupplier } = SupplierProvider()
    // console.log("Params:", params)
    console.log("Suppliers from DB", suppliers)
    console.log("ID Supplier:", values.idSupplier)

    const onSubmit = async (data: any) => {
        try {
            if (!service) {
                await updateService(service.id, { ...data, supplierId: values.idSupplier })
            } else {
                await createService({ ...data, supplierId: values.idSupplier })
            }
            // Handle successful form submission
        } catch (error) {
            console.error("Failed to submit form", error)
        }
        router.push("/services")
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 3fr', gap: '1rem', marginBottom: '1rem' }}>
                <Label>Supplier:</Label>
                <Input
                    value={values.idSupplier? values.idSupplier : ""}
                    {...register("supplierId")}
                    disabled
                />
            </div>
                <ComboBox suppliers={suppliers} />

          

            <br />

            <Label>Service Name</Label>
            <Input
                {...register("name")}
            />
            <Label>Description:</Label>
            <Input
                {...register("description")}
            />

            <Label>Price:</Label>
            <Input
                {...register("price", {
                    setValueAs: value => parseFloat(value, 10)
                })}
            />
            <Label>Location:</Label>
            <Input
                {...register("location")}
            />

            <Label>Available From:</Label>
            <Controller
                name="availableFrom"
                control={control}
                render={({ field }) => (
                    <DatePickerWithRange
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <br />
            <Label>Available To:</Label>
            <Controller
                name="availableTo"
                control={control}
                render={({ field }) => (
                    <DatePickerWithRange
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

            <Button>
                {
                    params.id ? "Update service" : "Create service"
                }
            </Button>
        </form>
    )
}