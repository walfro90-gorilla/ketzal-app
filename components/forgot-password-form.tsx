'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Mail } from 'lucide-react'

import { forgotPasswordSchema } from '@/lib/zod'
import { forgotPasswordAction } from '@/actions/auth-action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    setError(null)
    setMessage(null)
    
    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(values)
        
        if (result.error) {
          setError(result.error)
        } else {
          setMessage(result.message || "Email enviado exitosamente")
          form.reset()
        }
      } catch {
        setError("Ocurrió un error inesperado")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Recuperar Contraseña
          </CardTitle>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                disabled={isPending}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isPending}
            >
              {isPending ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </Button>
          </form>

          <div className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToLogin}
              className="w-full text-gray-600 hover:text-gray-800"
              disabled={isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
