import Link from "next/link";
import { getServices } from "@/app/(protected)/services/services.api";

import { ServiceCard } from "@/components/service-card";

import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { Card } from "antd";

export default async function Service() {

    const service = await getServices();
    const session = await auth()

    return (
      <Card>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">Services</h1>
                <Link
                    href='/services/new'
                    className={buttonVariants()}
                >
                    + Service
                </Link>
            </div>
            <hr />


            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                {service.filter(service => service.supplierId === session?.user.supplierId).map((service) => (
                    <ServiceCard service={service} key={service.id} />
                ))}
            </div>
        </Card>
    )
}