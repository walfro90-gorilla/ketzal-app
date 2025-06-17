"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { deleteService } from "@/app/(protected)/services/services.api"
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"

export interface Service {
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
    id?: string;
    serviceType: string;
}

export function ServiceCard({ service }: { service: Service }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleRemoveService(id: string) {
        setLoading(true)
        await deleteService(id)
        setLoading(false)
        setOpen(false)
        router.refresh()
    }
    return (
        <>
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
                    <p>
                        {service.description.length > 50
                            ? service.description.slice(0, 50) + "..."
                            : service.description}
                    </p>

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
                            setOpen(true)
                        }}
                    >
                        Eliminar
                    </Button>
                </CardFooter>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro de que deseas eliminar este servicio?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            No
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (service.id) {
                                    await handleRemoveService(service.id)
                                }
                            }}
                            disabled={loading}
                        >
                            Sí
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
                        <span className="mt-4 text-white font-semibold">Eliminando servicio...</span>
                    </div>
                </div>
            )}
        </>
    )
}