import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "../products.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

async function ProductDetailPage({ params }: { params: { id: string } }) {
    // console.log(params);

    const resolvedParams = await params

    const product = await getProduct(resolvedParams.id)
    console.log(product)

    return (
        <div
            className="flex justify-center items-center"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between" >
                        Product Details: {product.id}
                        <Link
                            className={buttonVariants()}
                            href="/products"
                        >
                            Back
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p> ${product.price}</p>
                    <img
                    src={product.image}
                    alt=""
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default ProductDetailPage