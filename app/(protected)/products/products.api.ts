export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// CREATE PRODUCT
export async function createProduct(productData: unknown){
    await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
}

// READ PRODUCTS
export async function getProducts() {
    const res = await fetch(`${BACKEND_URL}/api/products`)
    return await res.json()
}
// READ PRODUCT
export async function getProduct(id:string) {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`)
    return await res.json()
}

// UPDATE PRODUCT
export async function updateProduct(id: string, productData: unknown){
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
    await res.json()
}