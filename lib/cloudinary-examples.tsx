/**
 * 🎯 Demo de Uso de las Funciones de Cloudinary
 * Ejemplos prácticos de cómo usar cada función
 */

// Este archivo muestra ejemplos de uso - NO ejecutar directamente
// Copia los ejemplos en tus componentes según necesites

import React, { useState, useCallback } from 'react';

// 🌐 Para componentes cliente (browser)
import { 
  uploadToCloudinaryAPI, 
  uploadToCloudinaryBrowser,
  getOptimizedImageUrl,
  deleteImageFromCloudinary,
  CloudinaryUploadResult
} from '@/lib/cloudinary-client';

// 🖥️ Para API routes y funciones servidor
// import { uploadToCloudinaryServer, deleteFromCloudinary } from '@/lib/cloudinary';

// ============================================================================
// 🚀 EJEMPLO 1: Upload usando API route (RECOMENDADO)
// ============================================================================

export const ExampleUploadAPI = () => {
  const handleFileUpload = async (file: File) => {
    try {
      // Validación básica
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Archivo muy grande (máx 5MB)');
      }

      // Upload usando el API route existente
      const result = await uploadToCloudinaryAPI(file, 'productos');
      
      console.log('✅ Upload exitoso!', {
        url: result.secure_url,
        size: result.size,
        name: result.name
      });

      return result.secure_url;
    } catch (error) {
      console.error('❌ Error en upload:', error);
      throw error;
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  );
};

// ============================================================================
// 🌐 EJEMPLO 2: Upload directo del browser
// ============================================================================

export const ExampleDirectUpload = () => {
  const handleDirectUpload = async (file: File) => {
    try {
      // Usa upload directo (requiere upload preset)
      const imageUrl = await uploadToCloudinaryBrowser(file);
      
      console.log('✅ URL de imagen:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // En un componente React
  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleDirectUpload(file);
        }}
      />
    </div>
  );
};

// ============================================================================
// 🖥️ EJEMPLO 3: Upload desde el servidor (API routes)
// ============================================================================

// En un API route (/api/my-upload/route.ts)
import { uploadToCloudinaryServer } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload usando función del servidor
    const result = await uploadToCloudinaryServer(
      buffer, 
      file.name.split('.')[0], // nombre sin extensión
      'mi-carpeta'
    );

    return Response.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// ============================================================================
// 🗑️ EJEMPLO 4: Eliminar imágenes
// ============================================================================

export const ExampleDeleteImage = async (publicId: string) => {
  try {
    await deleteImageFromCloudinary(publicId);
    console.log('✅ Imagen eliminada:', publicId);
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error);
  }
};

// ============================================================================
// 🔗 EJEMPLO 5: URLs optimizadas
// ============================================================================

export const ExampleOptimizedUrls = () => {
  const publicId = 'mi-carpeta/imagen-ejemplo';

  // URL básica optimizada
  const basicUrl = getOptimizedImageUrl(publicId);
  console.log('Basic URL:', basicUrl);

  // URL con transformaciones específicas
  const thumbnailUrl = getOptimizedImageUrl(publicId, [
    'w_150',
    'h_150', 
    'c_fill',
    'g_face'
  ]);
  console.log('Thumbnail URL:', thumbnailUrl);

  // URL para diferentes dispositivos
  const mobileUrl = getOptimizedImageUrl(publicId, [
    'w_400',
    'c_scale',
    'f_auto',
    'q_auto'
  ]);
  console.log('Mobile URL:', mobileUrl);

  return (
    <div>
      <img src={basicUrl} alt="Básica" />
      <img src={thumbnailUrl} alt="Thumbnail" />
      <img src={mobileUrl} alt="Móvil" />
    </div>
  );
};

// ============================================================================
// 🎨 EJEMPLO 6: Componente completo de upload
// ============================================================================

export const CloudinaryUploadComponent = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Usar la función recomendada
      const result = await uploadToCloudinaryAPI(file, 'gallery');
      
      setImageUrl(result.secure_url);
      console.log('Upload completado:', result);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error subiendo imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    
    try {
      // Extraer public_id de la URL para eliminar
      const publicId = imageUrl.split('/').pop()?.split('.')[0] || '';
      await deleteImageFromCloudinary(`gallery/${publicId}`);
      
      setImageUrl(null);
      console.log('Imagen eliminada');
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>🌥️ Cloudinary Upload Demo</h3>
      
      <input 
        type="file" 
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*"
      />
      
      {uploading && <p>⏳ Subiendo imagen...</p>}
      
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img 
            src={getOptimizedImageUrl(imageUrl, ['w_300', 'h_200', 'c_fit'])}
            alt="Imagen subida" 
            style={{ maxWidth: '300px' }}
          />
          <br />
          <button onClick={handleDelete} style={{ marginTop: '10px' }}>
            🗑️ Eliminar imagen
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 📱 EJEMPLO 7: Hook personalizado para uploads
// ============================================================================

export const useCloudinaryUpload = (folder: string = 'uploads') => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const result = await uploadToCloudinaryAPI(file, folder);
      return result.secure_url;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return null;
    } finally {
      setUploading(false);
    }
  }, [folder]);

  return { upload, uploading, error };
};

// Usar el hook:
export const ComponentWithHook = () => {
  const { upload, uploading, error } = useCloudinaryUpload('productos');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await upload(file);
    if (url) setImageUrl(url);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Subiendo...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {imageUrl && <img src={imageUrl} alt="Subida" style={{ maxWidth: '200px' }} />}
    </div>
  );
};

// ============================================================================
// 🎯 RESUMEN DE MEJORES PRÁCTICAS
// ============================================================================

/*
1. ✅ USA uploadToCloudinaryAPI para la mayoría de casos
   - Más seguro (credenciales en servidor)
   - Mejor control de errores
   - Reutiliza infraestructura existente

2. 🗂️ ORGANIZA por carpetas
   - uploadToCloudinaryAPI(file, 'productos')
   - uploadToCloudinaryAPI(file, 'perfiles')
   - uploadToCloudinaryAPI(file, 'banners')

3. 🎨 OPTIMIZA las imágenes
   - Usa getOptimizedImageUrl para diferentes tamaños
   - Aplicar transformaciones según el uso

4. 🧹 LIMPIA imágenes no usadas
   - Usar deleteFromCloudinary cuando elimines registros
   - Implementar lógica de limpieza automática

5. 📱 VALIDACIONES del cliente
   - Tamaño máximo (5MB)
   - Tipos de archivo permitidos
   - Dimensiones si es necesario

6. 🚀 MANEJO DE ESTADOS
   - Loading states para UX
   - Error handling apropiado
   - Feedback visual para el usuario
*/

export default {
  ExampleUploadAPI,
  ExampleDirectUpload,
  ExampleDeleteImage,
  ExampleOptimizedUrls,
  CloudinaryUploadComponent,
  useCloudinaryUpload,
  ComponentWithHook
};
