import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            role: string;
            supplierId?: string;
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        role?: string;
        supplierId?: string;
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        supplierId: string;
        id: string;
    }
}