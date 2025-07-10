'use client'

import { useState } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/4' | 'auto'
  sizes?: string
  priority?: boolean
  style?: React.CSSProperties
  placeholder?: 'blur' | 'empty'
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  aspectRatio = 'auto',
  sizes = '100vw',
  priority = false,
  style,
  placeholder = 'blur',
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    console.log('Error loading image:', src)
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case '4/3':
        return 'aspect-[4/3]'
      case '16/9':
        return 'aspect-[16/9]'
      case '3/4':
        return 'aspect-[3/4]'
      default:
        return ''
    }
  }

  const placeholderSrc = '/placeholder.svg'

  // Crear un placeholder blur para mejor UX
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPg=='

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${getAspectRatioClass()} ${className}`} style={style}>
        <span className="text-gray-500 text-sm">Error loading image</span>
      </div>
    )
  }

  // Para imágenes con aspectRatio, usar fill dentro de un contenedor con altura definida
  if (aspectRatio !== 'auto') {
    return (
      <div className={`relative ${getAspectRatioClass()} overflow-hidden`} style={style}>
        {isLoading && placeholder === 'blur' && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={src || placeholderSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
          unoptimized
        />
      </div>
    )
  }

  // Para imágenes con dimensiones específicas o auto que deben llenar el contenedor
  if (width && height) {
    return (
      <div className="relative" style={style}>
        {isLoading && placeholder === 'blur' && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={src || placeholderSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
          unoptimized
        />
      </div>
    )
  }

  // Para imágenes auto que deben llenar todo el contenedor padre
  return (
    <div className="relative h-full w-full" style={style}>
      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src || placeholderSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        unoptimized
      />
    </div>
  )
}

export default OptimizedImage
