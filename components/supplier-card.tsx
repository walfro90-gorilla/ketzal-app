"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { deleteSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { useRouter } from "next/navigation";

interface Supplier {
    name: string;
    // price: number;
    image: string;
    description: string;
}

export function SupplierCard({ supplier }: { supplier: Supplier }) {
    const router = useRouter()

    async function handleRemoveSupplier(id) {
        console.log("remove supplier", id)
        await deleteSupplier(id)
        router.refresh()
    }
    return (
        <Card onClick={() => {
            router.push(`/suppliers/${supplier.id}`)
        }}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {supplier.name}
                    {/* <span className="text-sm font-bold text-gray-500">
                        ${supplier.price}
                    </span> */}
                </CardTitle>
            </CardHeader>

            <img alt="" src={supplier.imgLogo} />
            <CardContent>
                <p>{supplier.description}</p>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="mt-5"
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/suppliers/${supplier.id}/edit`)
                    }}
                >
                    Edit
                </Button>
                <Button
                    className="mt-5"
                    variant="destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveSupplier(supplier.id)
                    }}
                >
                    Eliminar
                </Button>
            </CardFooter>

        </Card>
    )
}