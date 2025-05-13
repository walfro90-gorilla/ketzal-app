import Link from "next/link";
import { getSuppliers } from "./suppliers.api";
import { SupplierCard } from "@/components/supplier-card";
import type { Supplier } from "@/components/supplier-card";

import { buttonVariants } from "@/components/ui/button";

export default async function Suppliers() {

    const suppliers: Supplier[] = await getSuppliers();

    // Ensure suppliers is typed as Supplier[]
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">Suppliers</h1>
                <Link
                    href='/suppliers/new'
                    className={buttonVariants()}
                >
                    + Supplier
                </Link>
            </div>
            <hr />


            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                {(suppliers ?? []).map((supplier) => (
                    <SupplierCard supplier={supplier} key={supplier.id} />
                ))}
            </div>
        </div>
    )
}