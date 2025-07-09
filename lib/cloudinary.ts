// Cloudinary configuration and upload utilities - SERVER SIDE ONLY
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (reutilizando las credenciales del API route existente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgmmzh8nb",
  api_key: process.env.CLOUDINARY_API_KEY || "766325626977677",
  api_secret: process.env.CLOUDINARY_API_SECRET || "g0qgbgJNL8rsG2Ng4X9rP6oxpow",
});

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
 * ⚠️ SERVER ONLY: Upload file to Cloudinary from server (server-side)
 * NO usar en componentes cliente - usar cloudinary-client.ts en su lugar
 */
export const uploadToCloudinaryServer = async (fileBuffer: Buffer, fileName: string, folder: string = 'suppliers'): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: fileName,
        overwrite: true,
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Unknown upload error'));
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * ⚠️ SERVER ONLY: Delete image from Cloudinary
 * NO usar en componentes cliente
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
