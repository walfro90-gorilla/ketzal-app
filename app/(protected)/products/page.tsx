import Link from "next/link"
import { getProducts } from "./products.api"
import { ProductCard } from "@/components/product-card"
import { buttonVariants } from "@/components/ui/button"
import type { Product } from "@/components/product-card"

// IMPORTING AUTH
import { auth } from "@/auth"


export default async function Products() {


  // AUTHENTICATION
  const session = await auth()
  if (!session) {
    return <div> Not authenticated </div>
  }

  // GETTING PRODUCTS
  const products = await getProducts()


  return (
    <div>



      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Products</h1>
        <Link
          href='/products/new'
          className={buttonVariants()}
        >
          Create Producto
        </Link>
      </div>
      <hr />


      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 mt-4">
        {products.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  )
}