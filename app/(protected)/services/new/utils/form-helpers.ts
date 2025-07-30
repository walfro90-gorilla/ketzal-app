import type { ImagesInput } from "../types/service-form.types"

/**
 * Normaliza el campo de imágenes para el formulario
 */
export function normalizeImages(images: unknown): { imgBanner: string; imgAlbum: string[] } {
  if (
    images &&
    typeof images === "object" &&
    !Array.isArray(images) &&
    "imgBanner" in images &&
    "imgAlbum" in images
  ) {
    const imgBanner = (images as ImagesInput).imgBanner ?? ""
    const imgAlbumRaw = (images as ImagesInput).imgAlbum
    const imgAlbum = Array.isArray(imgAlbumRaw)
      ? imgAlbumRaw.filter((x): x is string => typeof x === "string")
      : typeof imgAlbumRaw === "string"
        ? [imgAlbumRaw]
        : []
    return { imgBanner: String(imgBanner), imgAlbum }
  }
  return { imgBanner: "", imgAlbum: [] }
}

/**
 * Valida si un campo está completo
 */
export function isFieldComplete(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return value > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Formatea un precio para mostrar
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price)
}

/**
 * Valida una URL de YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return youtubeRegex.test(url)
}

/**
 * Extrae el ID del video de YouTube de una URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Genera una URL de miniatura de YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' = 'medium'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

/**
 * Valida un número de teléfono mexicano
 */
export function isValidMexicanPhone(phone: string): boolean {
  const phoneRegex = /^(\+52|52)?[1-9][0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Formatea un número de teléfono mexicano
 */
export function formatMexicanPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+52 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Valida un código postal mexicano
 */
export function isValidMexicanPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[0-9]{5}$/
  return postalCodeRegex.test(postalCode)
}

/**
 * Genera un ID único para elementos del formulario
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function para optimizar inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para optimizar eventos
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const validateImages = (images: string[]): string[] => {
  return images.filter(image => 
    typeof image === 'string' && image.trim() !== ''
  );
};

export const validatePriceRanges = (ranges: PriceRange[]): PriceRange[] => {
  return ranges.filter(range => 
    range && 
    typeof range.startDate === 'string' && 
    typeof range.endDate === 'string' &&
    typeof range.price === 'number' &&
    range.price > 0
  );
}; 