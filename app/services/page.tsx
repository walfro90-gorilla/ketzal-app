import Link from "next/link";
import { getServices } from "@/app/services/services.api";

import { ServiceCard } from "@/components/service-card";

import { buttonVariants } from "@/components/ui/button";

export default async function Service() {

    const service = await getServices();

    return (
        <div>
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
                {service.map((service) => (
                    <ServiceCard service={service} key={service.id} />
                ))}
            </div>
        </div>
    )
}