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





export function ServiceForm({ service, session }) {

    const values = useSuppliers()

    const { getIdSupplier } = useSuppliers()


    // STATE FOR suppliers
    const [suppliers, setSuppliers] = useState<{ id: number, name: string }[]>([])

    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number, name: string } | undefined>(undefined)




    // USE EFFECT TO FETCH suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const suppliersData = await getSuppliers()
                setSuppliers(suppliersData)
                // Find the supplier by session.user.supplierId
                const selected = suppliersData.find(supplier => supplier.id === session.user.supplierId);
                setSelectedSupplier(selected)

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
    // console.log("Suppliers from DB", suppliers)
    // console.log("ID Supplier:", values.idSupplier)

    const onSubmit = async (data: any) => {
        try {
            if (!service) {
                await updateService(service.id, { ...data, supplierId: values.idSupplier })
            } else {
                await createService({ ...data, supplierId: session.user.supplierId })
            }
            // Handle successful form submission
        } catch (error) {
            console.error("Failed to submit form", error)
        }
        router.push("/services")
        router.refresh()
    }




    console.log("SelectedSupplier:", selectedSupplier)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="flex space-x-4 items-center mb-4"> 

                <Label>Supplier:</Label>
                <Input
                    value={values.idSupplier ? values.idSupplier : session.user.supplierId}
                    {...register("supplierId")}
                    disabled
                    className="w-1/4"
                />
                <Label>{selectedSupplier?.name}</Label>

            </div>

            {/* <ComboBox suppliers={suppliers} option={selectedSupplier?.name} /> */}

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