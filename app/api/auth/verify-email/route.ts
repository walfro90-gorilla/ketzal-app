import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return new Response("Invalida token", { status: 400 });
    }

    // Verify token here    
    const verifyToken = await db.verificationToken.findFirst({
        where: {
            token,
        },
    });
    if (!verifyToken) {
        return new Response("Token not found", { status: 400 });
    }

    // verifyToken.expiresAt is a Date object
    if (verifyToken.expiresAt < new Date()) {
        return new Response("Token expired", { status: 400 });
    }

    // verify email verification
    const user = await db.user.findUnique({
        where: {
            email: verifyToken.identifier,
        },
    })
    if (user?.emailVerified) {
        return new Response("Email already verified", { status: 400 });
    }

    // marcar el email como verificado
    await db.user.update({
        where: {
            email: verifyToken.identifier,
        },
        data: {
            emailVerified: new Date(),
        },
    });

    // eliminar el token
    await db.verificationToken.delete({
        where: {
            identifier: verifyToken.identifier,
        },
    });

    // return Response.json({ token });
    redirect("/login?verified=true")
}