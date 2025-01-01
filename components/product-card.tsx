"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { deleteProduct } from "@/app/(protected)/products/products.api"
import { useRouter } from "next/navigation";

interface Product {
    name: string;
    price: number;
    image: string;
    description: string;
}

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter()

    async function handleRemoveProduct(id) {
        console.log("remove product", id)
        await deleteProduct(id)
        router.refresh()
    }
    return (
        <Card onClick={() => {
            router.push(`/products/${product.id}`)
        }}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {product.name}
                    <span className="text-sm font-bold text-gray-500">
                        ${product.price}
                    </span>
                </CardTitle>
            </CardHeader>

            <img alt="" src={product.image} />
            <CardContent>
                <p>{product.description}</p>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="mt-5"
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/products/${product.id}/edit`)
                    }}
                >
                    Edit
                </Button>
                <Button
                    className="mt-5"
                    variant="destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveProduct(product.id)
                    }}
                >
                    Eliminar
                </Button>
            </CardFooter>

        </Card>
    )
}