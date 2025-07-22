"use server"

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { signInSchema, signUpSchema, signUpAdminSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmailVerification, sendPasswordResetEmail } from "@/lib/mail";
import { createNotification, NotificationType, NotificationPriority } from "@/app/api/notifications/notifications.api";

// Función auxiliar para obtener el super admin
async function getSuperAdmin() {
    return await db.user.findFirst({
        where: {
            role: 'superadmin'
        }
    });
}

// Función auxiliar para crear notificaciones de bienvenida para nuevos usuarios
async function createWelcomeNotifications(userId: string, userEmail: string, userName: string, userRole: string) {
    try {
        const currentDate = new Date();
        const coinsExpirationDate = new Date();
        coinsExpirationDate.setDate(currentDate.getDate() + 365); // Los coins expiran en 1 año

        // 1. Notificación de AXO Coins de Bienvenida
        await createNotification({
            userId: userId,
            title: '🎁 ¡50 AXO Coins de Bienvenida!',
            message: '¡Bienvenido a Ketzal! Te hemos regalado 50 AXO Coins para que comiences a explorar. Úsalos en tus próximas reservas y descubre experiencias increíbles.',
            type: NotificationType.WELCOME_BONUS,
            priority: NotificationPriority.HIGH,
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
        });

        // 2. Notificación de Bienvenida General
        await createNotification({
            userId: userId,
            title: '👋 ¡Bienvenido a Ketzal!',
            message: 'Estamos emocionados de tenerte en nuestra comunidad. Explora destinos increíbles, vive experiencias únicas y conecta con los mejores proveedores de servicios turísticos.',
            type: NotificationType.WELCOME_MESSAGE,
            priority: NotificationPriority.NORMAL,
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
        });

        console.log(`✅ Notificaciones de bienvenida creadas para usuario: ${userName} (${userEmail})`);
        return true;
    } catch (error) {
        console.error('❌ Error creando notificaciones de bienvenida:', error);
        return false;
    }
}

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
            // Mapear errores específicos de NextAuth a mensajes user-friendly
            const message = (error.cause as any)?.message
            if (message?.includes("email") && message?.includes("verify")) {
                return { error: message } // Ya viene en español del auth.config
            }
            if (message?.includes("incorrectos")) {
                return { error: message } // Ya viene en español del auth.config
            }
            if (message?.includes("válidos")) {
                return { error: message } // Ya viene en español del auth.config
            }
            return { error: "Credenciales incorrectas. Verifica tu email y contraseña." }
        }
        return { error: "Ocurrió un error inesperado. Inténtalo de nuevo." }
    }
}

