import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

// Función auxiliar para crear notificaciones de bienvenida directamente en la BD
async function createWelcomeNotifications(userId: string, userEmail: string, userName: string, userRole: string) {
    try {
        const currentDate = new Date();
        const coinsExpirationDate = new Date();
        coinsExpirationDate.setDate(currentDate.getDate() + 365); // Los coins expiran en 1 año

        // 1. Notificación de AXO Coins de Bienvenida (directo a BD)
        await db.notification.create({
            data: {
                userId: userId,
                title: '🎁 ¡50 AXO Coins de Bienvenida!',
                message: '¡Bienvenido a Ketzal! Te hemos regalado 50 AXO Coins para que comiences a explorar. Úsalos en tus próximas reservas y descubre experiencias increíbles.',
                type: 'WELCOME_BONUS' as any,
                priority: 'HIGH' as any,
                isRead: false,
                metadata: {
                    coinsAmount: 50,
                    coinsGrantedDate: currentDate.toISOString(),
                    coinsExpirationDate: coinsExpirationDate.toISOString(),
                    welcomeBonus: true,
                    userId: userId,
                    userEmail: userEmail,
                    userName: userName,
                    userRole: userRole
                },
                actionUrl: '/wallet'
            }
        });

        // 2. Notificación de Bienvenida General (directo a BD)
        await db.notification.create({
            data: {
                userId: userId,
                title: '👋 ¡Bienvenido a Ketzal!',
                message: 'Estamos emocionados de tenerte en nuestra comunidad. Explora destinos increíbles, vive experiencias únicas y conecta con los mejores proveedores de servicios turísticos.',
                type: 'WELCOME_MESSAGE' as any,
                priority: 'NORMAL' as any,
                isRead: false,
                metadata: {
                    welcomeMessage: true,
                    userId: userId,
                    userEmail: userEmail,
                    userName: userName,
                    userRole: userRole,
                    registrationDate: currentDate.toISOString(),
                    tutorialLinks: {
                        gettingStarted: '/help/getting-started',
                        howToBook: '/help/how-to-book',
                        axoCoins: '/help/axo-coins-guide'
                    }
                },
                actionUrl: userRole === 'admin' ? '/admin/dashboard' : '/explore'
            }
        });

        console.log(`✅ Notificaciones de bienvenida creadas para usuario: ${userName} (${userEmail})`);
        return true;
    } catch (error) {
        console.error('❌ Error creando notificaciones de bienvenida:', error);
        return false;
    }
}

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
    if (verifyToken.expires < new Date()) {
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
    const updatedUser = await db.user.update({
        where: {
            email: verifyToken.identifier,
        },
        data: {
            emailVerified: new Date(),
        },
    });

    // Crear wallet con 50 AXO coins si no existe
    const existingWallet = await db.wallet.findFirst({
        where: { userId: updatedUser.id },
    });
    if (!existingWallet) {
        await db.wallet.create({
            data: {
                id: crypto.randomUUID(),
                userId: updatedUser.id,
                balanceAxo: 50,
                balanceMXN: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        console.log(`💰 Wallet creado para usuario ${updatedUser.email} con 50 AXO coins.`);
    } else {
        console.log(`ℹ️ El usuario ${updatedUser.email} ya tiene wallet.`);
    }

    // Crear notificaciones de bienvenida para el usuario recién verificado
    try {
        await createWelcomeNotifications(
            updatedUser.id,
            updatedUser.email,
            updatedUser.name || 'Usuario',
            updatedUser.role
        );
        console.log(`🎉 Notificaciones de bienvenida enviadas a: ${updatedUser.email}`);
    } catch (notificationError) {
        console.error('❌ Error enviando notificaciones de bienvenida:', notificationError);
        // No fallar la verificación si las notificaciones fallan
    }

    // eliminar el token
    await db.verificationToken.delete({
        where: {
            identifier: verifyToken.identifier,
        },
    });

    // return Response.json({ token });
    redirect("/login?verified=true")
}