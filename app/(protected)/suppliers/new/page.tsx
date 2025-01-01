import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "./supplier-form"
import { getSupplier } from "@/app/(protected)/suppliers/suppliers.api"

async function SuppliersNewPage({ params }: { params: { id: string } }) {

    const resolvedParams = await params
    const supplier = await getSupplier(resolvedParams.id)
    // console.log(supplier)

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
                    <SupplierForm supplier={supplier} />
                </CardContent>
            </Card>
        </div>
    )
}
export default SuppliersNewPage