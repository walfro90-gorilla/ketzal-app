# Documentación Completa de APIs - Ketzal Marketplace

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [APIs Públicas](#apis-públicas)
3. [Componentes React](#componentes-react)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Funciones Utilitarias](#funciones-utilitarias)
6. [Esquemas de Validación](#esquemas-de-validación)
7. [Tipos e Interfaces](#tipos-e-interfaces)
8. [Ejemplos de Uso](#ejemplos-de-uso)

## 🎯 Descripción General

Ketzal es una plataforma de marketplace turístico desarrollada en Next.js 15 con TypeScript, que permite a usuarios gestionar servicios turísticos, planificar viajes, y administrar productos. La aplicación utiliza Prisma como ORM, NextAuth para autenticación, y Cloudinary para gestión de imágenes.

### Tecnologías Principales
- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Autenticación**: NextAuth v5
- **Validación**: Zod
- **Imágenes**: Cloudinary
- **Base de Datos**: PostgreSQL (via Prisma)

## 🌐 APIs Públicas

### 1. API de Autenticación

#### `GET /api/debug-session`
Obtiene información de depuración de la sesión actual.

**Respuesta:**
```json
{
  "session": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

#### `GET /api/force-logout`
Fuerza el cierre de sesión del usuario actual.

**Uso:**
```javascript
// Cliente
const logout = async () => {
  await fetch('/api/force-logout');
  window.location.reload();
};
```

### 2. API de Usuarios

#### `GET /api/users`
Obtiene la lista de usuarios del sistema.

**Parámetros de consulta:**
- `page`: Número de página (opcional)
- `limit`: Límite de resultados (opcional)

**Respuesta:**
```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "user" | "admin" | "supplier"
    }
  ]
}
```

#### `GET /api/check-user-email`
Verifica si un email ya está registrado.

**Parámetros de consulta:**
- `email`: Email a verificar

**Respuesta:**
```json
{
  "exists": boolean,
  "message": "string"
}
```

#### `GET /api/check-user-phone`
Verifica si un teléfono ya está registrado.

**Parámetros de consulta:**
- `phone`: Teléfono a verificar

**Respuesta:**
```json
{
  "exists": boolean,
  "message": "string"
}
```

### 3. API de Servicios

#### `GET /api/services`
Obtiene todos los servicios turísticos disponibles.

**Respuesta:**
```json
{
  "services": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "location": "string",
      "images": {
        "imgBanner": "string",
        "imgAlbum": ["string"]
      }
    }
  ]
}
```

#### `GET /api/services/[serviceId]`
Obtiene un servicio específico por ID.

**Parámetros:**
- `serviceId`: ID del servicio

### 4. API de Categorías

#### `GET /api/categories`
Obtiene todas las categorías de productos/servicios.

**Respuesta:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### 5. API de Ubicaciones

#### `GET /api/locations`
Obtiene ubicaciones disponibles para servicios.

**Parámetros de consulta:**
- `state`: Estado específico (opcional)
- `search`: Búsqueda de texto (opcional)

**Respuesta:**
```json
{
  "locations": [
    {
      "state": "string",
      "cities": ["string"]
    }
  ]
}
```

### 6. API de Reseñas

#### `GET /api/reviews`
Obtiene reseñas de servicios.

**Parámetros de consulta:**
- `serviceId`: ID del servicio (opcional)
- `limit`: Límite de resultados (opcional)

**Respuesta:**
```json
{
  "reviews": [
    {
      "id": "string",
      "rating": number,
      "comment": "string",
      "userId": "string",
      "serviceId": "string"
    }
  ]
}
```

### 7. API de Billetera

#### `GET /api/wallet`
Obtiene información de la billetera del usuario.

**Headers requeridos:**
- `Authorization`: Token de usuario

**Respuesta:**
```json
{
  "wallet": {
    "balance": number,
    "currency": "MXN" | "USD"
  }
}
```

### 8. API de Notificaciones

#### `GET /api/notifications`
Obtiene notificaciones del usuario.

**Parámetros de consulta:**
- `unread`: Solo no leídas (boolean, opcional)
- `limit`: Límite de resultados (opcional)

### 9. API de Gestión de Imágenes

#### `POST /api/upload`
Sube imágenes a Cloudinary.

**Body:**
```json
{
  "file": "File",
  "folder": "string"
}
```

#### `POST /api/delete-image`
Elimina una imagen de Cloudinary.

**Body:**
```json
{
  "publicId": "string"
}
```

### 10. API de Validación

#### `GET /api/check-supplier-name`
Verifica disponibilidad de nombre de proveedor.

**Parámetros de consulta:**
- `name`: Nombre a verificar

## ⚛️ Componentes React

### 1. Componentes de Autenticación

#### `LoginForm`
Formulario de inicio de sesión con validación.

**Props:**
```typescript
interface LoginFormProps {
  isVerified: boolean;
}
```

**Uso:**
```jsx
import { LoginForm } from '@/components/login-form';

