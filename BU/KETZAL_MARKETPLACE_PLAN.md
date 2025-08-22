# 🌟 Plan Maestro: Ketzal Travel Marketplace

## 📋 **FASE 1: Fundamentos del Sistema (Semana 1-2)**

### 🗃️ **1.1 Nuevos Modelos de Base de Datos**

#### **Backend Schema Extensions (Prisma)**
```prisma
// Nuevos enums
enum PaymentStatus {
  PENDING
  PARTIAL
  COMPLETED
  REFUNDED
}

enum PlannerStatus {
  PLANNING
  RESERVED
  CONFIRMED
  TRAVELLING
  COMPLETED
}

enum WalletTransactionType {
  DEPOSIT
  WITHDRAWAL
  PURCHASE
  REFUND
  TRANSFER_SENT
  TRANSFER_RECEIVED
  REWARD
}

// Monedero Digital
model Wallet {
  id           String  @id @default(cuid())
  userId       String  @unique
  balanceMXN   Float   @default(0)
  balanceAxo   Float   @default(0)
  
  user         User    @relation(fields: [userId], references: [id])
  transactions WalletTransaction[]
}

model WalletTransaction {
  id           String               @id @default(cuid())
  walletId     String
  type         WalletTransactionType
  amountMXN    Float?
  amountAxo    Float?
  description  String
  reference    String?
  createdAt    DateTime             @default(now())
  
  wallet       Wallet               @relation(fields: [walletId], references: [id])
}

// Planner de Viaje (reemplaza carrito tradicional)
model TravelPlanner {
  id          String         @id @default(cuid())
  userId      String
  name        String
  destination String?
  startDate   DateTime?
  endDate     DateTime?
  status      PlannerStatus  @default(PLANNING)
  totalMXN    Float          @default(0)
  totalAxo    Float          @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  user        User           @relation(fields: [userId], references: [id])
  items       PlannerItem[]
  payments    Payment[]
}

model PlannerItem {
  id           String        @id @default(cuid())
  plannerId    String
  serviceId    Int?
  productId    Int?
  quantity     Int           @default(1)
  priceMXN     Float
  priceAxo     Float?
  selectedDate DateTime?
  notes        String?
  
  planner      TravelPlanner @relation(fields: [plannerId], references: [id])
  service      Service?      @relation(fields: [serviceId], references: [id])
  product      Product?      @relation(fields: [productId], references: [id])
}

// Wishlist Inteligente
model Wishlist {
  id          String     @id @default(cuid())
  userId      String
  name        String     @default("Mi Lista de Deseos")
  isPublic    Boolean    @default(false)
  shareCode   String?    @unique
  createdAt   DateTime   @default(now())
  
  user        User       @relation(fields: [userId], references: [id])
  items       WishlistItem[]
}

model WishlistItem {
  id          String    @id @default(cuid())
  wishlistId  String
  serviceId   Int?
  productId   Int?
  priceAlert  Float?
  createdAt   DateTime  @default(now())
  
  wishlist    Wishlist  @relation(fields: [wishlistId], references: [id])
  service     Service?  @relation(fields: [serviceId], references: [id])
  product     Product?  @relation(fields: [productId], references: [id])
}

// Sistema de Pagos
model Payment {
  id           String        @id @default(cuid())
  plannerId    String?
  userId       String
  amountMXN    Float
  amountAxo    Float?
  status       PaymentStatus @default(PENDING)
  installments Int           @default(1)
  currentInstallment Int     @default(1)
  dueDate      DateTime?
  paidAt       DateTime?
  createdAt    DateTime      @default(now())
  
  planner      TravelPlanner? @relation(fields: [plannerId], references: [id])
  user         User          @relation(fields: [userId], references: [id])
}

// Productos mejorados
model Product {
  id            Int            @id @default(autoincrement())
  name          String         @unique
  description   String?
  price         Float
  priceAxo      Float?
  stock         Int
  category      String
  tags          Json?
  images        Json?
  specifications Json?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  plannerItems  PlannerItem[]
  wishlistItems WishlistItem[]
}

// Tours/Servicios mejorados
model Service {
  // ... campos existentes ...
  
  maxCapacity     Int?
  currentBookings Int           @default(0)
  priceAxo        Float?
  seasonalPrices  Json?         // {high: 1500, low: 1000}
  addOns          Json?         // servicios adicionales
  
  plannerItems    PlannerItem[]
  wishlistItems   WishlistItem[]
}

// Usuario extendido
model User {
  // ... campos existentes ...
  
  axoCoinsEarned  Float         @default(50) // Regalo inicial
  wallet          Wallet?
  planners        TravelPlanner[]
  wishlists       Wishlist[]
  payments        Payment[]
}
```

