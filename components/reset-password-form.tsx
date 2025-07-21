'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { resetPasswordSchema } from '@/lib/zod'
import { resetPasswordAction } from '@/actions/auth-action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResetPasswordFormProps {
  token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    setError(null)
    setSuccess(null)
    
    startTransition(async () => {
      try {
        const result = await resetPasswordAction(values)
        
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess(result.message || "Contraseña restablecida exitosamente")
          form.reset()
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        }
      } catch {
        setError("Ocurrió un error inesperado")
      }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">¡Listo!</h2>
                <p className="text-gray-600 mt-2">{success}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Serás redirigido al login en unos segundos...
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Ir al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Restablecer Contraseña
          </CardTitle>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isPending}
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isPending}
                  {...form.register('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isPending}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isPending ? "Actualizando..." : "Restablecer Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
