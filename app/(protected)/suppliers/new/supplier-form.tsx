"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supplierSchema, mappedTypes, type Types } from "@/validations/supplierSchema"
import { useState, useEffect, useCallback } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

import { createSupplier, updateSupplier, checkDuplicateSupplier } from "@/app/(protected)/suppliers/suppliers.api"
import { useParams, useRouter } from "next/navigation"

type Supplier = {
    name?: string;
    description?: string;
    contactEmail?: string;
    phoneNumber?: string;
    address?: string;
    imgLogo?: string;
    type?: Types;
    supplierType?: string; // Para compatibilidad con el backend
};

export function SupplierForm({ supplier }: { supplier?: Supplier }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Duplicate validation states
    const [duplicateCheck, setDuplicateCheck] = useState({
        nameExists: false,
        emailExists: false,
        isChecking: false,
        existingSuppliers: [] as any[]
    });    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        resolver: zodResolver(supplierSchema),        defaultValues: {
            name: supplier?.name || '',
            description: supplier?.description || '',
            contactEmail: supplier?.contactEmail || '',
            phoneNumber: supplier?.phoneNumber || '',
            address: supplier?.address || '',
            type: (supplier?.type || supplier?.supplierType || 'agencia_tours') as Types,
            imgLogo: supplier?.imgLogo || '',
        }
    });

    const router = useRouter();
    const params = useParams<{ id: string }>();
    
    // Watch name and email fields for duplicate validation
    const watchedName = watch('name');
    const watchedEmail = watch('contactEmail');

    // Debounced duplicate check function
    const checkDuplicates = useCallback(async (name: string, email: string) => {
        if (!name && !email) return;
        
        setDuplicateCheck(prev => ({ ...prev, isChecking: true }));
        
        try {
            const result = await checkDuplicateSupplier(
                name || undefined, 
                email || undefined, 
                params?.id || undefined
            );
            
            setDuplicateCheck({
                nameExists: result.nameExists,
                emailExists: result.emailExists,
                isChecking: false,
                existingSuppliers: result.existingSuppliers
            });
        } catch (error) {
            console.error('Error checking duplicates:', error);
            setDuplicateCheck(prev => ({ ...prev, isChecking: false }));
        }
    }, [params?.id]);

    // Effect to check duplicates when name or email changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (watchedName || watchedEmail) {
                checkDuplicates(watchedName, watchedEmail);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [watchedName, watchedEmail, checkDuplicates]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);

            if (params?.id) {
                await updateSupplier(params.id, data);
                setSuccess('Proveedor actualizado correctamente');
            } else {
                console.log("create", data);
                await createSupplier(data);
                setSuccess('Proveedor creado correctamente');
            }

            // Wait a bit to show success message
            setTimeout(() => {
                router.push("/suppliers");
                router.refresh();
            }, 1500);
            
        } catch (err: any) {
            console.error('Error submitting form:', err);
            setError(err.message || 'Error al procesar la solicitud');
        } finally {
            setIsSubmitting(false);
        }
    });    return (
        <div className="space-y-6">
            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}

            {/* Duplicate Warning */}
            {(duplicateCheck.nameExists || duplicateCheck.emailExists) && duplicateCheck.existingSuppliers.length > 0 && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-medium">
                                {duplicateCheck.nameExists && duplicateCheck.emailExists
                                    ? "Ya existe un proveedor con el mismo nombre y email"
                                    : duplicateCheck.nameExists
                                    ? "Ya existe un proveedor con el mismo nombre"
                                    : "Ya existe un proveedor con el mismo email"}
                            </p>
                            <div className="space-y-1">
                                <p className="text-sm">Proveedores existentes:</p>
                                {duplicateCheck.existingSuppliers.map((existingSupplier) => (
                                    <div key={existingSupplier.id} className="text-sm bg-red-50 p-2 rounded border">
                                        <strong>{existingSupplier.name}</strong> - {existingSupplier.contactEmail}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">                {/* Supplier Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Proveedor *</Label>
                    <div className="relative">
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Ej: Wanderlust Travels"
                            className={`${errors.name ? "border-red-500" : ""} ${
                                duplicateCheck.nameExists ? "border-red-500" : ""
                            } ${watchedName && !duplicateCheck.nameExists && !duplicateCheck.isChecking ? "border-green-500" : ""}`}
                        />
                        {duplicateCheck.isChecking && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        )}
                        {watchedName && !duplicateCheck.isChecking && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {duplicateCheck.nameExists ? (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                    {duplicateCheck.nameExists && (
                        <p className="text-sm text-red-500">
                            Ya existe un proveedor con este nombre
                        </p>
                    )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Proveedor *</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(mappedTypes).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-sm text-red-500">{errors.type.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Describe los servicios que ofrece el proveedor..."
                        rows={3}
                        className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>                {/* Contact Email */}
                <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contacto *</Label>
                    <div className="relative">
                        <Input
                            id="contactEmail"
                            type="email"
                            {...register("contactEmail")}
                            placeholder="contacto@proveedor.com"
                            className={`${errors.contactEmail ? "border-red-500" : ""} ${
                                duplicateCheck.emailExists ? "border-red-500" : ""
                            } ${watchedEmail && !duplicateCheck.emailExists && !duplicateCheck.isChecking ? "border-green-500" : ""}`}
                        />
                        {duplicateCheck.isChecking && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        )}
                        {watchedEmail && !duplicateCheck.isChecking && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {duplicateCheck.emailExists ? (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {errors.contactEmail && (
                        <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                    )}
                    {duplicateCheck.emailExists && (
                        <p className="text-sm text-red-500">
                            Ya existe un proveedor con este email
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Número de Teléfono *</Label>
                    <Input
                        id="phoneNumber"
                        {...register("phoneNumber")}
                        placeholder="1234567890"
                        className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                        <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                    )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                        id="address"
                        {...register("address")}
                        placeholder="Dirección completa del proveedor"
                        className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                        <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                </div>                {/* Logo Upload */}
                <div className="space-y-2">
                    <Label htmlFor="imgLogo">Logo del Proveedor *</Label>
                    <Controller
                        name="imgLogo"
                        control={control}
                        render={({ field }) => (
                            <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.imgLogo?.message}
                                placeholder="Sube o ingresa la URL del logo del proveedor"
                            />
                        )}
                    />
                    {errors.imgLogo && (
                        <p className="text-sm text-red-500">{errors.imgLogo.message}</p>
                    )}
                </div>                {/* Submit Button */}
                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={
                        isSubmitting || 
                        duplicateCheck.nameExists || 
                        duplicateCheck.emailExists ||
                        duplicateCheck.isChecking
                    }
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {params?.id ? "Actualizando..." : "Creando..."}
                        </>
                    ) : duplicateCheck.isChecking ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verificando duplicados...
                        </>
                    ) : (
                        params?.id ? "Actualizar Proveedor" : "Crear Proveedor"
                    )}
                </Button>
            </form>
        </div>
    );
}