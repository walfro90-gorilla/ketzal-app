"use server"


import { db } from "@/lib/db";



export const updateIdSupplier = async (data, user) => {



    try {

        // update user
        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                supplierId: data.id
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