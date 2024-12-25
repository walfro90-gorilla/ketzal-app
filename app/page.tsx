import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

import { getProducts } from "./products/products.api"
import { ProductCard } from "@/components/product-card"
import {Dashboard } from "@/app/dashboard/page"


async function HomePage() {

  const products = await getProducts()
  // console.log(products)

  return (
    <>
    hello
             {/* <ProductCard product={product} key={product.id} />  */}
            {/* <Dashboard products={products}  /> */}
         
    </>
  )
}

export default HomePage