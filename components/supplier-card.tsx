"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { deleteSupplier, checkSupplierDependencies } from "@/app/(protected)/suppliers/suppliers.api"
import { useRouter } from "next/navigation";

export interface Supplier {
    id: string;
    name: string;
    // price: number;
    image: string;
    description: string;
}

export function SupplierCard({ supplier }: { supplier: Supplier }) {
    const router = useRouter();

    async function handleRemoveSupplier(id: string) {
        try {
            console.log("Checking dependencies for supplier", id);
            
            // First check dependencies
            const dependencies = await checkSupplierDependencies(id);
            
            if (!dependencies.canDelete) {
                const dependencyDetails = [];
                if (dependencies.services.length > 0) {
                    dependencyDetails.push(`${dependencies.services.length} servicios`);
                }
                if (dependencies.users.length > 0) {
                    dependencyDetails.push(`${dependencies.users.length} usuarios`);
                }
                if (dependencies.transportServices.length > 0) {
                    dependencyDetails.push(`${dependencies.transportServices.length} servicios de transporte`);
                }
                if (dependencies.hotelServices.length > 0) {
                    dependencyDetails.push(`${dependencies.hotelServices.length} servicios de hotel`);
                }
                
                alert(
                    `❌ No se puede eliminar el proveedor "${dependencies.supplier.name}".\n\n` +
                    `Tiene dependencias activas:\n${dependencyDetails.join('\n')}\n\n` +
                    `Para eliminar este proveedor, primero debe:\n` +
                    `• Eliminar o reasignar todos los servicios\n` +
                    `• Reasignar todos los usuarios a otro proveedor`
                );
                return;
            }

            // If no dependencies, confirm deletion
            const confirmed = confirm(
                `¿Estás seguro de que quieres eliminar el proveedor "${dependencies.supplier.name}"?\n\n` +
                `Esta acción no se puede deshacer.`
            );

            if (!confirmed) {
                return;
            }

            console.log("Proceeding to delete supplier", id);
            await deleteSupplier(id);
            
            alert(`✅ Proveedor "${dependencies.supplier.name}" eliminado exitosamente.`);
            router.refresh();
              } catch (error) {
            console.error("Error removing supplier:", error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`❌ Error al eliminar el proveedor: ${errorMessage}`);
        }
    }
    return (
        <Card onClick={() => {
            router.push(`/suppliers/${supplier.id}`)
        }}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {supplier.name}
                    {/* <span className="text-sm font-bold text-gray-500">
                        ${supplier.price}
                    </span> */}
                </CardTitle>
            </CardHeader>

            <img alt="" src={supplier?.image ? supplier.image : '/placeholder.svg'} />
            <CardContent>
                <p>{supplier.description}</p>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="mt-5"
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/suppliers/${supplier.id}/edit`)
                    }}
                >
                    Edit
                </Button>
                <Button
                    className="mt-5"
                    variant="destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveSupplier(supplier.id)
                    }}
                >
                    Eliminar
                </Button>
            </CardFooter>

        </Card>
    )
}