

import { useSuppliers } from "@/context/SupplierContext"
import { getProducts } from "./products/products.api"
import { ChartAreaStacked } from "@/components/chart-area-stacked"


async function HomePage() {

  const products = await getProducts()
  // console.log(products)


  return (
    <>
      <ChartAreaStacked />
      {/* <ProductCard product={product} key={product.id} />  */}
      {/* <Dashboard products={products}  /> */}

    </>
  )
}

export default HomePage