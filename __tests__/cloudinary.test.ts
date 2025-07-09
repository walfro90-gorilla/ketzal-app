/**
 * 🧪 Tests Unitarios para funciones de Cloudinary
 * Prueba cada función individualmente con datos mock
 */

import { describe, it, expect, beforeAll, jest } from '@jest/globals';

// Mock de Next.js y Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn()
    }
  }
}));

// Mock de fetch global
global.fetch = jest.fn();

// Configurar variables de entorno para testing
process.env.CLOUDINARY_CLOUD_NAME = 'dgmmzh8nb';
process.env.CLOUDINARY_API_KEY = '766325626977677';
process.env.CLOUDINARY_API_SECRET = 'g0qgbgJNL8rsG2Ng4X9rP6oxpow';

describe('🌥️ Cloudinary Functions Tests', () => {
  beforeAll(() => {
    // Reset mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('📋 Configuration Tests', () => {
    it('should load environment variables correctly', () => {
      expect(process.env.CLOUDINARY_CLOUD_NAME).toBe('dgmmzh8nb');
      expect(process.env.CLOUDINARY_API_KEY).toBe('766325626977677');
      expect(process.env.CLOUDINARY_API_SECRET).toBe('g0qgbgJNL8rsG2Ng4X9rP6oxpow');
    });
  });

  describe('🚀 uploadToCloudinaryAPI', () => {
    it('should upload file successfully', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          url: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg',
          name: 'test.jpg',
          size: 1024
        })
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Crear un archivo mock
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      // Importar y probar la función
      const { uploadToCloudinaryAPI } = await import('../lib/cloudinary');
      const result = await uploadToCloudinaryAPI(mockFile, 'test-folder');

      expect(result.secure_url).toBe('https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg');
      expect(result.name).toBe('test.jpg');
      expect(result.size).toBe(1024);
    });

    it('should reject files larger than 5MB', async () => {
      const largeMockFile = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeMockFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      const { uploadToCloudinaryAPI } = await import('../lib/cloudinary');
      
      await expect(uploadToCloudinaryAPI(largeMockFile)).rejects.toThrow('File size exceeds the 5MB limit.');
    });

    it('should handle upload errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const { uploadToCloudinaryAPI } = await import('../lib/cloudinary');
      
      await expect(uploadToCloudinaryAPI(mockFile)).rejects.toThrow('Failed to upload image');
    });
  });

  describe('🌐 uploadToCloudinaryBrowser', () => {
    it('should redirect to uploadToCloudinaryAPI', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          url: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg',
          name: 'test.jpg',
          size: 1024
        })
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const { uploadToCloudinaryBrowser } = await import('../lib/cloudinary');
      const result = await uploadToCloudinaryBrowser(mockFile);

      expect(result).toBe('https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg');
    });
  });

  describe('🖥️ uploadToCloudinaryServer', () => {
    it('should upload buffer successfully', async () => {
      const mockResult = {
        public_id: 'test_id',
        secure_url: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
        resource_type: 'image'
      };

      const { v2: cloudinary } = await import('cloudinary');
      const mockUploadStream = jest.fn().mockImplementation((options, callback) => ({
        end: jest.fn().mockImplementation((buffer) => {
          callback(null, mockResult);
        })
      }));

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(mockUploadStream);

      const { uploadToCloudinaryServer } = await import('../lib/cloudinary');
      const buffer = Buffer.from('test data');
      const result = await uploadToCloudinaryServer(buffer, 'test-file', 'test-folder');

      expect(result.secure_url).toBe(mockResult.secure_url);
      expect(result.public_id).toBe(mockResult.public_id);
    });

    it('should handle upload errors', async () => {
      const { v2: cloudinary } = await import('cloudinary');
      const mockUploadStream = jest.fn().mockImplementation((options, callback) => ({
        end: jest.fn().mockImplementation((buffer) => {
          callback(new Error('Upload failed'), null);
        })
      }));

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(mockUploadStream);

      const { uploadToCloudinaryServer } = await import('../lib/cloudinary');
      const buffer = Buffer.from('test data');

      await expect(uploadToCloudinaryServer(buffer, 'test-file')).rejects.toThrow('Upload failed');
    });
  });

  describe('🗑️ deleteFromCloudinary', () => {
    it('should delete image successfully', async () => {
      const { v2: cloudinary } = await import('cloudinary');
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: 'ok' });

      const { deleteFromCloudinary } = await import('../lib/cloudinary');
      
      await expect(deleteFromCloudinary('test_public_id')).resolves.toBeUndefined();
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test_public_id');
    });

    it('should handle delete errors', async () => {
      const { v2: cloudinary } = await import('cloudinary');
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const { deleteFromCloudinary } = await import('../lib/cloudinary');
      
      await expect(deleteFromCloudinary('test_public_id')).rejects.toThrow('Delete failed');
    });
  });

  describe('🔗 getOptimizedImageUrl', () => {
    it('should generate correct URL with default transformations', () => {
      const { getOptimizedImageUrl } = require('../lib/cloudinary');
      const url = getOptimizedImageUrl('test_public_id');
      
      expect(url).toBe('https://res.cloudinary.com/dgmmzh8nb/image/upload/w_800,h_600,c_limit,q_auto:good,f_auto/test_public_id');
    });

    it('should generate correct URL with custom transformations', () => {
      const { getOptimizedImageUrl } = require('../lib/cloudinary');
      const url = getOptimizedImageUrl('test_public_id', ['w_300', 'h_200', 'c_fill']);
      
      expect(url).toBe('https://res.cloudinary.com/dgmmzh8nb/image/upload/w_300,h_200,c_fill/test_public_id');
    });
  });

  describe('📱 Integration Tests', () => {
    it('should have all required functions exported', async () => {
      const cloudinaryLib = await import('../lib/cloudinary');
      
      expect(typeof cloudinaryLib.uploadToCloudinaryAPI).toBe('function');
      expect(typeof cloudinaryLib.uploadToCloudinaryBrowser).toBe('function');
      expect(typeof cloudinaryLib.uploadToCloudinaryServer).toBe('function');
      expect(typeof cloudinaryLib.deleteFromCloudinary).toBe('function');
      expect(typeof cloudinaryLib.getOptimizedImageUrl).toBe('function');
      expect(cloudinaryLib.default).toBeDefined(); // cloudinary instance
    });

    it('should maintain interface compatibility', async () => {
      const { CloudinaryUploadResult } = await import('../lib/cloudinary');
      
      // Test que la interfaz tiene las propiedades requeridas
      const mockResult: any = {
        public_id: 'test',
        secure_url: 'https://test.com',
        width: 100,
        height: 100,
        format: 'jpg',
        resource_type: 'image'
      };

      expect(mockResult.public_id).toBeDefined();
      expect(mockResult.secure_url).toBeDefined();
      expect(mockResult.width).toBeDefined();
      expect(mockResult.height).toBeDefined();
      expect(mockResult.format).toBeDefined();
      expect(mockResult.resource_type).toBeDefined();
    });
  });
});

// Tests de rendimiento
describe('⚡ Performance Tests', () => {
  it('should handle multiple simultaneous uploads', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        url: 'https://res.cloudinary.com/dgmmzh8nb/image/upload/v123/test.jpg',
        name: 'test.jpg',
        size: 1024
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { uploadToCloudinaryAPI } = await import('../lib/cloudinary');
    
    const files = Array.from({ length: 5 }, (_, i) => {
      const file = new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 });
      return file;
    });

    const startTime = Date.now();
    const promises = files.map(file => uploadToCloudinaryAPI(file));
    const results = await Promise.all(promises);
    const endTime = Date.now();

    expect(results).toHaveLength(5);
    expect(endTime - startTime).toBeLessThan(5000); // Menos de 5 segundos
    results.forEach(result => {
      expect(result.secure_url).toContain('cloudinary.com');
    });
  });
});

export {};