<LoginForm isVerified={true} />
```

**Características:**
- Validación con Zod
- Manejo de errores
- Redirección automática
- Integración con NextAuth

#### `RegisterForm`
Formulario de registro de usuarios.

**Props:**
```typescript
interface RegisterFormProps {
  userType?: 'user' | 'supplier';
}
```

#### `ForgotPasswordForm`
Formulario para recuperación de contraseña.

**Props:**
```typescript
interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}
```

### 2. Componentes de UI

#### `Button`
Botón personalizable con variantes.

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Uso:**
```jsx
import { Button } from '@/components/ui/button';

<Button variant="outline" size="lg">
  Botón Personalizado
</Button>
```

#### `NotificationBell`
Campana de notificaciones con dropdown.

**Props:**
```typescript
interface NotificationBellProps {
  userId: string;
}
```

**Características:**
- Actualizaciones en tiempo real
- Marcado como leído
- Eliminación de notificaciones
- Navegación a detalles

### 3. Componentes de Planificador de Viajes

#### `ItineraryBuilder`
Constructor de itinerarios de viaje.

**Props:**
```typescript
interface ItineraryBuilderProps {
  plannerId?: string;
  onSave?: (itinerary: Itinerary) => void;
}
```

#### `PlannerCartTest`
Carrito de compras para el planificador.

**Características:**
- Gestión de productos
- Cálculo de totales
- Opciones de pago
- Persistencia local

### 4. Componentes de Productos

#### `ProductCard`
Tarjeta de producto con información básica.

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}
```

#### `ServiceCard`
Tarjeta de servicio turístico.

**Props:**
```typescript
interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
  showPricing?: boolean;
}
```

### 5. Componentes Administrativos

#### `SuperAdminPanel`
Panel de administración avanzado.

**Props:**
```typescript
interface SuperAdminPanelProps {
  permissions: AdminPermissions;
}
```

**Características:**
- Gestión de usuarios
- Estadísticas del sistema
- Configuración global
- Logs de actividad

#### `RegisterAdminForm`
Formulario de registro para administradores.

**Props:**
```typescript
interface RegisterAdminFormProps {
  onSuccess?: (admin: AdminUser) => void;
  requiredPermissions?: string[];
}
```

### 6. Componentes de Multimedia

#### `CloudinaryImage`
Componente optimizado para imágenes de Cloudinary.

**Props:**
```typescript
interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  transformations?: string[];
  className?: string;
}
```

**Uso:**
```jsx
import { CloudinaryImage } from '@/components/CloudinaryImage';

<CloudinaryImage
  publicId="samples/ecommerce/accessories-bag"
  alt="Producto ejemplo"
  width={300}
  height={200}
  transformations={['c_fill', 'q_auto']}
/>
```

#### `ImagesUploader`
Subidor de múltiples imágenes.

**Props:**
```typescript
interface ImagesUploaderProps {
  onUpload: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
  acceptedTypes?: string[];
}
```

### 7. Componentes de Navegación

#### `Header`
Encabezado principal de la aplicación.

**Props:**
```typescript
interface HeaderProps {
  user?: User;
  showSearch?: boolean;
  transparent?: boolean;
}
```

#### `Navbar`
Barra de navegación responsiva.

**Props:**
```typescript
interface NavbarProps {
  items: NavItem[];
  variant?: 'default' | 'compact';
}
```

## 🎣 Hooks Personalizados

### 1. Hooks de Autenticación

#### `useAuthDetection`
Detecta cambios en el estado de autenticación.

