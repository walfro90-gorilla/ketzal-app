# Guía de Referencia Rápida - Ketzal Marketplace

## 🚀 Inicio Rápido

### Instalación y Configuración

```bash
# Clonar e instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

### Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (auth)/            # Páginas de autenticación
│   └── (protected)/       # Páginas protegidas
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── admin/            # Componentes administrativos
│   └── travel-planner/   # Componentes del planificador
├── hooks/                # Custom hooks
├── lib/                  # Funciones utilitarias
├── types/                # Tipos TypeScript
└── validations/          # Esquemas Zod
```

## 🔑 APIs Esenciales

### Autenticación

```javascript
// Verificar sesión
GET /api/debug-session

// Cerrar sesión forzada
GET /api/force-logout

// Verificar email disponible
GET /api/check-user-email?email=test@example.com
```

### Usuarios

```javascript
// Obtener usuarios
GET /api/users?page=1&limit=10

// Verificar teléfono
GET /api/check-user-phone?phone=5551234567
```

### Servicios

```javascript
// Listar servicios
GET /api/services

// Obtener servicio específico
GET /api/services/[serviceId]
```

### Ubicaciones y Categorías

```javascript
// Obtener ubicaciones
GET /api/locations?state=quintana-roo

// Obtener categorías
GET /api/categories
```

### Gestión de Imágenes

```javascript
// Subir imagen
POST /api/upload
Content-Type: multipart/form-data
{ file: File, folder: "string" }

// Eliminar imagen
POST /api/delete-image
{ publicId: "string" }
```

## ⚛️ Componentes Principales

### Autenticación

```jsx
import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';

// Formulario de login
<LoginForm isVerified={true} />

// Formulario de registro
<RegisterForm userType="user" />
```

### UI Base

```jsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Botones con variantes
<Button variant="outline" size="lg">Cancelar</Button>
<Button variant="default">Confirmar</Button>

// Input básico
<Input placeholder="Ingresa tu email" type="email" />
```

### Notificaciones

```jsx
import { NotificationBell } from '@/components/notification-bell';
import { useToast } from '@/hooks/use-toast';

// Campana de notificaciones
<NotificationBell userId={user.id} />

// Toast notification
const { toast } = useToast();
toast({
  title: "Éxito",
  description: "Operación completada",
  variant: "default"
});
```

### Imágenes Optimizadas

```jsx
import { CloudinaryImage } from '@/components/CloudinaryImage';

<CloudinaryImage
  publicId="samples/ecommerce/accessories-bag"
  alt="Producto"
  width={300}
  height={200}
  transformations={['c_fill', 'q_auto']}
/>
```

## 🎣 Hooks Más Utilizados

### Autenticación

```jsx
import { useAuthDetection } from '@/hooks/useAuthDetection';
import { useSessionReady } from '@/hooks/useSessionReady';

// Detectar estado de autenticación
const { isAuthenticated, user, loading } = useAuthDetection();

// Verificar sesión lista
const { isReady, session } = useSessionReady();
```

### UI y UX

```jsx
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useMobile } from '@/hooks/use-mobile';

// Dirección del scroll
const scrollDirection = useScrollDirection(); // 'up' | 'down' | null

// Detectar móvil
const isMobile = useMobile(); // boolean
```

### Funcionalidades Específicas

```jsx
import { useSeatSelector } from '@/hooks/useSeatSelector';
import { useFAQs } from '@/hooks/useFAQs';

// Selección de asientos
const { selectedSeats, selectSeat, totalCost } = useSeatSelector({
  tourId: 'tour-123',
  maxSeats: 4,
  pricePerSeat: 299.99
});

// Gestión de FAQs
const { faqs, loading, addFAQ } = useFAQs();
```

## 🛠️ Funciones Utilitarias

### Estilos

```javascript
import { cn } from '@/lib/utils';

// Combinar clases CSS
const className = cn(
  'base-class',
  isActive && 'active-class',
  { 'conditional': someCondition }
);
```

