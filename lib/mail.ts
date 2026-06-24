import { Resend } from "resend"

// Cliente Resend lazy: se construye al primer uso y solo si hay API key.
// Evita que el módulo crashee al cargar (p.ej. el middleware) cuando
// AUTH_RESEND_API_KEY no está configurada en el entorno.
let _resend: Resend | null = null
function getResend(): Resend | null {
    if (_resend) return _resend
    const key = process.env.AUTH_RESEND_API_KEY
    if (!key) {
        console.warn("AUTH_RESEND_API_KEY no configurada — envío de email deshabilitado")
        return null
    }
    _resend = new Resend(key)
    return _resend
}

export const sendEmailVerification = async (email: string, token: string) => {
    const resend = getResend()
    if (!resend) return { error: true }
    try {
        await resend.emails.send({
           from: "Ketzal app <ketzal.app@gorillabs.dev>",
            to: email,
            subject: "Verifica tu correo",
            html: `
                <h1>Verifica tu correo</h1>
                <p>Para verificar tu correo, haz clic en el siguiente enlace:</p>
                <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verificar correo</a>
            `
        })

    } catch (error) {
        console.log(error)
        return {
            error: true
        }
    }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resend = getResend()
    if (!resend) return { error: true }
    try {
        await resend.emails.send({
            from: "Ketzal app <ketzal.app@gorillabs.dev>",
            to: email,
            subject: "Restablecer tu contraseña - Ketzal",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #10b981; margin-bottom: 10px;">🔒 Restablecer Contraseña</h1>
                        <p style="color: #6b7280; font-size: 16px;">Ketzal App</p>
                    </div>
                    
                    <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                            Hola,
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en Ketzal. 
                            Si no solicitaste este cambio, puedes ignorar este email de forma segura.
                        </p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}" 
                               style="display: inline-block; background: linear-gradient(to right, #10b981, #3b82f6); 
                                      color: white; text-decoration: none; padding: 14px 30px; 
                                      border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Restablecer mi contraseña
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
                            Este enlace expirará en 1 hora por seguridad. Si necesitas un nuevo enlace, 
                            solicita otra vez el restablecimiento desde la página de login.
                        </p>
                    </div>
                    
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
                            Este email fue enviado desde Ketzal App.<br>
                            Si tienes problemas con el enlace, copia y pega la siguiente URL en tu navegador:<br>
                            <span style="word-break: break-all;">${process.env.NEXTAUTH_URL}/reset-password?token=${token}</span>
                        </p>
                    </div>
                </div>
            `
        })

        return { success: true }
    } catch (error) {
        console.log('Error sending password reset email:', error)
        return {
            error: true
        }
    }
}