export const registerAction = async (
    values: z.infer<typeof signUpSchema> & { adminRequest?: boolean }
) => {
    try {

        const { data, success } = signUpSchema.safeParse(values)
        if (!success) {
            return {
                error: "Los datos proporcionados no son válidos"
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
                error: "Ya existe una cuenta con este email. ¿Deseas iniciar sesión?"
            }
        }

        // HASH PASSWORD
        const passwordHash = await bcrypt.hash(data.password, 10)

        // Determinar el rol inicial
        const isAdminRequest = values.adminRequest === true
        const userRole = isAdminRequest ? 'admin' : 'user'
        
        // CREAR USUARIO
        const newUser = await db.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: passwordHash,
                role: userRole,
                // emailVerified se mantiene null hasta que verifiquen el email
                // axoCoinsEarned usa el default de 50
            }
        })

        // Crear token de verificación y enviar email
        const token = nanoid()
        await db.verificationToken.create({
            data: {
                identifier: data.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
            },
        })
        
        // Enviar email de verificación
        await sendEmailVerification(data.email, token)

        // Enviar notificación a super-admin sobre nuevo registro de usuario
        try {
            const superAdmin = await getSuperAdmin();
            if (superAdmin) {
                const notificationTitle = isAdminRequest 
                    ? '👤 Nueva Solicitud de Cuenta Administrador'
                    : '🎉 Nuevo Usuario Registrado';
                
                const notificationMessage = isAdminRequest
                    ? `${data.name} (${data.email}) ha solicitado una cuenta de administrador. Requiere revisión y aprobación.`
                    : `${data.name} se ha registrado como nuevo usuario en la plataforma. Email: ${data.email}`;
                
                const notificationPriority = isAdminRequest ? NotificationPriority.HIGH : NotificationPriority.NORMAL;
                
                await createNotification({
                    userId: superAdmin.id,
                    title: notificationTitle,
                    message: notificationMessage,
                    type: NotificationType.USER_REGISTRATION,
                    priority: notificationPriority,
                    metadata: {
                        userId: newUser.id,
                        userName: data.name,
                        userEmail: data.email,
                        userRole: userRole,
                        isAdminRequest: isAdminRequest,
                        registrationDate: new Date().toISOString(),
                        requiresApproval: isAdminRequest
                    },
                    actionUrl: isAdminRequest ? `/admin/users/${newUser.id}` : `/admin/users`
                });
                
                console.log(`✅ Notificación enviada al super admin (${superAdmin.email}) sobre nuevo ${isAdminRequest ? 'admin' : 'usuario'}: ${data.name}`);
            } else {
                console.log('⚠️  No se encontró super admin para enviar notificación');
            }
        } catch (notificationError) {
            console.error('❌ Error enviando notificación al super admin:', notificationError);
            // No fallar el registro si la notificación falla
        }

        // Mensaje de respuesta diferente para admin vs user
        const message = isAdminRequest
            ? "Solicitud de administrador enviada exitosamente. Por favor verifica tu email y espera la aprobación de tu solicitud."
            : "Cuenta creada exitosamente. Por favor revisa tu email para verificar tu cuenta antes de iniciar sesión."
        
        return { 
            success: true, 
            message,
            requiresEmailVerification: true,
            isAdminRequest
        }

    } catch (error) {
        console.log("first error", error)
        if (error instanceof AuthError) {
            const message = (error.cause as any)?.message
            if (message?.includes("email") && message?.includes("verify")) {
                return { error: message } // Ya viene en español del auth.config
            }
            return { error: "Error al crear la cuenta. Inténtalo de nuevo." }
        }
        return { error: "Ocurrió un error inesperado durante el registro. Inténtalo de nuevo." }
    }

}

