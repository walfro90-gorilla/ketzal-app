import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "./product-form"
import { getProduct } from "../products.api"

async function ProductsNewPage({ params }: { params: { id: string } }) {

    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)
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