export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 

// CREATE user
export async function createUser(userData: unknown) {
    const res = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    return await res.json()
}


// READ userS
export async function getUsers() {
    const res = await fetch(`${BACKEND_URL}/api/users`)
    const data = await res.json()
    return data
}
// READ user
export async function getUser(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/users/${id}`)
    const data = await res.json()
    return  data
}

// UPDATE user
export async function updateUser(id: string, userData: unknown) {
    const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })  
    return await res.json()

}

// DELETE user
export async function deleteUser(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: 'DELETE',
    })
     await res.json()
    // console.log(data)

}