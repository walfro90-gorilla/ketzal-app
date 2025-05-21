import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceForm } from "./service-form"
import { getService } from "@/app/(protected)/services/services.api"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"

import { auth } from "@/auth"


async function ServicesNewPage({ params }: { params: Promise< { id: string }> }) {

    const {id} = await params
    const service = await getService(id)
    const suppliers = await getSuppliers()

    const session = await auth()

    // console.log("SERVICE:", service.statusCode)


    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 mt-16">
            <div className="flex justify-center items-center h-full">
                <Card className="bg-white dark:bg-gray-800 text-black dark:text-white">
                    <CardHeader>
                        <CardTitle>
                            {
                                !service.statusCode ? "Editar Servicio 🖍️" : "Crear Nuevo Servicio ➕"
                            }

                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceForm suppliers={suppliers} service={service} session={session} />
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}

export default ServicesNewPage