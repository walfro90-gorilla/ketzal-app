import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "./supplier-form"
import { getSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import type { Supplier } from "@prisma/client"

async function SuppliersNewPage({ params }: { params: Promise< { id: string }> }) {

    const {id}= await params

    const supplier = await getSupplier(id)

    return (
        <div className="flex justify-center items-center h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {
                            supplier ? "Edit Supplier" : "Create New Supplier"
                        }
                        
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <SupplierForm supplier={supplier as any} />
                </CardContent>
            </Card>
        </div>
    )
}
export default SuppliersNewPage