"use server"


import { db } from "@/lib/db";



interface SupplierData {
    id: string; // Adjust the type of 'id' as needed
}

interface User {
    id: string; // Adjust the type of 'id' as needed
}

export const updateIdSupplier = async (data: SupplierData, user: User) => {



    try {

        // update user
        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                supplierId: Number(data.id)
            }
        })


        // return { data: data }

    } catch (error) {
        if (error) {
            return { error: error }
        }
        return { error: "Error 500" }
    }
}