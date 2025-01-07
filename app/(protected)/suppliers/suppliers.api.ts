export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// CREATE supplier
export async function createSupplier(supplierData: any) {

    const res = await fetch(`${BACKEND_URL}/api/suppliers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
    })
    const data = await res.json()
    // console.log(data)
    return data
}

// READ supplierS
export async function getSuppliers() {
    const res = await fetch(`${BACKEND_URL}/api/suppliers`)
    const data = await res.json()
    return data
}
// READ supplier
export async function getSupplier(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`)
    const data = await res.json()
    return  data
}

// UPDATE supplier
export async function updateSupplier(id: string, supplierData: any) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
    })
    return await res.json()

}

// DELETE supplier
export async function deleteSupplier(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    console.log(data)

}