import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/zod"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { sendEmailVerification } from "./lib/mail"


// Notice this is only an object, not a full Auth.js instance
export default {
  trustHost: true,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const { data, success } = signInSchema.safeParse(credentials)
          
          if (!success) {
            throw new Error("Los datos ingresados no son válidos")
          }

          // verificar si el USER existe
          const user = await db.user.findUnique({
            where: {
              email: data.email,
            },
          })
          
          if (!user || !user.password) {
            throw new Error("Email o contraseña incorrectos")
          }
          // verificar si el PASSWORD es correcto
          const isValid = await bcrypt.compare(data.password, user.password)
          if (!isValid) {
            throw new Error("Email o contraseña incorrectos")
          }
          // verifiacion de email
          if (!user.emailVerified) {
            const verifyTokenExists = await db.verificationToken.findFirst({
              where: {
                identifier: user.email,
              },
            })
            if (verifyTokenExists?.identifier) {
              await db.verificationToken.delete({
                where: {
                  identifier: user.email,
                },
              })
            }
            const token = nanoid()
            await db.verificationToken.create({
              data: {
                identifier: user.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            })
            await sendEmailVerification(user.email, token)
            throw new Error("Por favor verifica tu email para continuar. Revisa tu bandeja de entrada y spam.")
          }

          // Actualizar estado del usuario después de verificar email
          if (user.status === 'PENDING_EMAIL_VERIFICATION') {
            const newStatus = user.adminRequest ? 'PENDING_ADMIN_APPROVAL' : 'ACTIVE'
            await db.user.update({
              where: { id: user.id },
              data: { status: newStatus }
            })
            user.status = newStatus // Actualizar la variable local
          }
          // Return only the fields required by the NextAuth User type
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            supplierId: user.supplierId?.toString() ?? undefined,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
} satisfies NextAuthConfig