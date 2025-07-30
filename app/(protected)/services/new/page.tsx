import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { getService } from "@/app/(protected)/services/services.api"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"

async function ServicesNewPage({ params }: { params: Promise< { id: string }> }) {
    const {id} = await params
    const session = await auth()

    // Get real data
    const service = await getService(id)
    const suppliers = await getSuppliers()

    // Use fixed form with working navigation
    const { default: ServiceFormFixed } = await import("./service-form-fixed")

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 mt-16">
            <div className="flex justify-center items-center h-full">
                <Card className="bg-white dark:bg-gray-800 text-black dark:text-white">
                    <CardHeader>
                        <CardTitle>
                            {!service.statusCode ? "Editar Servicio 🖍️" : "Crear Nuevo Servicio ➕"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Fixed form with working navigation */}
                        <ServiceFormFixed 
                            suppliers={suppliers} 
                            service={service} 
                            session={session} 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ServicesNewPage