"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"

import { createProduct, updateProduct } from "../products.api"
import { useParams, useRouter } from "next/navigation"


export function ProductForm({ product }: any) {

    console.log(product)

    const { register, handleSubmit } = useForm(
        {
            defaultValues: {
                name: product?.name,
                description: product?.description,
                price: product?.price,
                stock: product?.stock,
                image: product?.image,
            }
        }
    )
    const router = useRouter()
    const params = useParams<{ id: string }>()
    console.log("Params:", params)

    const onSubmit = handleSubmit(async (data) => {

        if (params?.id) {
            await updateProduct(params.id, {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock),
            })
            console.log('update')
        } else {
            console.log(data)
            await createProduct({
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock),
            })
        }


        router.push("/products")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit}>
            <Label>Product Name</Label>
            <Input
                {...register("name")}
            />

            <Label>Description:</Label>
            <Input
                {...register("description")}
            />

            <Label>Price:</Label>
            <Input
                {...register("price")}
            />

            <Label>Stock:</Label>
            <Input
                {...register("stock")}
            />

            <Label>Image:</Label>

            <Input
                {...register("image")}
            />

            <Button>
                {
                    params?.id ? "Update Product" : "Create Product"
                }
            </Button>
        </form>
    )
}