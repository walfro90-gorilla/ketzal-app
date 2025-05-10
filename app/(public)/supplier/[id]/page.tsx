import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplier } from "@/app/(protected)/suppliers/suppliers.api";

// Página pública de detalle de proveedor
export default async function PublicSupplierPage({ params }: { params: Promise< { id: string }> }) {

    const { id } = await params;
    const supplier = await getSupplier(id);

    if (!supplier) {
        return <div className="flex justify-center items-center h-96">Proveedor no encontrado</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-lg w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                        {supplier.imgLogo && (
                            <img src={supplier.imgLogo} alt={supplier.name} className="w-16 h-16 rounded-full object-cover border" />
                        )}
                        <span>{supplier.name}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 text-gray-700">{supplier.description}</p>
                    <div className="mb-2">
                        <span className="font-semibold">Email:</span> {supplier.contactEmail}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Teléfono:</span> {supplier.phoneNumber}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Dirección:</span> {supplier.address}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Tipo:</span> {supplier.type}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