**Uso:**
```typescript
import { useAuthDetection } from '@/hooks/useAuthDetection';

const { isAuthenticated, user, loading, error } = useAuthDetection();

if (loading) return <div>Cargando...</div>;
if (error) return <div>Error: {error}</div>;
if (!isAuthenticated) return <LoginForm />;
```

**Retorna:**
```typescript
interface AuthDetectionReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}
```

#### `useSessionReady`
Verifica si la sesión está lista para usar.

**Uso:**
```typescript
import { useSessionReady } from '@/hooks/useSessionReady';

const { isReady, session } = useSessionReady();

if (!isReady) return <div>Inicializando sesión...</div>;
```

### 2. Hooks de UI

#### `useScrollDirection`
Detecta la dirección del scroll.

**Uso:**
```typescript
import { useScrollDirection } from '@/hooks/useScrollDirection';

const scrollDirection = useScrollDirection();

// scrollDirection será 'up' | 'down' | null
```

#### `useToast`
Sistema de notificaciones toast.

**Uso:**
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: "Éxito",
  description: "Operación completada",
  variant: "default"
});
```

#### `useMobile`
Detecta si el dispositivo es móvil.

**Uso:**
```typescript
import { useMobile } from '@/hooks/use-mobile';

const isMobile = useMobile();

return (
  <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
    {/* Contenido */}
  </div>
);
```

### 3. Hooks de Datos

#### `useFAQs`
Maneja preguntas frecuentes.

**Uso:**
```typescript
import { useFAQs } from '@/hooks/useFAQs';

const { faqs, loading, addFAQ, updateFAQ, deleteFAQ } = useFAQs();
```

#### `useSeatSelector`
Maneja la selección de asientos en tours.

**Uso:**
```typescript
import { useSeatSelector } from '@/hooks/useSeatSelector';

const {
  selectedSeats,
  availableSeats,
  selectSeat,
  unselectSeat,
  isSelected,
  totalCost
} = useSeatSelector({
  tourId: 'tour-123',
  maxSeats: 4,
  pricePerSeat: 100
});
```

**Props:**
```typescript
interface SeatSelectorConfig {
  tourId: string;
  maxSeats: number;
  pricePerSeat: number;
  reservedSeats?: string[];
}
```

## 🛠️ Funciones Utilitarias

### 1. Utilidades de Estilo

#### `cn`
Combina clases CSS usando clsx y tailwind-merge.

**Uso:**
```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  {
    'object-class': isActive,
    'other-class': !isActive
  }
);
```

### 2. Utilidades de Cloudinary

#### `uploadToCloudinaryAPI`
Sube archivos a Cloudinary desde el cliente.

**Uso:**
```typescript
import { uploadToCloudinaryAPI } from '@/lib/cloudinary-client';

const result = await uploadToCloudinaryAPI(file, 'productos');
console.log(result.secure_url); // URL de la imagen subida
```

**Parámetros:**
- `file`: Archivo a subir
- `folder`: Carpeta de destino (opcional)

**Retorna:**
```typescript
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}
```

#### `getOptimizedImageUrl`
Genera URLs optimizadas para imágenes de Cloudinary.

**Uso:**
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary-client';

const optimizedUrl = getOptimizedImageUrl(
  'samples/ecommerce/accessories-bag',
  ['c_fill', 'w_300', 'h_200', 'q_auto']
);
```

#### `deleteImageFromCloudinary`
Elimina imágenes de Cloudinary.

**Uso:**
```typescript
import { deleteImageFromCloudinary } from '@/lib/cloudinary-client';

await deleteImageFromCloudinary('samples/ecommerce/accessories-bag');
```

### 3. Utilidades de Email

#### `sendEmailVerification`
Envía email de verificación.

**Uso:**
```typescript
import { sendEmailVerification } from '@/lib/mail';

await sendEmailVerification('usuario@ejemplo.com', 'token-123');
```

#### `sendPasswordResetEmail`
Envía email de restablecimiento de contraseña.

**Uso:**
```typescript
import { sendPasswordResetEmail } from '@/lib/mail';

await sendPasswordResetEmail('usuario@ejemplo.com', 'reset-token-123');
```

### 4. API de Productos

