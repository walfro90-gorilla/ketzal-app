import NextAuth from "next-auth"

// import { PrismaAdapter } from "@auth/prisma-adapter"

// IMPORTING AUTH CONFIG
import authConfig from "@/auth.config"
// import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },

})