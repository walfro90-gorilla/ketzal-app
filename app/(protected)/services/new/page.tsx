import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceForm } from "./service-form"
import { getService } from "@/app/(protected)/services/services.api"
import { auth } from "@/auth"


async function ServicesNewPage({ params }: { params: { id: string } }) {

    const resolvedParams = await params
    const service = await getService(resolvedParams.id)

    const session = await auth()

    // console.log("SERVICE:", service.statusCode)


    return (
        <div>

            <div className="flex justify-center items-center h-full">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {
                                !service.statusCode ? "Edit service" : "Create New service"
                            }

                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceForm service={service} session={session} />
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}

export default ServicesNewPage