#### `getAllProducts`
Obtiene todos los productos.

**Uso:**
```typescript
import { getAllProducts } from '@/lib/products-api';

const products = await getAllProducts();
```

#### `getProductById`
Obtiene un producto por ID.

**Uso:**
```typescript
import { getProductById } from '@/lib/products-api';

const product = await getProductById(123);
```

#### `searchProducts`
Busca productos por texto.

**Uso:**
```typescript
import { searchProducts } from '@/lib/products-api';

const results = await searchProducts('camping', 'travel-gear');
```

#### `filterProducts`
Filtra productos por criterios.

**Uso:**
```typescript
import { filterProducts } from '@/lib/products-api';

const filtered = await filterProducts({
  category: 'camping',
  minPrice: 50,
  maxPrice: 200,
  inStock: true
});
```

### 5. API de Billetera

#### `getWallet`
Obtiene información de billetera.

**Uso:**
```typescript
import { getWallet } from '@/lib/wallet-api';

const { success, wallet } = await getWallet(userId);
```

#### `addFunds`
Agrega fondos a la billetera.

**Uso:**
```typescript
import { addFunds } from '@/lib/wallet-api';

const success = await addFunds({
  userId,
  amount: 100,
  currency: 'MXN'
});
```

## 📝 Esquemas de Validación

### 1. Esquemas de Autenticación

#### `signInSchema`
Validación para inicio de sesión.

```typescript
import { signInSchema } from '@/lib/zod';

// Uso con React Hook Form
const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues: {
    email: "",
    password: ""
  }
});
```

**Campos:**
- `email`: Email válido (requerido)
- `password`: 8-32 caracteres (requerido)

#### `signUpSchema`
Validación para registro.

**Campos:**
- `email`: Email válido (requerido)
- `password`: 8-32 caracteres (requerido)
- `confirmPassword`: Debe coincidir con password
- `name`: Nombre de usuario (requerido)
- `phone`: Teléfono (opcional)

#### `resetPasswordSchema`
Validación para restablecimiento de contraseña.

**Campos:**
- `token`: Token de restablecimiento (requerido)
- `password`: Nueva contraseña 8-32 caracteres
- `confirmPassword`: Confirmación de contraseña

### 2. Esquemas de Servicios

#### `serviceSchema`
Validación para servicios turísticos.

**Uso:**
```typescript
import { serviceSchema } from '@/validations/serviceSchema';

const validatedData = serviceSchema.parse({
  name: "Tour Aventura",
  description: "Descripción del tour",
  price: 299.99,
  location: "Cancún, México",
  availableFrom: new Date(),
  availableTo: new Date(),
  packs: {
    data: [
      {
        name: "Paquete Básico",
        description: "Incluye...",
        qty: 1,
        price: 299.99
      }
    ]
  },
  images: {
    imgBanner: "https://cloudinary.com/banner.jpg",
    imgAlbum: [
      "https://cloudinary.com/img1.jpg",
      "https://cloudinary.com/img2.jpg",
      "https://cloudinary.com/img3.jpg",
      "https://cloudinary.com/img4.jpg"
    ]
  }
});
```

**Campos principales:**
- `name`: Nombre del servicio (max 100 caracteres)
- `description`: Descripción (max 500 caracteres)
- `price`: Precio positivo
- `location`: Ubicación (max 200 caracteres)
- `availableFrom`: Fecha de inicio
- `availableTo`: Fecha de fin
- `packs`: Array de paquetes (mínimo 1)
- `images`: Banner e imágenes del álbum (mínimo 4)

#### `supplierSchema`
Validación para proveedores.

**Campos:**
- `businessName`: Nombre del negocio
- `email`: Email de contacto
- `phone`: Teléfono de contacto
- `address`: Dirección física
- `description`: Descripción del proveedor

## 🏗️ Tipos e Interfaces

### 1. Tipos de Productos

#### `Product`
Interfaz principal de producto.

