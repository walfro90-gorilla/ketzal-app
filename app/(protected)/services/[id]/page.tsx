import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// API Service
import { getService } from "@/app/(protected)/services/services.api";
import { Row } from "antd";



async function ServiceDetailPage({ params }: { params: { id: string } }) {
    // console.log(params);

    const resolvedParams = await params



    const service = await getService(resolvedParams.id)
    console.log(service)

    return (
        <div
            className="flex justify-center items-center"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between" >
                        Service Details: {service.id}
                        <Link
                            className={buttonVariants()}
                            href="/services"
                        >
                            Back
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>{service.name}</h1>
                    <p>{service.description}</p>
                    <p> ${service.price}</p>

                    {service.packs.data.map((pack) =>
                        <Row key={pack.id}>
                            <div >
                                <h1>{pack.name}</h1>
                                <p>{pack.description}</p>
                                <p> ${pack.price}</p>
                                <p> {pack.qty}</p>
                            </div>
                        </Row>
                    )

                    }

                </CardContent>
            </Card>
        </div>
    );
}

export default ServiceDetailPage