export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// CREATE category
export async function createCategory(categoryData: any){
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    })
    const data = await res.json()
    return data
}

// READ categories
export async function getCategories() {
    const res = await fetch(`${BACKEND_URL}/api/categories`)
    const data = await res.json()
    return data
}
// READ category
export async function getCategory(id:string) {
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`)
    const data = await res.json()
    return data
}

// UPDATE category
export async function updateCategory(id: string, categoryData: any){
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    })
    return await res.json()
}

// DELETE category
export async function deleteCategory(id: string){
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    return data
}
