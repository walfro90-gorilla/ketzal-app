import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceForm } from "./service-form"
import { getService } from "@/app/services/services.api"

async function ServicesNewPage({ params }: { params: { id: string } }) {

    const resolvedParams = await params
    const service = await getService(resolvedParams.id)
    // console.log(service)

    return (
        <div className="flex justify-center items-center h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {
                            service ? "Edit service" : "Create New service"
                        }
                        
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ServiceForm service={service} />
                </CardContent>
            </Card>
        </div>
    )
}
export default ServicesNewPage