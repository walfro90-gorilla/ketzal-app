import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplier} from "@/app/(protected)/suppliers/suppliers.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

async function SupplierDetailPage({ params }: { params: { id: string } }) {

    const resolvedParams = await params

    const supplier = await getSupplier(resolvedParams.id)

    return (
        <div
            className="flex justify-center items-center"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between" >
                        Supplier Details: {supplier.id}
                        <Link
                            className={buttonVariants()}
                            href="/suppliers"
                        >
                            Back
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>{supplier.name}</h1>
                    <p>{supplier.description}</p>
                    {/* <p> ${supplier.price}</p> */}
                    <img
                    src={supplier.image}
                    alt=""
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default SupplierDetailPage