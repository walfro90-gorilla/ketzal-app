import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"


// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log({ credentials })

        if (credentials.email !== "test@gmail.com") {
          throw new Error("Invalid credentials")
        }

        // return user object with their profile data
        return {
          id: "1",
          name: "John Doe",
          email: "test@gamil.com"
        }
      },
    }),
  ],
} satisfies NextAuthConfig