### Cloudinary

```javascript
import { 
  uploadToCloudinaryAPI,
  getOptimizedImageUrl,
  deleteImageFromCloudinary 
} from '@/lib/cloudinary-client';

// Subir imagen
const result = await uploadToCloudinaryAPI(file, 'productos');

// URL optimizada
const url = getOptimizedImageUrl(publicId, ['c_fill', 'w_300', 'q_auto']);

// Eliminar imagen
await deleteImageFromCloudinary(publicId);
```

### Productos

```javascript
import { 
  getAllProducts,
  getProductById,
  searchProducts,
  filterProducts 
} from '@/lib/products-api';

// Obtener todos los productos
const products = await getAllProducts();

// Buscar productos
const results = await searchProducts('camping', 'travel-gear');

// Filtrar productos
const filtered = await filterProducts({
  category: 'camping',
  minPrice: 50,
  maxPrice: 200,
  inStock: true
});
```

### Email

```javascript
import { 
  sendEmailVerification,
  sendPasswordResetEmail 
} from '@/lib/mail';

// Email de verificación
await sendEmailVerification('user@example.com', 'token-123');

// Email de reset
await sendPasswordResetEmail('user@example.com', 'reset-token');
```

## 📝 Esquemas de Validación

### Autenticación

```javascript
import { 
  signInSchema,
  signUpSchema,
  resetPasswordSchema 
} from '@/lib/zod';

// Con React Hook Form
const form = useForm({
  resolver: zodResolver(signInSchema),
  defaultValues: { email: "", password: "" }
});
```

### Servicios

```javascript
import { serviceSchema } from '@/validations/serviceSchema';

// Validar datos de servicio
const validatedData = serviceSchema.parse({
  name: "Tour Aventura",
  description: "Descripción completa",
  price: 299.99,
  location: "Cancún, México",
  // ... más campos
});
```

### Proveedores

```javascript
import { supplierSchema } from '@/validations/supplierSchema';

// Validar datos de proveedor
const validatedSupplier = supplierSchema.parse({
  businessName: "Mi Empresa Turística",
  email: "contacto@empresa.com",
  phone: "5551234567",
  // ... más campos
});
```

## 🏗️ Tipos Principales

### Productos

```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  stock: number;
  image: string;
  category?: ProductCategory;
  images?: string[];
  specifications?: ProductSpecifications;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ProductCategory = 
  | 'travel-gear' | 'camping' | 'electronics' | 'apparel'
  | 'souvenirs' | 'survival' | 'health' | 'food' | 'books' | 'accessories';
```

### Planificador de Viajes

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

interface TimelineService {
  id: string;
  type: 'tour' | 'hotel' | 'transport' | 'activity';
  serviceId: string;
  name: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  location: string;
  duration: string;
  isConfirmed?: boolean;
  isPaid?: boolean;
}
```

### Billetera

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

## 🎯 Patrones Comunes

### Formulario con Validación

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mySchema } from '@/validations/mySchema';

const form = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { /* valores por defecto */ }
});

const onSubmit = async (data) => {
  try {
    // Procesar datos validados
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <input {...form.register('fieldName')} />
    {form.formState.errors.fieldName && (
      <p className="text-red-500">
        {form.formState.errors.fieldName.message}
      </p>
    )}
    <button type="submit">Enviar</button>
  </form>
);
```

### Componente con Estado de Carga

```jsx
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Autenticación Protegida

```jsx
import { useAuthDetection } from '@/hooks/useAuthDetection';
import { useSessionReady } from '@/hooks/useSessionReady';
import { LoginForm } from '@/components/login-form';