```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  stock: number;
  image: string;
  category?: string;
  images?: string[];
  specifications?: ProductSpecifications;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### `ProductSpecifications`
Especificaciones técnicas del producto.

```typescript
interface ProductSpecifications {
  weight?: string;
  dimensions?: string;
  material?: string;
  capacity?: string;
  features?: string[];
  [key: string]: string | string[] | undefined;
}
```

#### `ProductCategory`
Categorías de productos disponibles.

```typescript
type ProductCategory = 
  | 'travel-gear'    // Equipo de viaje
  | 'camping'        // Camping y outdoor
  | 'electronics'    // Electrónicos
  | 'apparel'        // Ropa y accesorios
  | 'souvenirs'      // Souvenirs y recuerdos
  | 'survival'       // Equipo de supervivencia
  | 'health'         // Salud y bienestar
  | 'food'           // Comida y bebidas
  | 'books'          // Libros y guías
  | 'accessories';   // Accesorios varios
```

### 2. Tipos de Planificador de Viajes

#### `PlannerCart`
Carrito del planificador.

```typescript
interface PlannerCart {
  id: string;
  plannerId: string;
  items: PlannerCartItem[];
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  currency: 'MXN' | 'USD';
  updatedAt: Date;
}
```

#### `TimelineService`
Servicio en la línea de tiempo.

```typescript
interface TimelineService {
  id: string;
  type: 'tour' | 'hotel' | 'transport' | 'activity';
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  location: string;
  duration: string;
  image?: string;
  imgBanner?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  isConfirmed?: boolean;
  isPaid?: boolean;
}
```

### 3. Tipos de Billetera

#### `Wallet`
Información de billetera del usuario.

```typescript
interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: 'MXN' | 'USD';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `WalletTransaction`
Transacciones de billetera.

```typescript
interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
```

### 4. Tipos de Reseñas

#### `Review`
Reseñas de servicios.

```typescript
interface Review {
  id: string;
  serviceId: string;
  userId: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  isVerified: boolean;
  helpful: number;
  createdAt: Date;
}
```

### 5. Tipos de FAQ

#### `FAQ`
Preguntas frecuentes.

```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Ejemplos de Uso

### 1. Autenticación Completa

```typescript
'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { useAuthDetection } from '@/hooks/useAuthDetection';
import { useSessionReady } from '@/hooks/useSessionReady';