// NUEVA VERSIÓN: Registro de admin con Supplier separado
export const registerAdminActionV2 = async (
    values: z.infer<typeof signUpAdminSchema>
) => {
    try {
        const { data, success } = signUpAdminSchema.safeParse(values)
        if (!success) {
            return {
                error: "Los datos proporcionados no son válidos"
            }
        }

        // Verificar si el usuario ya existe
        const existingUser = await db.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (existingUser) {
            return {
                error: "Ya existe una cuenta con este email. ¿Deseas iniciar sesión?"
            }
        }

        // Verificar si ya existe un supplier con este email
        const existingSupplier = await db.supplier.findUnique({
            where: {
                contactEmail: data.email
            }
        })
        if (existingSupplier) {
            return {
                error: "Ya existe un proveedor registrado con este email."
            }
        }

        // HASH PASSWORD
        const passwordHash = await bcrypt.hash(data.password, 10)

        // Usar transacción para crear ambos registros
        const result = await db.$transaction(async (tx) => {
            // 1. Crear USUARIO (inicia como user normal)
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: passwordHash,
                    role: 'user', // Inicia como user normal, se promociona después de aprobación
                    // emailVerified se mantiene null hasta verificación
                }
            })

            // 2. Crear SUPPLIER (usar extras para campos adicionales)
            const newSupplier = await tx.supplier.create({
                data: {
                    name: data.company,
                    contactEmail: data.email,
                    phoneNumber: data.phone || "",
                    description: data.documentation,
                    supplierType: data.serviceType,
                    address: data.city,
                    // Usar extras para información adicional y digitalPresence para redes sociales
                    extras: {
                        isApproved: false,
                        isPending: true,
                        registrationData: {
                            company: data.company,
                            serviceType: data.serviceType,
                            city: data.city,
                            documentation: data.documentation,
                            // Información adicional
                            experienceYears: data.experienceYears || null,
                            businessLanguages: data.businessLanguages || null,
                            taxId: data.taxId || null,
                            whatsappBusiness: data.whatsappBusiness || null
                        },
                        registrationDate: new Date().toISOString()
                    },
                    // Usar info para almacenar la presencia digital (redes sociales)
                    info: {
                        digitalPresence: {
                            website: data.website || null,
                            facebook: data.facebook || null,
                            instagram: data.instagram || null,
                            tiktok: data.tiktok || null,
                            youtube: data.youtube || null
                        },
                        businessInfo: {
                            languages: data.businessLanguages ? data.businessLanguages.split(',').map(lang => lang.trim()) : [],
                            experience: data.experienceYears || null,
                            taxId: data.taxId || null,
                            whatsappBusiness: data.whatsappBusiness || null
                        }
                    }
                }
            })

            // 3. Vincular user con supplier
            await tx.user.update({
                where: { id: newUser.id },
                data: { 
                    supplierId: newSupplier.id
                }
            })

            return { user: newUser, supplier: newSupplier }
        })

        // Crear token de verificación y enviar email
        const token = nanoid()
        await db.verificationToken.create({
            data: {
                identifier: data.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
            },
        })
        
        // Enviar email de verificación
        await sendEmailVerification(data.email, token)

        // Enviar notificación a super-admin sobre nueva solicitud de proveedor
        try {
            const superAdmin = await getSuperAdmin();
            if (superAdmin) {
                await createNotification({
                    userId: superAdmin.id,
                    title: '🏢 Nueva Solicitud de Proveedor Turístico',
                    message: `${data.name} (${data.company}) ha solicitado convertirse en proveedor de servicios turísticos. Tipo: ${data.serviceType}. Requiere aprobación.`,
                    type: NotificationType.SUPPLIER_APPROVAL,
                    priority: NotificationPriority.HIGH,
                    metadata: {
                        supplierId: result.supplier.id,
                        userId: result.user.id,
                        supplierName: data.company,
                        supplierEmail: data.email,
                        serviceType: data.serviceType,
                        registrationDate: new Date().toISOString()
                    },
                    actionUrl: `/admin/suppliers/${result.supplier.id}` // URL para revisar la solicitud
                });
                console.log(`✅ Notificación enviada al super admin (${superAdmin.email}) sobre nueva solicitud de proveedor: ${data.company}`);
            } else {
                console.log('⚠️  No se encontró super admin para enviar notificación');
            }
        } catch (notificationError) {
            console.error('❌ Error enviando notificación al super admin:', notificationError);
            // No fallar el registro si la notificación falla
        }
        
        return { 
            success: true, 
            message: "¡Cuenta creada exitosamente! Tu perfil de usuario está activo. Hemos recibido tu solicitud para convertirte en proveedor de servicios turísticos y está pendiente de revisión por nuestro equipo. Te notificaremos por email cuando sea aprobada. Mientras tanto, puedes navegar y usar la plataforma como usuario normal.",
            requiresEmailVerification: true,
            isAdminRequest: true,
            userId: result.user.id,
            supplierId: result.supplier.id
        }

    } catch (error) {
        console.log("admin registration v2 error", error)
        if (error instanceof AuthError) {
            const message = (error.cause as any)?.message
            if (message?.includes("email") && message?.includes("verify")) {
                return { error: message }
            }
            return { error: "Error al crear la solicitud de proveedor. Inténtalo de nuevo." }
        }
        return { error: "Ocurrió un error inesperado durante el registro. Inténtalo de nuevo." }
    }
}

export const registerAdminAction = async (
    values: z.infer<typeof signUpAdminSchema>
) => {
    try {

        const { data, success } = signUpAdminSchema.safeParse(values)
        if (!success) {
            return {
                error: "Los datos proporcionados no son válidos"
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
                error: "Ya existe una cuenta con este email. ¿Deseas iniciar sesión?"
            }
        }

        // HASH PASSWORD
        const passwordHash = await bcrypt.hash(data.password, 10)

        // Usar transacción para crear Usuario y Supplier
        const result = await db.$transaction(async (tx) => {
            // 1. Crear el Supplier primero
            const newSupplier = await tx.supplier.create({
                data: {
                    name: data.company,
                    contactEmail: data.email,
                    phoneNumber: "", // Se puede actualizar después
                    address: data.city,
                    description: `Supplier for ${data.company}`,
                    supplierType: data.serviceType,
                    // documentation info se puede agregar en extras como JSON
                    extras: {
                        documentation: data.documentation,
                        registrationInfo: "Admin registration"
                    }
                }
            })

            // 2. Crear el Usuario vinculado al Supplier
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: passwordHash,
                    role: 'admin',
                    supplierId: newSupplier.id,
                    // emailVerified se mantiene null hasta que verifiquen el email
                }
            })

            return { user: newUser, supplier: newSupplier }
        })

        // Crear token de verificación y enviar email
        const token = nanoid()
        await db.verificationToken.create({
            data: {
                identifier: data.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
            },
        })
        
        // Enviar email de verificación
        await sendEmailVerification(data.email, token)

        // TODO: Enviar notificación a super-admin sobre nueva solicitud de administrador
        
        return { 
            success: true, 
            message: "Solicitud de administrador enviada exitosamente. Por favor verifica tu email y espera la aprobación de tu solicitud por parte del equipo de Ketzal.",
            requiresEmailVerification: true,
            isAdminRequest: true
        }

    } catch (error) {
        console.log("admin registration error", error)
        if (error instanceof AuthError) {
            const message = (error.cause as any)?.message
            if (message?.includes("email") && message?.includes("verify")) {
                return { error: message } // Ya viene en español del auth.config
            }
            return { error: "Error al crear la solicitud de administrador. Inténtalo de nuevo." }
        }
        return { error: "Ocurrió un error inesperado durante el registro de administrador. Inténtalo de nuevo." }
    }

}

