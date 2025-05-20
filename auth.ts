import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"

// IMPORTING AUTH CONFIG
import authConfig from "@/auth.config"
import { db } from "@/lib/db"





export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.role = user.role ?? ""
        token.supplierId = user.supplierId ?? ""
        token.id = user.id ?? ""
        
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
      
        session.user.role = token.role;
        session.user.supplierId = token.supplierId;
        session.user.id = token.id;
        
      }
      return session
    },
  },
})
