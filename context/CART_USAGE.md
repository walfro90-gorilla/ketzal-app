# 🛒 Guía de Uso del CartContext Mejorado

## 📋 **Estructura del CartItem**

```typescript
export type CartItem = {
  id: string;                    // AUTO-GENERADO: serviceId + packageType
  serviceId: string;             // ID del servicio original
  serviceName: string;           // Nombre del servicio
  packageType: string;           // "Doble", "Triple", "Cuádruple", etc.
  packageDescription?: string;   // Descripción del paquete
  price: number;                 // Precio del paquete
  quantity: number;              // Cantidad seleccionada
  availableQty?: number;         // Cantidad disponible del paquete
  image?: string;               // Imagen del servicio
  service?: string;             // Categoría del servicio
};
```

## 🎯 **Cómo Agregar Items al Carrito**

### ✅ **Método Correcto:**
```typescript
const { addToCart } = useCart();

// Al agregar un paquete específico
const handleAddToCart = (selectedPackage: PackageData) => {
  addToCart({
    id: `${serviceId}_${selectedPackage.name}`, // Se auto-genera en el context
    serviceId: serviceId,
    serviceName: serviceName,
    packageType: selectedPackage.name,           // "Doble", "Triple", etc.
    packageDescription: selectedPackage.description || `Paquete ${selectedPackage.name}`,
    price: selectedPackage.price,
    quantity: 1,
    availableQty: selectedPackage.qty,
    image: serviceImage,
    service: serviceCategory,
  });
};
```

### ❌ **Método Anterior (Ya no usar):**
```typescript
// ANTIGUO - No usar más
addToCart({ 
  id: serviceId, 
  name: serviceName, 
  price: packagePrice, 
  quantity: 1 
});
```

## 🔧 **Funciones Disponibles**

### **1. addToCart(item: CartItem)**
- Agrega un item al carrito
- Auto-genera ID único: `serviceId_packageType`
- Agrupa automáticamente items del mismo servicio y paquete

### **2. removeFromCart(id: string)**
- Elimina un item específico por ID único
- ID debe ser el generado: `serviceId_packageType`

### **3. updateQuantity(id: string, quantity: number)**
- Actualiza la cantidad de un item específico
- Si quantity <= 0, elimina el item automáticamente

### **4. getGroupedItems()**
- Retorna items agrupados por servicio
- Útil para mostrar servicios con sus respectivos paquetes

### **5. clearCart()**
- Vacía completamente el carrito

## 📱 **Ejemplo de Uso en Componente**

```typescript
import { useCart } from "@/context/CartContext";

export function ServiceBooking({ service, packages }: Props) {
  const { addToCart, getGroupedItems } = useCart();
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const handleBooking = () => {
    const packageData = packages.find(p => p.name === selectedPackage);
    if (!packageData) return;

    addToCart({
      id: `${service.id}_${packageData.name}`,
      serviceId: service.id,
      serviceName: service.name,
      packageType: packageData.name,
      packageDescription: packageData.description,
      price: packageData.price,
      quantity: 1,
      availableQty: packageData.qty,
      image: service.image,
      service: service.category,
    });
  };

  return (
    <div>
      <select 
        value={selectedPackage} 
        onChange={(e) => setSelectedPackage(e.target.value)}
      >
        {packages.map(pkg => (
          <option key={pkg.name} value={pkg.name}>
            {pkg.name} - ${pkg.price}
          </option>
        ))}
      </select>
      <button onClick={handleBooking}>Agregar al Carrito</button>
    </div>
  );
}
```

## 🎨 **Visualización en el Carrito**

### **Estructura Visual:**
```
📦 Servicio: "Tour a Cancún"
├── 🏠 Paquete Doble - $150.00 (x2)
├── 🏠 Paquete Triple - $200.00 (x1)
└── 🏠 Paquete Cuádruple - $250.00 (x1)

📦 Servicio: "Tour a Playa del Carmen"  
├── 🏠 Paquete Doble - $120.00 (x1)
└── 🏠 Paquete Triple - $180.00 (x2)
```

### **Beneficios:**
- ✅ **Agrupación visual** por servicio
- ✅ **Separación clara** por tipo de paquete
- ✅ **Información detallada** de cada paquete
- ✅ **Indicadores visuales** con iconos y colores
- ✅ **Control de inventario** por disponibilidad

## 🚀 **Integración con Componentes Existentes**

### **TourPricing.tsx - ✅ YA ACTUALIZADO**
```typescript
// El componente ya usa la nueva estructura
const handleAddPack = () => {
  addToCart({
    id: `${idService}_${selectedPackData.name}`,
    serviceId: idService,
    serviceName: title,
    packageType: selectedPackData.name,
    // ... resto de propiedades
  });
};
```

### **Otros Componentes que Necesitan Actualización:**
- [ ] `ServiceCard.tsx` - Si tiene botón "Agregar al carrito"
- [ ] `ServiceDetail.tsx` - Si tiene funcionalidad de booking
- [ ] `QuickBooking.tsx` - Si existe componente de reserva rápida

## 🔄 **Migración desde Estructura Anterior**

Si tienes componentes que usan la estructura anterior, actualiza así:

```typescript
// ANTES
addToCart({ 
  id: serviceId, 
  name: serviceName, 
  price: price, 
  quantity: 1 
});

// DESPUÉS  
addToCart({
  id: `${serviceId}_${packageType}`,
  serviceId: serviceId,
  serviceName: serviceName,
  packageType: packageType,
  packageDescription: packageDescription,
  price: packagePrice,
  quantity: 1,
  availableQty: availableQuantity,
  image: serviceImage,
  service: serviceCategory,
});
```

## 📞 **Soporte**

Si tienes dudas sobre la implementación, revisa:
1. `CartContext.tsx` - Implementación del contexto
2. `cart/page.tsx` - Ejemplo de uso completo
3. `tour-pricing.tsx` - Ejemplo de integración