export default function AuthExample() {
  const { isReady } = useSessionReady();
  const { isAuthenticated, user, loading } = useAuthDetection();

  if (!isReady || loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm isVerified={true} />;
  }

  return (
    <div>
      <h1>Bienvenido, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### 2. Subida de Imágenes

```typescript
'use client';

import { useState } from 'react';
import { uploadToCloudinaryAPI } from '@/lib/cloudinary-client';
import { CloudinaryImage } from '@/components/CloudinaryImage';

export default function ImageUploadExample() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadToCloudinaryAPI(file, 'productos')
      );
      
      const results = await Promise.all(uploadPromises);
      const urls = results.map(result => result.public_id);
      
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Subiendo imágenes...</p>}
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {uploadedImages.map((publicId, index) => (
          <CloudinaryImage
            key={index}
            publicId={publicId}
            alt={`Imagen ${index + 1}`}
            width={200}
            height={200}
            transformations={['c_fill', 'q_auto']}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Gestión de Productos

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAllProducts, searchProducts } from '@/lib/products-api';
import { ProductCard } from '@/components/product-card';
import type { Product, ProductCategory } from '@/types/product';

export default function ProductsExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const results = await searchProducts(term);
      setProducts(results);
    } catch (error) {
      console.error('Error buscando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Agregando al carrito:', product.name);
    // Implementar lógica del carrito
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            showActions={true}
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
```

### 4. Notificaciones

```typescript
'use client';

import { useEffect } from 'react';
import { NotificationBell } from '@/components/notification-bell';
import { useToast } from '@/hooks/use-toast';
import { useAuthDetection } from '@/hooks/useAuthDetection';

export default function NotificationsExample() {
  const { user } = useAuthDetection();
  const { toast } = useToast();

  useEffect(() => {
    // Simular notificación de bienvenida
    if (user) {
      toast({
        title: "¡Bienvenido!",
        description: `Hola ${user.name}, tienes nuevas notificaciones.`,
        duration: 5000,
      });
    }
  }, [user, toast]);

  if (!user) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Panel de Usuario</h1>
        <NotificationBell userId={user.id} />
      </div>
      
      <div className="space-y-4">
        <p>Contenido principal de la aplicación...</p>
      </div>
    </div>
  );
}
```

### 5. Selección de Asientos

```typescript
'use client';

import { useSeatSelector } from '@/hooks/useSeatSelector';
import { Button } from '@/components/ui/button';

export default function SeatSelectionExample() {
  const {
    selectedSeats,
    availableSeats,
    selectSeat,
    unselectSeat,
    isSelected,
    totalCost
  } = useSeatSelector({
    tourId: 'tour-aventura-123',
    maxSeats: 4,
    pricePerSeat: 299.99,
    reservedSeats: ['A1', 'A2'] // Asientos ya reservados
  });

  const handleSeatClick = (seatId: string) => {
    if (isSelected(seatId)) {
      unselectSeat(seatId);
    } else {
      selectSeat(seatId);
    }
  };

  return (
    <div className="p-6">
      <h2>Selecciona tus asientos</h2>
      <p>Precio por asiento: $299.99 MXN</p>
      
      <div className="grid grid-cols-4 gap-2 my-6">
        {availableSeats.map(seat => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            disabled={seat.isReserved}
            className={`
              p-3 border rounded
              ${seat.isReserved 
                ? 'bg-gray-300 cursor-not-allowed' 
                : isSelected(seat.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-100'
              }
            `}
          >
            {seat.id}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <p>Asientos seleccionados: {selectedSeats.length}</p>
        <p>Total: ${totalCost.toFixed(2)} MXN</p>
        
        <Button 
          className="mt-4"
          disabled={selectedSeats.length === 0}
        >
          Confirmar Selección
        </Button>
      </div>
    </div>
  );
}
```

### 6. Formulario de Servicio con Validación

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema } from '@/validations/serviceSchema';
import type { z } from 'zod';

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServiceFormExample() {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      location: '',
      availableFrom: new Date(),
      availableTo: new Date(),
      packs: {
        data: [
          {
            name: '',
            description: '',
            qty: 1,
            price: 0
          }
        ]
      },
      images: {
        imgBanner: '',
        imgAlbum: []
      }
    }
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      console.log('Datos del servicio:', data);
      // Aquí enviarías los datos al backend
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Servicio creado exitosamente!');
      form.reset();
    } catch (error) {
      console.error('Error creando servicio:', error);
      alert('Error al crear el servicio');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
      <h2>Crear Nuevo Servicio</h2>
      
      <div>
        <label htmlFor="name">Nombre del Servicio</label>
        <input
          {...form.register('name')}
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Ej: Tour de Aventura en Cancún"
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description">Descripción</label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full p-3 border rounded"
          placeholder="Describe tu servicio turístico..."
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price">Precio</label>
          <input
            {...form.register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full p-3 border rounded"
            placeholder="299.99"
          />
          {form.formState.errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location">Ubicación</label>
          <input
            {...form.register('location')}
            type="text"
            className="w-full p-3 border rounded"
            placeholder="Cancún, Quintana Roo"
          />
          {form.formState.errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting ? 'Creando...' : 'Crear Servicio'}
      </Button>
    </form>
  );
}
```

---

## 📞 Soporte

Para más información sobre la implementación o uso de cualquier componente, función o API, consulta:

1. **Código fuente**: Todos los componentes incluyen documentación inline
2. **Tipos TypeScript**: Las interfaces proporcionan información detallada
3. **Ejemplos**: Esta documentación incluye ejemplos prácticos para cada caso de uso
4. **Esquemas de validación**: Zod schemas documentan todos los campos requeridos

## 📝 Notas Importantes

1. **Autenticación**: La mayoría de APIs requieren autenticación válida
2. **Validación**: Todos los formularios usan esquemas Zod para validación
3. **Imágenes**: Se recomienda usar CloudinaryImage para optimización automática
4. **Responsive**: Todos los componentes son responsivos por defecto
5. **Accesibilidad**: Los componentes siguen estándares WCAG
6. **Tipos**: Utiliza TypeScript para mejor desarrollo y documentación automática

Esta documentación cubre todas las funciones públicas, componentes y APIs disponibles en el sistema Ketzal Marketplace. Cada ejemplo incluye el código necesario para implementar funcionalidades específicas de manera eficiente y segura.