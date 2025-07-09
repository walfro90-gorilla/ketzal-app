/**
 * 🌐 Funciones de Cloudinary para el CLIENTE (Browser)
 * Solo incluye funciones que pueden ejecutarse en el browser
 */

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  url?: string;
  size?: number;
  name?: string;
}

/**
 * 🚀 RECOMENDADO: Usa el API route existente que ya funciona
 * Esta función reutiliza la funcionalidad del componente ImageUploader
 */
export const uploadToCloudinaryAPI = async (file: File, folder: string = 'suppliers'): Promise<CloudinaryUploadResult> => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
  
  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds the 5MB limit.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    // Usar el endpoint API existente que ya funciona
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      public_id: data.name || file.name,
      secure_url: data.url,
      url: data.url,
      width: 0, // No disponible en la respuesta actual
      height: 0, // No disponible en la respuesta actual
      format: file.name.split('.').pop() || 'unknown',
      resource_type: 'image',
      size: data.size,
      name: data.name
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * 📝 LEGACY: Función mantenida para compatibilidad
 * Redirige al API route para evitar problemas de cliente/servidor
 */
export const uploadToCloudinaryBrowser = async (file: File): Promise<string> => {
  const result = await uploadToCloudinaryAPI(file);
  return result.secure_url;
};

/**
 * Get optimized image URL - versión cliente
 * No requiere módulos de servidor
 */
export const getOptimizedImageUrl = (publicId: string, transformations?: string[]): string => {
  // Usar la variable de entorno pública o el fallback
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dgmmzh8nb";
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transforms = transformations ? transformations.join(',') : 'w_800,h_600,c_limit,q_auto:good,f_auto';
  return `${baseUrl}/${transforms}/${publicId}`;
};

/**
 * 🗑️ Eliminar imagen - usando API route
 * Para evitar exponer credenciales en el cliente
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};