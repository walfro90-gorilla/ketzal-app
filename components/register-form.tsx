'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Plane, Compass } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from 'zod';
import { signUpSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { signIn } from '@/auth';
import { registerAction } from '@/actions/auth-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const response = await registerAction(values);
      if (response.error) {
        setError(response.error.toString());
        console.log(response.error);
      } else if (response.success) {
        if (response.requiresEmailVerification) {
          setSuccess(response.message || "Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.");
          // No redirigir automáticamente - dejar que el usuario lea el mensaje
          setTimeout(() => {
            router.push('/login');
          }, 5000); // Redirigir después de 5 segundos
        } else {
          router.push('/home');
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-3 rounded-full shadow-lg">
              <Compass className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">¡Bienvenido Viajero!</CardTitle>
          <CardDescription className="text-gray-600">
            Únete a nuestra comunidad y comienza tu próxima aventura 🌟
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Nombre</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="¿Cómo te llamas?"
                        type='text'
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Este será tu nombre público en la plataforma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormDescription className="text-xs text-gray-500">
                      Te enviaremos un enlace de verificación.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Contraseña segura"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span>Confirmar</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder="Repite contraseña"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {error && (
                <div className="text-red-700 text-sm p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="text-red-500">⚠️</div>
                    <div>{error}</div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="text-green-700 text-sm p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="text-green-600">✅</div>
                    <div>
                      <p className="font-medium">{success}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Serás redirigido al login en unos segundos...
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                disabled={!!isPending || !!success} 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creando tu cuenta...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center space-x-2">
                    <span>✓ Cuenta creada</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Plane className="h-5 w-5" />
                    <span>Comenzar mi Aventura</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="text-center space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-gray-700 font-medium">
                ¿Ya tienes cuenta?
              </p>
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
                Iniciar sesión →
              </Link>
            </div>
            
            <p className="text-sm text-gray-600">
              ¿Eres proveedor de servicios? <Link href="/register-admin" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">Solicitar cuenta de administrador</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

