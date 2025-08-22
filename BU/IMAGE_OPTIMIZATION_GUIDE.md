# Guía de Manejo de Imágenes Simplificado

## Problemas Resueltos

### 1. Error de altura 0 con fill
**Problema**: `Image with src "..." has "fill" and a height value of 0`
**Solución**: Se creó el componente `OptimizedImage` que maneja correctamente los contenedores con `aspect-ratio`.

### 2. Imágenes no se cargan correctamente
**Problema**: URLs de Cloudinary no se cargan consistentemente
**Solución**: 
- Se deshabilitó la optimización de imágenes temporalmente con `unoptimized: true`
- Se creó un componente con manejo de errores mejorado
- Se agregó un placeholder SVG para errores

### 3. Configuración simplificada
**Problema**: Configuración compleja de Next.js para imágenes
**Solución**: Se simplificó la configuración en `next.config.ts`:
```typescript
images: {
  formats: ['image/webp'], // Solo WebP
  unoptimized: true,       // Deshabilitado para desarrollo
  deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Tamaños reducidos
}
```

## Cómo Usar OptimizedImage

### Uso Básico
```tsx
import OptimizedImage from '@/components/OptimizedImage'

<OptimizedImage
  src="https://ejemplo.com/imagen.jpg"
  alt="Descripción de la imagen"
  aspectRatio="4/3"
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

### Aspect Ratios Disponibles
- `square` - Para imágenes cuadradas
- `4/3` - Para cards de productos/tours
- `16/9` - Para banners y hero sections
- `3/4` - Para imágenes verticales
- `auto` - Para imágenes con dimensiones específicas

### Ejemplos de Uso

#### Para Cards de Tours
```tsx
<OptimizedImage
  src={tour.image}
  alt={tour.name}
  aspectRatio="4/3"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
/>
```

#### Para Hero Section
```tsx
<OptimizedImage
  src={slide.image}
  alt={slide.title}
  aspectRatio="16/9"
  sizes="100vw"
  priority={true}
/>
```

#### Para Categorías
```tsx
<OptimizedImage
  src={category.image}
  alt={category.name}
  aspectRatio="square"
  sizes="(max-width: 640px) 100vw, 25vw"
/>
```

## Características del Componente

### Manejo de Errores
- Fallback automático a placeholder cuando la imagen falla
- Logging de errores para debugging
- UI de error amigable

### Performance
- Lazy loading por defecto
- Optimización de tamaños según viewport
- Skeleton loading mientras carga

### Responsive
- Aspect ratios consistentes en todos los dispositivos
- Tamaños optimizados para diferentes pantallas
- Transiciones suaves

## Migración de Componentes

### Antes (con problemas)
```tsx
<div className="relative aspect-[4/3] overflow-hidden">
  <Image
    src={image}
    alt={alt}
    fill
    style={{ objectFit: 'cover' }}
    className="..."
  />
</div>
```

### Después (optimizado)
```tsx
<OptimizedImage
  src={image}
  alt={alt}
  aspectRatio="4/3"
  className="..."
/>
```

## Recomendaciones

1. **Usa aspect ratios consistentes** en toda la aplicación
2. **Especifica sizes correctamente** para mejor performance
3. **Usa priority={true}** solo para imágenes above-the-fold
4. **Maneja errores de carga** con fallbacks apropiados
5. **Optimiza URLs de Cloudinary** con parámetros de transformación

## Debugging

Para debuggear problemas con imágenes:

1. Verifica que la URL sea accesible
2. Revisa la consola para errores de carga
3. Usa las herramientas de desarrollo para inspeccionar el network
4. Verifica que el placeholder.svg esté disponible

## URLs de Cloudinary Optimizadas

Usa estos parámetros para mejor performance:
- `c_fill` - Crop y fill
- `w_1920,h_1080` - Dimensiones específicas
- `q_auto` - Calidad automática
- `f_auto` - Formato automático
