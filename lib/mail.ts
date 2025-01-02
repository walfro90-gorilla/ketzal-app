import { Resend } from "resend"

const resend = new Resend(process.env.AUTH_RESEND_API_KEY)

export const sendEmailVerification = async (email: string, token: string) => {
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