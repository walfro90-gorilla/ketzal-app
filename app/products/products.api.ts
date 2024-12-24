export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// CREATE PRODUCT
export async function createProduct(productData: any){

    const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    const data = await res.json()
    console.log(data)
}

// READ PRODUCTS
export async function getProducts() {
    const res = await fetch(`${BACKEND_URL}/api/products`)
    const data = await res.json()
    return data
}
// READ PRODUCT
export async function getProduct(id:string) {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`)
    const data = await res.json()
    return await data
}

// UPDATE PRODUCT
export async function updateProduct(id: string, productData: any){
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    return await res.json()
    
}

// DELETE PRODUCT
export async function deleteProduct(id: string){
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    console.log(data)
}