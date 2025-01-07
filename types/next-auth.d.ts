import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            role: string;
            supplierId: string;
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        role?: string;
        supplierId?: string;
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        supplierId: string;
        id: string;
    }
}