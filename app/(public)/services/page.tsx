import Link from "next/link";
import { getServices } from "@/app/(public)/services/services.api";
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api";

import type { Service } from "@/components/service-card";
import { ServiceCard } from "@/components/service-card";

import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { Card } from "antd";

export default async function Service() {

    // Use the correct Service type for services
    const services: Array<Service> = await getServices();
    await getSuppliers();

    // Get the current session
    const session = await auth()


    console.log("session: ", session)
    console.log("services: ", services)
    console.log("services filter: ", services.filter((service: Service) => service.supplierId === session?.user.supplierId))   

    return (
        <Card className="dark:bg-neutral-900">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold dark:text-white text-black">Servicios</h1>
                <Link
                    href='/services/new'
                    className={buttonVariants()}
                >
                    + Servicio
                </Link>
            </div>
            <hr />


            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                {services.filter((service: Service) => service.supplierId === session?.user.supplierId).map((service) => (
                   <ServiceCard service={service} key={service.id} />
                ))}
            </div>
        </Card>
    )
}