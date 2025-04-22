export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// CREATE service
export async function createService(serviceData: any){

    const res = await fetch(`${BACKEND_URL}/api/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    })
    const data = await res.json()
    console.log(data)
}

// READ serviceS
export async function getServices() {
    const res = await fetch(`${BACKEND_URL}/api/services`)
    const data = await res.json()
    return data
}
// READ service
export async function getService(id:string) {
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`)
    const data = await res.json()
    return await data
}

// UPDATE service
export async function updateService(id: string, serviceData: any){
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    })
    return await res.json()
    
}

// DELETE service
export async function deleteService(id: string){
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    console.log(data)
    
}