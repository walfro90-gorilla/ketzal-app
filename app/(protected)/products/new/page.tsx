import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "./product-form"
import { getProduct } from "../products.api"

async function ProductsNewPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params


    const product = await getProduct(id)
    // console.log(product)

    return (
        <div className="flex justify-center items-center h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {
                            product ? "Edit Product" : "Create New Product"
                        }

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} />
                </CardContent>
            </Card>
        </div>
    )
}
export default ProductsNewPage