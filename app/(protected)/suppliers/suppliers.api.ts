export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 

// CHECK for duplicate suppliers
export async function checkDuplicateSupplier(name?: string, email?: string, excludeId?: string) {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    if (excludeId) params.append('excludeId', excludeId);
    
    const res = await fetch(`${BACKEND_URL}/api/suppliers/check-duplicate?${params.toString()}`);
    if (!res.ok) {
        throw new Error('Error checking for duplicates');
    }
    return await res.json();
}

// SEARCH suppliers by name or email
export async function searchSuppliers(name?: string, email?: string) {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    
    const res = await fetch(`${BACKEND_URL}/api/suppliers/search?${params.toString()}`);
    return await res.json();
}

// CREATE supplier
export async function createSupplier(supplierData: unknown) {
    // console.log('Frontend sending supplier data:', supplierData);
    const res = await fetch(`${BACKEND_URL}/api/suppliers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        // console.error('Backend error response:', errorData);
        throw new Error(errorData.message || 'Error creating supplier');
    }
    
    return await res.json(); // Return the created supplier (or its id)
}


// READ supplierS
export async function getSuppliers() {
    const res = await fetch(`${BACKEND_URL}/api/suppliers`)
    
    if (!res.ok) {
        // console.error(`Error fetching suppliers: ${res.status} ${res.statusText}`);
        throw new Error(`Failed to fetch suppliers: ${res.status}`);
    }
    
    const data = await res.json()
    // console.log('Suppliers data received:', data); // Debug log
3    
    // Map supplierType to type for frontend compatibility
    if (Array.isArray(data)) {
        return data.map(supplier => ({
            ...supplier,
            type: supplier.supplierType
        }));
    }
    
    return data
}
// READ supplier
export async function getSupplier(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`)
    const data = await res.json()
    return  data
}

// UPDATE supplier
export async function updateSupplier(id: string, supplierData: unknown) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
    })
    return await res.json()

}

// CHECK dependencies before deletion
export async function checkSupplierDependencies(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}/dependencies`);
    if (!res.ok) {
        throw new Error('Failed to check supplier dependencies');
    }
    return await res.json();
}

// DELETE supplier with enhanced error handling
export async function deleteSupplier(id: string) {
    try {
        // First check dependencies
        const dependencies = await checkSupplierDependencies(id);
        
        if (!dependencies.canDelete) {
            throw new Error(
                `Cannot delete supplier "${dependencies.supplier.name}". ` +
                `It has ${dependencies.totalDependencies} dependencies: ` +
                `${dependencies.services.length} services, ` +
                `${dependencies.users.length} users, ` +
                `${dependencies.transportServices.length} transport services, ` +
                `${dependencies.hotelServices.length} hotel services.`
            );
        }

        const res = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete supplier');
        }

        return await res.json();
    } catch (error) {
        // console.error('Error deleting supplier:', error);
        throw error;
    }
}