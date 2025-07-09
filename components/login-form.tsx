'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
// import { Label } from "@/components/ui/label"

import {
  Form,
  FormControl,
  FormDescription,
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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        {isVerified && <CardDescription>Tu email a sido confirmado.</CardDescription>}
        <CardDescription>Ingresa tus credendciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este sera tu email definitivo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder="Contraseña"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
           
            {
              error && <FormMessage>{error}</FormMessage>
            }

            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : 'Ingresar'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
           Aun no tienes cuenta? <Link href="/register"  className="text-green-500">Registrar</Link>
          </p>
        </div>

      </CardContent>


    </Card>
  )
}

