"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { ComboBox } from "@/components/combobox"
import { Label } from "@radix-ui/react-label"
// import { on } from "events"
import { Controller, useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSuppliers } from "@/context/SupplierContext"

// API services import
import { createService, updateService } from "../services.api"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { use, useEffect, useState } from "react"

// Validation schema with zod and zodResolver from react-hook-form to validate the form
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema } from "@/validations/serviceSchema"

import { Alert, Avatar, Space, Card, Col, Row, Table, message } from "antd"

import Marquee from 'react-fast-marquee';
import ImageUploader from "@/components/images-uploader"


export function ServiceForm({ service, session }) {



    const values = useSuppliers()
    const { getIdSupplier } = useSuppliers()

    const router = useRouter()
    const params = useParams<{ id: string }>()

    // STATEs for packages
    const [pack, setPack] = useState<{ name: string, description: string, qty: number, price: number }>({ name: '', description: '', qty: 0, price: 0 })
    const [packs, setPacks] = useState<{ data: { name: string, description: string, qty: number, price: number }[] }>({ data: [] })

    // STATE FOR suppliers
    const [suppliers, setSuppliers] = useState<{ id: number, name: string }[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number, name: string } | undefined>(undefined)

    // // // MESSAGE API from antd
    const [messageApi, contextHolder] = message.useMessage();
    // WARNING message 
    const warning = ({ content }: { content: string }) => {
        messageApi.open({
            type: 'warning',
            content: content,
        });
    };
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message',
        });
    };

    const error = ({ content }: { content: string }) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };



    // USE EFFECT TO FETCH suppliers
    useEffect(() => {
        
        if (errors.name) {
            warning({ content: "Se necesitan todos los campos" })
        }

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

    // USE FORM HOOK: useForm, zodResolver, register, handleSubmit and setValue from react-hook-form
    const { control, register, handleSubmit, setValue,getValues, formState: { errors } } = useForm(
        {
            defaultValues: {
                supplierId: service?.supplierId,
                name: service?.name,
                description: service?.description,
                price: service?.price,
                location: service?.location,
                availableFrom: service?.availableFrom,
                availableTo: service?.availableTo,
                packs: service?.packs
            },
            // add zod resolver to the form with the schema created
            resolver: zodResolver(serviceSchema)
        }
    )

    // SUBMIT function to handle the form submission
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

    // Handle submit for add packages //
    const handleSbmitPcks = async (e: any) => {
        e.preventDefault() // Prevent the form from submitting
        if (!pack.name || !pack.description || !pack.price || !pack.qty) { // Check if the package has all the required fields
            warning({ content: 'Ingresa todos los datos del paquete' }) // Show a warning message
            return; // Stop the function
        }

        const updatedPacks = {data: [...packs.data, pack]} // Create a new list of packages with the new package

        setPacks(updatedPacks )  // Add the new package to the list of packages
        setPack({ name: '', description: '', qty: 0, price: 0 }) // Reset the package state
         setValue("packs", updatedPacks) // Set the value of the packages field to the updated list of packages

        console.log("PACKS:", updatedPacks)
         console.log("Form Packs:", getValues ("packs"));


    }

    // Handle delete package 
    const handleDeletePack = (key: number) => {
        const newPacks = packs.data.filter((pack, index) => index + 1 !== key)
        setPacks({ data: newPacks })
    }






    return (
        <>
            {/* ContextHolder to show messages error|warning|info */}
            {contextHolder}

            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex space-x-4 items-center mb-4">
                        <Label>Supplier:</Label>
                        <Label  >{selectedSupplier?.name}</Label>
                        <div hidden>

                            <Input
                                value={values.idSupplier ? values.idSupplier : session.user.supplierId}
                                {...register("supplierId")}
                                disabled
                                className="w-1/4"
                                hidden={true}
                            />
                        </div>
                    </div>

                    <br />

                    <Label>Service Name</Label>
                    <Input
                        {...register("name")}
                    />
                    {typeof errors.name?.message === 'string' && (
                        <Alert showIcon type="error" message={errors.name.message} />
                    )}

                    <Label>Description:</Label>
                    <Input
                        {...register("description")}
                    />
                    {
                        typeof errors.description?.message === 'string' && <Alert showIcon type="error" message={errors.description?.message} />
                    }

                    <Label>Price:</Label>
                    <Input
                        {...register("price", {
                            setValueAs: value => parseFloat(value, 10)
                        })}
                    />
                    {
                        typeof errors.price?.message === 'string' && <Alert showIcon type="error" message={errors.price?.message} />
                    }


                    <Label>Photos:</Label>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <ImageUploader />
                    </div>

                    <Label> Paquetes:</Label>
                    <Row >
                        <Col span={7}>
                            <Label>Paquete</Label>
                            <Input
                                value={pack.name}
                                onChange={(e) => setPack({ ...pack, name: e.target.value })}
                                placeholder="Package Name"
                            />
                        </Col>
                        <Col span={7}>
                            <Label>Descripción</Label>
                            <Input
                                value={pack.description}
                                onChange={(e) => setPack({ ...pack, description: e.target.value })}
                                placeholder="Description"
                            />
                        </Col>
                        <Col span={7}>
                            <Label>Precio</Label>
                            <Input
                                value={pack.price}
                                placeholder="Price"
                                type="number"
                                onChange={(e) => setPack({ ...pack, price: parseFloat(e.target.value) })}
                            />
                        </Col>
                        <Col span={3}>
                            <Label>Cantidad</Label>
                            <Input
                                value={pack.qty}
                                type="number"
                                onChange={(e) => setPack({ ...pack, qty: parseFloat(e.target.value) })}
                                placeholder="Qty"
                            />
                        </Col>
                        <Col span={3}> <Button onClick={handleSbmitPcks} >+</Button></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Table
                                dataSource={packs?.data.map((pack, index) => ({ ...pack, key: index + 1 }))}
                                columns={[
                                    {
                                        title: <b>ID</b>,
                                        dataIndex: 'key',
                                        key: 'key',
                                    },
                                    {
                                        title: <b>Package Name</b>,
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: <b>Description</b>,
                                        dataIndex: 'description',
                                        key: 'description',
                                    },
                                    {
                                        title: <b>Qty</b>,
                                        dataIndex: 'qty',
                                        key: 'qty',
                                    },
                                    {
                                        title: <b>Price</b>,
                                        dataIndex: 'price',
                                        key: 'price',
                                    },
                                    {
                                        title: <b>Delete</b>,
                                        key: 'action',
                                        render: (_, record) => (
                                            <Label
                                                onClick={() => handleDeletePack(record.key)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                ❌
                                            </Label>
                                        ),
                                    },
                                ]}
                            />
                        </Col>

                    </Row>

                    <Label>Current Packages:</Label>

                    <Label
                    >{JSON.stringify(packs, null, 2)}</Label>

                    {
                        typeof errors.packs?.message === 'string' && <Alert showIcon type="error" message={errors.packs?.message} />
                    }

                    <Label>Location:</Label>
                    <Input
                        {...register("location")}
                    />
                    {
                        typeof errors.location?.message === 'string' && <Alert showIcon type="error" message={errors.location?.message} />
                    }


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
                    {
                        typeof errors.availableFrom?.message === 'string' && <Alert showIcon type="error" message={errors.availableFrom?.message} />
                    }
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
                    {
                        typeof errors.availableTo?.message === 'string' && <Alert showIcon type="error" message={errors.availableTo?.message} />
                    }

                    <Button>
                        {
                            params.id ? "Update service" : "Create service"
                        }
                    </Button>
                </form>
            </Card>
        </>

    )
}