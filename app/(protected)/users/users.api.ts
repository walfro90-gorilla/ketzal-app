export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 

// User interface with supplier information
export interface User {
    id: string;
    name: string | null;
    email: string;
    password?: string;
    emailVerified: Date | null;
    image: string | null;
    role: 'user' | 'admin' | 'superadmin';
    supplierId: number | null;
    supplier?: {
        id: number;
        name: string;
        contactEmail: string;
    } | null;
    createdAt: Date;
}

// SEARCH users by name or email
export async function searchUsers(name?: string, email?: string) {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    
    const res = await fetch(`${BACKEND_URL}/api/users/search?${params.toString()}`);
    return await res.json();
}

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
export async function getUsers(): Promise<User[]> {
    const res = await fetch(`${BACKEND_URL}/api/users`)
    const data = await res.json()
    return data
}
// READ user
export async function getUser(id: string): Promise<User> {
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
    if (!res.ok) {
        throw new Error('Error deleting user');
    }
    return await res.json()
}