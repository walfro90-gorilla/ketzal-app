'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, LogIn, Compass } from "lucide-react"
// import { Label } from "@/components/ui/label"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { z } from 'zod'
import { signInSchema } from '@/lib/zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { signIn } from '@/auth'
import { loginAction } from '@/actions/auth-action'
// import { start } from 'repl'
import { useRouter, useSearchParams } from 'next/navigation'
// import { set } from 'date-fns'
import Link from 'next/link'





// FORM VALIDATION
export function LoginForm({
  isVerified,
}: {
  isVerified: boolean
}) {

  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/home'

  // 1. Define your form. 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {

    setError(null)
    startTransition(async () => {

      const response = await loginAction({ ...values, callbackUrl })
      
      if (response.error) {
        setError(response.error)
        console.log("Login failed: ",response.error)
      } else {
        router.push(response.callbackUrl || '/home')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-3 rounded-full shadow-lg">
              <Compass className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">¡Bienvenido de Vuelta!</CardTitle>
          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
              <p className="text-green-700 text-sm font-medium flex items-center space-x-2">
                <span>✅</span>
                <span>Tu email ha sido confirmado exitosamente.</span>
              </p>
            </div>
          )}
          <CardDescription className="text-gray-600">
            Accede a tu cuenta y continúa explorando 🌍
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>Correo Electrónico</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tu@email.com"
                        type='email'
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span>Contraseña</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder="Tu contraseña"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           
              {error && (
                <div className="text-red-700 text-sm p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="text-red-500">⚠️</div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              <Button 
                disabled={isPending} 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Ingresar a mi Cuenta</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-gray-700 font-medium">
                ¿Aún no tienes cuenta?
              </p>
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
                Crear cuenta gratuita →
              </Link>
            </div>
            
            <p className="text-sm text-gray-600">
              ¿Eres proveedor de servicios? <Link href="/register-admin" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">Solicitar cuenta de administrador</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

