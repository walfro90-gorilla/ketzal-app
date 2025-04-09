"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { deleteService } from "@/app/(protected)/services/services.api"
import { useRouter } from "next/navigation";

interface Service {
    supplierId: string;
    name: string;
    description: string;
    price: number;
    location: string;
    availableFrom: string;
    availableTo: string;
    images: {
        imgBanner: string;
        imgAlbum: string[];
    };
    
}

export function ServiceCard({ service }: { service: Service }) {
    const router = useRouter()

    async function handleRemoveService(id) {
        console.log("remove service", id)
        await deleteService(id)
        router.refresh()
    }
    return (
        <Card onClick={() => {
            router.push(`/services/${service.id}`)
        }}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {service.name}
                    {/* <span className="text-sm font-bold text-gray-500">
                        ${service.price}
                    </span> */}
                </CardTitle>
            </CardHeader>

            <img alt="" src={service.images.imgBanner} />
            <CardContent>
                <p>{service.description}</p>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="mt-5"
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/services/${service.id}/edit`)
                    }}
                >
                    Editar
                </Button>
                <Button
                    className="mt-5"
                    variant="destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveService(service.id)
                    }}
                >
                    Eliminar
                </Button>
            </CardFooter>

        </Card>
    )
}