// ===== FUNCIONES PARA RESET DE CONTRASEÑA =====

export const forgotPasswordAction = async (
    values: z.infer<typeof forgotPasswordSchema>
) => {
    try {
        const { data, success } = forgotPasswordSchema.safeParse(values)
        if (!success) {
            return {
                error: "Email no válido"
            }
        }

        // Verificar si el usuario existe
        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        // Por seguridad, siempre devolvemos el mismo mensaje aunque el usuario no exista
        const successMessage = "Si existe una cuenta con este email, recibirás un enlace para restablecer tu contraseña."

        if (!user) {
            return {
                success: true,
                message: successMessage
            }
        }

        // Crear token de reset (más corto que verificación, 1 hora)
        const resetToken = nanoid()
        
        // Eliminar tokens de reset anteriores para este email
        await db.passwordResetToken.deleteMany({
            where: {
                identifier: data.email
            }
        })

        // Crear nuevo token de reset
        await db.passwordResetToken.create({
            data: {
                identifier: data.email,
                token: resetToken,
                expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
            }
        })

        // Enviar email de reset
        const emailResult = await sendPasswordResetEmail(data.email, resetToken)
        
        if (emailResult?.error) {
            return {
                error: "Error al enviar el email. Inténtalo de nuevo más tarde."
            }
        }

        return {
            success: true,
            message: successMessage
        }

    } catch (error) {
        console.log("forgot password error", error)
        return { 
            error: "Ocurrió un error inesperado. Inténtalo de nuevo." 
        }
    }
}

export const resetPasswordAction = async (
    values: z.infer<typeof resetPasswordSchema>
) => {
    try {
        const { data, success } = resetPasswordSchema.safeParse(values)
        if (!success) {
            return {
                error: "Los datos proporcionados no son válidos"
            }
        }

        // Verificar que el token existe y no ha expirado
        const resetToken = await db.passwordResetToken.findFirst({
            where: {
                token: data.token,
                expires: {
                    gt: new Date()
                }
            }
        })

        if (!resetToken) {
            return {
                error: "El enlace de restablecimiento es inválido o ha expirado. Solicita uno nuevo."
            }
        }

        // Buscar el usuario por email del token
        const user = await db.user.findUnique({
            where: {
                email: resetToken.identifier
            }
        })

        if (!user) {
            return {
                error: "Usuario no encontrado. Solicita un nuevo enlace de restablecimiento."
            }
        }

        // Hash de la nueva contraseña
        const newPasswordHash = await bcrypt.hash(data.password, 10)

        // Usar transacción para actualizar contraseña y eliminar token
        await db.$transaction(async (tx) => {
            // Actualizar contraseña
            await tx.user.update({
                where: { id: user.id },
                data: {
                    password: newPasswordHash,
                    updatedAt: new Date()
                }
            })

            // Eliminar el token usado y otros tokens del mismo email
            await tx.passwordResetToken.deleteMany({
                where: {
                    identifier: resetToken.identifier
                }
            })
        })

        return {
            success: true,
            message: "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña."
        }

    } catch (error) {
        console.log("reset password error", error)
        return { 
            error: "Ocurrió un error inesperado. Inténtalo de nuevo." 
        }
    }
}