export default function ProtectedPage() {
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
      <h1>Contenido Protegido</h1>
      <p>Bienvenido, {user?.name}!</p>
    </div>
  );
}
```

### Subida de Imágenes

```jsx
import { useState } from 'react';
import { uploadToCloudinaryAPI } from '@/lib/cloudinary-client';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinaryAPI(file, 'uploads');
      setImageUrl(result.secure_url);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Subiendo...</p>}
      {imageUrl && <img src={imageUrl} alt="Subida" className="w-48 h-48" />}
    </div>
  );
}
```

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Desarrollo con Turbo
npm run dev:turbo

# Verificar backend
npm run check:backend

# Desarrollo completo
npm run dev:full

# Linting
npm run lint

# Build para producción
npm run build
```

### Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Abrir Prisma Studio
npx prisma studio
```

### Testing

```bash
# Test de Cloudinary
npm run test:cloudinary

# Test completo de Cloudinary
npm run test:cloudinary:all
```

## 🚨 Errores Comunes

### Error de Autenticación

```javascript
// ❌ Error: No verificar autenticación
function MyComponent() {
  const { user } = useAuthDetection();
  return <div>{user.name}</div>; // Error si user es null
}

// ✅ Correcto: Verificar autenticación
function MyComponent() {
  const { isAuthenticated, user } = useAuthDetection();
  if (!isAuthenticated || !user) return <LoginForm />;
  return <div>{user.name}</div>;
}
```

### Error de Validación

```javascript
// ❌ Error: No validar entrada
const createUser = async (data) => {
  return await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data) // Datos sin validar
  });
};

// ✅ Correcto: Validar con Zod
import { userSchema } from '@/validations/userSchema';

const createUser = async (data) => {
  const validatedData = userSchema.parse(data);
  return await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(validatedData)
  });
};
```

### Error de Estado de Carga

```javascript
// ❌ Error: No manejar estados
function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}

// ✅ Correcto: Manejar todos los estados
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoints de Tailwind

```css
/* Mobile first approach */
.container {
  @apply w-full px-4;           /* Base: mobile */
  @apply sm:px-6;               /* Small: 640px+ */
  @apply md:px-8;               /* Medium: 768px+ */
  @apply lg:max-w-6xl lg:mx-auto; /* Large: 1024px+ */
  @apply xl:max-w-7xl;          /* Extra large: 1280px+ */
}
```

### Grid Responsivo

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map(item => (
    <div key={item.id} className="p-4 border rounded">
      {item.content}
    </div>
  ))}
</div>
```

## 🎨 Clases CSS Útiles

### Layout

```css
/* Contenedores */
.container          /* Contenedor responsivo */
.mx-auto           /* Centrar horizontalmente */
.max-w-4xl        /* Ancho máximo */

/* Flexbox */
.flex .items-center .justify-between
.flex .flex-col .space-y-4
.flex .flex-wrap .gap-4

/* Grid */
.grid .grid-cols-3 .gap-6
.grid .grid-cols-1 .md:grid-cols-2 .lg:grid-cols-3
```

### Espaciado

```css
/* Padding */
.p-4    /* padding: 1rem */
.px-6   /* padding-left/right: 1.5rem */
.py-8   /* padding-top/bottom: 2rem */

/* Margin */
.m-4    /* margin: 1rem */
.mx-auto /* margin-left/right: auto */
.my-6   /* margin-top/bottom: 1.5rem */

/* Space between */
.space-y-4  /* margin-top: 1rem para hijos */
.space-x-2  /* margin-left: 0.5rem para hijos */
```

### Estados

```css
/* Hover */
.hover:bg-blue-500
.hover:text-white
.hover:scale-105

/* Focus */
.focus:outline-none
.focus:ring-2
.focus:ring-blue-500

/* Disabled */
.disabled:opacity-50
.disabled:cursor-not-allowed
```

---

## 📚 Enlaces Útiles

- **Documentación Completa**: [DOCUMENTACION_API_COMPLETA.md](./DOCUMENTACION_API_COMPLETA.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/docs
- **Zod**: https://zod.dev/
- **React Hook Form**: https://react-hook-form.com/

---

Esta guía de referencia rápida te proporciona acceso inmediato a las funcionalidades más importantes del sistema Ketzal Marketplace. Para información más detallada, consulta la documentación completa.