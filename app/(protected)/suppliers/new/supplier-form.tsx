"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"

import { createSupplier, updateSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { useParams, useRouter } from "next/navigation"

type Supplier = {
    name?: string;
    description?: string;
    contactEmail?: string;
    phoneNumber?: string;
    address?: string;
    imgLogo?: string;
};

export function SupplierForm({ supplier }: { supplier?: Supplier }) {

    // console.log(supplier)

    const { register, handleSubmit } = useForm(
        {
            defaultValues: {
                name: supplier?.name,
                description: supplier?.description,
                contactEmail: supplier?.contactEmail,
                phoneNumber: supplier?.phoneNumber,
                address: supplier?.address,

                imgLogo: supplier?.imgLogo,
            }
        }
    )
    const router = useRouter()
    const params = useParams<{ id: string }>()

    console.log("Params:", params)


    const onSubmit = handleSubmit(async (data) => {

        if (params?.id) {
            await updateSupplier(params.id, data)
            console.log('update')
        } else {
            console.log("create", data)
            await createSupplier(data)
        }


        router.push("/suppliers")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit}>
            <Label>supplier Name</Label>
            <Input
                {...register("name")}
            />
            <Label>Description:</Label>
            <Input
                {...register("description")}
            />


            <Label>Contact Email:</Label>
            <Input
                {...register("contactEmail")}
            />
            <Label>Phone Number:</Label>
            <Input
                {...register("phoneNumber")}
            />
            <Label>Address:</Label>
            <Input
                {...register("address")}
            />

            <Label>Image:</Label>

            <Input
                {...register("imgLogo")}
            />

            <Button>
                {
                    params?.id ? "Update supplier" : "Create supplier"
                }
            </Button>
        </form>
    )
}