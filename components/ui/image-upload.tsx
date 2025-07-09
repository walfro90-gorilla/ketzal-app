"use client"

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Upload, X, Image as ImageIcon, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { uploadToCloudinaryBrowser } from "@/lib/cloudinary-client";

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
}

export function ImageUpload({ value, onChange, onBlur, error, disabled, placeholder }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isValidatingUrl, setIsValidatingUrl] = useState(false);
    const [urlValidationStatus, setUrlValidationStatus] = useState<'valid' | 'invalid' | 'pending' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validar URL de imagen
    const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
        if (!url) return false;
        
        try {
            // Verificar que sea una URL válida
            new URL(url);
            
            // Verificar que la URL apunte a una imagen válida
            const response = await fetch(url, { method: 'HEAD' });
            
            if (!response.ok) return false;
            
            const contentType = response.headers.get('content-type');
            return contentType ? contentType.startsWith('image/') : false;
        } catch {
            return false;
        }
    }, []);

    // Validar URL con debounce
    const validateUrlDebounced = useCallback(async (url: string) => {
        if (!url || url.startsWith('blob:')) {
            setUrlValidationStatus(null);
            return;
        }

        setIsValidatingUrl(true);
        setUrlValidationStatus('pending');
        
        // Debounce de 1 segundo
        setTimeout(async () => {
            try {
                const isValid = await validateImageUrl(url);
                setUrlValidationStatus(isValid ? 'valid' : 'invalid');
            } catch (error) {
                console.error('Error validating image URL:', error);
                setUrlValidationStatus('invalid');
            } finally {
                setIsValidatingUrl(false);
            }
        }, 1000);
    }, [validateImageUrl]);

    // Upload a Cloudinary real
    const uploadToCloudinary = async (file: File): Promise<string> => {
        try {
            // Usar la función optimizada que ya funciona
            return await uploadToCloudinaryBrowser(file);
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            return;
        }

        setIsUploading(true);
        try {
            // Crear URL temporal para preview inmediato
            const tempUrl = URL.createObjectURL(file);
            onChange(tempUrl);
            
            // Subir a Cloudinary
            const uploadedUrl = await uploadToCloudinary(file);
            onChange(uploadedUrl);
            
            // Limpiar URL temporal si se subió exitosamente
            if (uploadedUrl !== tempUrl) {
                URL.revokeObjectURL(tempUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Mantener la URL temporal en caso de error
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        onChange(url);
        setImageError(false);
        
        // Validar URL si tiene contenido
        if (url.trim()) {
            validateUrlDebounced(url);
        } else {
            setUrlValidationStatus(null);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    const removeImage = () => {
        onChange('');
        setImageError(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <Label>Logo del Proveedor *</Label>
            
            {/* Upload Area */}
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${error ? 'border-red-500' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={disabled}
                />
                
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Subiendo imagen...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            Arrastra una imagen aquí o <span className="text-blue-600 font-medium">haz clic para seleccionar</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                )}
            </div>            {/* URL Input Alternative */}
            <div className="relative">
                <Label className="text-sm text-gray-600">O ingresa una URL de imagen</Label>
                <div className="flex mt-1">
                    <div className="relative flex-1">
                        <Input
                            type="url"
                            value={value || ''}
                            onChange={handleUrlChange}
                            onBlur={onBlur}
                            placeholder={placeholder || "https://example.com/image.jpg"}
                            className={`${error ? "border-red-500" : ""} ${
                                urlValidationStatus === 'valid' ? "border-green-500" : ""
                            } ${urlValidationStatus === 'invalid' ? "border-red-500" : ""}`}
                            disabled={disabled}
                        />
                        {/* Validation Status Icon */}
                        {value && !value.startsWith('blob:') && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {isValidatingUrl ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : urlValidationStatus === 'valid' ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : urlValidationStatus === 'invalid' ? (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : null}
                            </div>
                        )}
                    </div>
                    {value && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => window.open(value, '_blank')}
                            disabled={urlValidationStatus === 'invalid'}
                        >
                            <ExternalLink className="h-4 w-4" />                        </Button>
                    )}
                </div>
                
                {/* URL Validation Messages */}
                {value && !value.startsWith('blob:') && (
                    <div className="mt-2">
                        {urlValidationStatus === 'valid' && (
                            <p className="text-sm text-green-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                URL de imagen válida
                            </p>
                        )}
                        {urlValidationStatus === 'invalid' && (
                            <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                URL inválida o no apunta a una imagen
                            </p>
                        )}
                        {isValidatingUrl && (
                            <p className="text-sm text-gray-600 flex items-center">
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Validando URL...
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Image Preview */}
            {value && (
                <div className="relative">
                    <Label className="text-sm text-gray-600">Vista previa</Label>
                    <div className="mt-2 relative inline-block">
                        {!imageError ? (
                            <img
                                src={value}
                                alt="Vista previa del logo"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                        )}
                        
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={removeImage}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    
                    {imageError && (
                        <p className="text-xs text-red-500 mt-1">
                            No se pudo cargar la imagen. Verifica la URL.
                        </p>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
