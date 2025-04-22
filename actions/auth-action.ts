"use server"

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { CloudCog } from "lucide-react";

export const loginAction = async (
    values: z.infer<typeof signInSchema> & { callbackUrl?: string }
) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })
        return { success: true, callbackUrl: values.callbackUrl || "/home" }
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message }
        }
        return { error: "Error 500" }
    }
}

export const registerAction = async (
    values: z.infer<typeof signUpSchema>
) => {
    try {

        const { data, success } = signUpSchema.safeParse(values)
        if (!success) {
            return {
                error: "Invalid data"
            }
        }

        // verificar si el usuario ya existe
        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (user) {
            return {
                error: "User already exists"
            }
        }

        // HASH PASSWORD
        const passwordHash = await bcrypt.hash(data.password, 10)

        // CREAR USUARIO
        await db.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: passwordHash
            }
        })

        // LOGIN    
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        })

        return { success: true }

    } catch (error) {
        console.log("first error", error)
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message }
        }
        return { error: error }
    }

}