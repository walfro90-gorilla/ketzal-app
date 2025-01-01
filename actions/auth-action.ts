"use server"

import { signIn } from "@/auth";
import { signInSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";

export const loginAction = async (

    values: z.infer<typeof signInSchema>
) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          })
          return {success: true}
    } catch (error) {
if(error instanceof AuthError){
    return {error: error.cause?.err?.message}
    }
    return {error: "Error 500"}
    }
}