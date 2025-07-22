'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Building2, Briefcase, Mail, Lock, User, FileText, Shield, Phone, Check, X, Loader2 } from "lucide-react";

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
import { signUpAdminSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAdminAction, registerAdminActionV2 } from '@/actions/auth-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterAdminForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Estados para validaciones en tiempo real
  const [companyNameStatus, setCompanyNameStatus] = useState<{
    available: boolean | null;
    message: string;
    isChecking: boolean;
  }>({ available: null, message: '', isChecking: false });

  const [locations, setLocations] = useState<{
    countries: { value: string; label: string }[];
    states: { value: string; label: string }[];
    cities: { value: string; label: string }[];
    selectedCountry: string;
    selectedState: string;
  }>({ countries: [], states: [], cities: [], selectedCountry: '', selectedState: '' });

  // FLAG PARA PROBAR NUEVA FUNCIONALIDAD
  const USE_NEW_VERSION = true; // Cambiar a false para usar versión anterior

  const form = useForm<z.infer<typeof signUpAdminSchema>>({
    resolver: zodResolver(signUpAdminSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      company: '',
      serviceType: '',
      city: '',
      phone: '',
      documentation: '',
    },
  });

  // Función para validar nombre de empresa con debounce
  const checkCompanyName = useCallback(async (name: string) => {
    if (!name || name.length < 2) {
      setCompanyNameStatus({ available: null, message: '', isChecking: false });
      return;
    }

    setCompanyNameStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const response = await fetch(`/api/check-supplier-name?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      
      setCompanyNameStatus({
        available: data.available,
        message: data.message,
        isChecking: false
      });
    } catch (error) {
      console.error('Error checking company name:', error);
      setCompanyNameStatus({
        available: null,
        message: 'Error al verificar disponibilidad',
        isChecking: false
      });
    }
  }, []);

  // Debounce para la validación del nombre de empresa
  useEffect(() => {
    const subscription = form.watch((value) => {
      const companyName = value.company;
      if (!companyName) {
        setCompanyNameStatus({ available: null, message: '', isChecking: false });
        return;
      }

      const timeoutId = setTimeout(() => {
        checkCompanyName(companyName);
      }, 500); // 500ms de debounce

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [checkCompanyName, form]);

  // Cargar países al montar el componente
  useEffect(() => {
    async function loadCountries() {
      try {
        const response = await fetch('/api/locations?type=countries');
        const countries = await response.json();
        setLocations(prev => ({ ...prev, countries }));
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    }
    loadCountries();
  }, []);

  // Cargar estados cuando se selecciona un país
  const loadStates = async (country: string) => {
    try {
      const response = await fetch(`/api/locations?type=states&country=${encodeURIComponent(country)}`);
      const states = await response.json();
      setLocations(prev => ({ 
        ...prev, 
        states, 
        cities: [], 
        selectedCountry: country, 
        selectedState: '' 
      }));
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  // Cargar ciudades cuando se selecciona un estado
  const loadCities = async (state: string) => {
    try {
      const response = await fetch(`/api/locations?type=cities&country=${encodeURIComponent(locations.selectedCountry)}&state=${encodeURIComponent(state)}`);
      const cities = await response.json();
      setLocations(prev => ({ 
        ...prev, 
        cities, 
        selectedState: state 
      }));
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  async function onSubmit(values: z.infer<typeof signUpAdminSchema>) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      // Usar nueva versión que separa User y Supplier
      const response = USE_NEW_VERSION 
        ? await registerAdminActionV2(values)
        : await registerAdminAction(values);
        
      if (response.error) {
        setError(response.error.toString());
        console.log(response.error);
      } else if (response.success) {
        setSuccess(response.message || "Solicitud enviada exitosamente.");
        setTimeout(() => {
          router.push('/login');
        }, 7000); // Más tiempo para leer el mensaje más largo
      }
    });
  }

  const serviceTypes = [
    { value: "tours", label: "🗺️ Tours y Actividades", description: "Experiencias turísticas, aventura, cultura" },
    { value: "hotels", label: "🏨 Hospedaje y Hoteles", description: "Hoteles, resorts, hostales, casas rurales" },
    { value: "transport", label: "🚐 Transporte", description: "Traslados, tours en vehículos, rent-a-car" },
    { value: "restaurant", label: "🍽️ Gastronomía", description: "Restaurantes, tours gastronómicos, catering" },
    { value: "events", label: "🎉 Eventos", description: "Bodas, conferencias, espectáculos" },
    { value: "wellness", label: "🧘 Bienestar", description: "Spas, yoga, retiros, terapias" },
    { value: "adventure", label: "🏔️ Deportes y Aventura", description: "Senderismo, buceo, deportes extremos" },
    { value: "culture", label: "🎭 Arte y Cultura", description: "Museos, galerías, talleres artesanales" },
    { value: "other", label: "📋 Otro", description: "Describe tu servicio en información adicional" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              🌟 Únete a Ketzal
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Convierte tu pasión por el turismo en tu negocio
            </CardDescription>
            <p className="text-sm text-gray-600 mt-2">
              Conecta con miles de viajeros y haz crecer tu empresa de servicios turísticos
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Información Personal */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Nombre Completo</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre completo"
                            type='text'
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>Email</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="tu@empresa.com"
                            type='email'
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Este será tu email para acceder a la plataforma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>            {/* Información de la Empresa */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Información del Negocio</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>Nombre de la Empresa</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Nombre de tu empresa"
                            type='text'
                            className={`h-11 pr-8 ${
                              companyNameStatus.available === true ? 'border-green-500 bg-green-50' :
                              companyNameStatus.available === false ? 'border-red-500 bg-red-50' : ''
                            }`}
                            {...field}
                          />
                          {companyNameStatus.isChecking && (
                            <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                          )}
                          {!companyNameStatus.isChecking && companyNameStatus.available === true && (
                            <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                          {!companyNameStatus.isChecking && companyNameStatus.available === false && (
                            <X className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </FormControl>
                      {companyNameStatus.message && (
                        <p className={`text-xs mt-1 ${
                          companyNameStatus.available === true ? 'text-green-600' : 
                          companyNameStatus.available === false ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {companyNameStatus.message}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Ubicación</span>
                  </FormLabel>
                  
                  {/* Selector de País */}
                  <Select onValueChange={loadStates}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Selector de Estado */}
                  {locations.states.length > 0 && (
                    <Select onValueChange={loadCities}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecciona tu estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Selector de Ciudad */}
                  {locations.cities.length > 0 && (
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Selecciona tu ciudad" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.cities.map((city) => (
                                  <SelectItem key={city.value} value={city.value}>
                                    {city.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Campo de Teléfono */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>Teléfono de Contacto</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        {/* Selector de código de país */}
                        <Select
                          defaultValue="+52"
                          onValueChange={(value) => {
                            // Al cambiar el código de país, actualiza el valor del campo phone con el nuevo prefijo si no está presente
                            if (!field.value?.startsWith(value)) {
                              field.onChange(value + ' ' + (field.value?.replace(/^\+\d+\s*/, '') || ''));
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 w-32 min-w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+52">🇲🇽 +52 MX</SelectItem>
                            <SelectItem value="+1">🇺🇸 +1 USA</SelectItem>
                            <SelectItem value="+57">🇨🇴 +57 Colombia</SelectItem>
                            <SelectItem value="+34">🇪🇸 +34 España</SelectItem>
                            <SelectItem value="+51">🇵🇪 +51 Perú</SelectItem>
                            <SelectItem value="+54">🇦🇷 +54 Argentina</SelectItem>
                            <SelectItem value="+56">🇨🇱 +56 Chile</SelectItem>
                            {/* Agrega más países si lo deseas */}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="614 123 4567"
                          type='tel'
                          className="h-11 flex-1"
                          {...field}
                          value={field.value?.replace(/^\+\d+\s*/, '') || ''}
                          onChange={e => {
                            // Mantener el prefijo seleccionado al editar el número
                            const prefixMatch = field.value?.match(/^\+\d+/);
                            const prefix = prefixMatch ? prefixMatch[0] : '+52';
                            field.onChange(prefix + ' ' + e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      📱 Este número será usado para WhatsApp y llamadas de soporte
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>Tipo de Servicio</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="¿Qué tipo de experiencias ofreces?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-gray-500">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el tipo de servicio que mejor describe tu negocio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Cuéntanos sobre tu negocio</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu experiencia, servicios destacados, años en el mercado, certificaciones, o cualquier información que ayude a acelerar tu aprobación..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      💡 Tip: Menciona tu experiencia, certificaciones, premios, o servicios únicos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contraseñas */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Seguridad de la Cuenta</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          placeholder="Crea una contraseña segura"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Mínimo 6 caracteres
                      </FormDescription>
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
                        <span>Confirmar Contraseña</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder="Repite tu contraseña"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-green-700 text-sm p-3 bg-green-50 border border-green-200 rounded-md">
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
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Enviando solicitud...</span>
                </div>
              ) : success ? (
                <div className="flex items-center space-x-2">
                  <span>✓ Solicitud enviada</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Unirme como Proveedor de Turismo</span>
                </div>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-700 font-medium">
              ¿Solo necesitas una cuenta de usuario?
            </p>
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
              Registro como viajero →
            </Link>
          </div>
          
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">Iniciar sesión</Link>
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