### 🎨 **1.2 Contextos de Estado Global (Frontend)**

#### **WalletContext**
```typescript
interface WalletContextType {
  balanceMXN: number
  balanceAxo: number
  addFunds: (amount: number, currency: 'MXN' | 'AXO') => Promise<void>
  transfer: (amount: number, currency: 'MXN' | 'AXO', recipient: string) => Promise<void>
  getTransactions: () => Promise<Transaction[]>
}
```

#### **TravelPlannerContext** (reemplaza CartContext)
```typescript
interface TravelPlannerContextType {
  planners: TravelPlanner[]
  activePlanner: TravelPlanner | null
  createPlanner: (name: string, destination?: string) => Promise<void>
  addToPlanner: (item: PlannerItem, plannerId?: string) => Promise<void>
  removeFromPlanner: (itemId: string) => Promise<void>
  updatePlannerDates: (startDate: Date, endDate: Date) => Promise<void>
}
```

#### **WishlistContext**
```typescript
interface WishlistContextType {
  wishlists: Wishlist[]
  addToWishlist: (serviceId?: number, productId?: number) => Promise<void>
  removeFromWishlist: (itemId: string) => Promise<void>
  shareWishlist: (wishlistId: string) => Promise<string>
  togglePriceAlert: (itemId: string, price: number) => Promise<void>
}
```

---

## 📋 **FASE 2: Componentes de UI/UX (Semana 3-4)**

### 🛒 **2.1 Travel Planner Components**
- `TravelPlannerSidebar.tsx` - Panel lateral deslizable
- `PlannerCard.tsx` - Card de cada planner
- `AddToPlannerButton.tsx` - Botón contextual
- `PlannerSummary.tsx` - Resumen con totales
- `PaymentPlanModal.tsx` - Modal para planes de pago

### 💖 **2.2 Wishlist Components**
- `WishlistButton.tsx` - Botón corazón con animaciones
- `WishlistGrid.tsx` - Grid de items guardados
- `ShareWishlistModal.tsx` - Modal para compartir
- `PriceAlertCard.tsx` - Notificaciones de precios

### 💰 **2.3 Wallet Components**
- `WalletBalance.tsx` - Mostrar saldos MXN/AXO
- `AddFundsModal.tsx` - Modal para agregar fondos
- `TransactionHistory.tsx` - Historial de movimientos
- `TransferModal.tsx` - Modal para transferencias

### 🏪 **2.4 Marketplace Dual**
- `ServiceCard.tsx` - Cards de tours/servicios
- `ProductCard.tsx` - Cards de productos
- `MarketplaceTabs.tsx` - Tabs Tours/Shop
- `RecommendationEngine.tsx` - Motor de recomendaciones

---

## 📋 **FASE 3: Lógica de Negocio (Semana 5-6)**

### 💳 **3.1 Sistema de Pagos**
- Pagos parciales con planes de financiamiento
- Conversión automática MXN ↔ AXO Coins
- Sistema de apartado con pagos programados
- Integración con pasarelas de pago

### 🎯 **3.2 Motor de Recomendaciones**
- Algoritmo basado en destinos seleccionados
- Recomendaciones de productos según tours
- Sistema de preferencias de usuario
- ML para patrones de compra

### 📊 **3.3 Gestión de Inventario**
- Control de cupos en tours
- Precios dinámicos por temporada
- Stock inteligente de productos
- Sistema de pre-órdenes

---

## 📋 **FASE 4: Funcionalidades Avanzadas (Semana 7-8)**

### 🔗 **4.1 Social Features**
- Compartir wishlists en redes sociales
- Sistema de referidos con AXO Coins
- Reviews con fotos/videos
- Travel stories de usuarios

### 🎮 **4.2 Gamificación**
- Programa de fidelidad con AXO Coins
- Badges por tipos de viajes
- Challenges de destinos
- Leaderboard de exploradores

### 🔔 **4.3 Notificaciones Inteligentes**
- Alertas de precios en wishlist
- Recordatorios de pagos pendientes
- Ofertas personalizadas
- Updates de tours reservados

---

## 🚀 **Orden de Implementación Recomendado:**

1. **Semana 1**: Modelos de BD + Migraciones
2. **Semana 2**: Contextos básicos + APIs
3. **Semana 3**: Travel Planner UI
4. **Semana 4**: Wallet + Wishlist UI  
5. **Semana 5**: Sistema de pagos
6. **Semana 6**: Motor de recomendaciones
7. **Semana 7**: Features sociales
8. **Semana 8**: Gamificación + polish

¿Te parece bien este plan? ¿Por cuál fase quieres que empecemos?
