// Travel Planner Types - Nueva arquitectura con separación Cart vs Timeline

export type PlannerItemType = 'tour' | 'hotel' | 'transport' | 'activity' | 'service' | 'product';

export type PlannerStatus = 'draft' | 'planning' | 'confirmed' | 'paid' | 'completed';

export type PaymentOption = 'cash' | 'installments';

export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'failed';

// 🛒 SHOPPING CART - Solo para items/productos SIN fecha específica
export interface PlannerCart {
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

export interface PlannerCartItem {
  id: string;
  type: 'product' | 'service'; // Solo items sin fecha específica
  
  // Referencias
  serviceId?: string;
  productId?: string;
  
  // Información básica
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  quantity: number;
  
  // Opciones de pago
  paymentOption: PaymentOption;
  installmentPlan?: InstallmentPlan;
  
  // Metadata
  image?: string;
  category?: string;
  notes?: string;
  addedAt: Date;
}

// 📅 TIMELINE - Solo para servicios turísticos CON fecha obligatoria
export interface PlannerTimeline {
  id: string;
  plannerId: string;
  services: TimelineService[];
  totalCost: number;
  updatedAt: Date;
}

export interface TimelineService {
  id: string;
  type: 'tour' | 'hotel' | 'transport' | 'activity'; // Solo servicios turísticos
  
  // Referencias
  serviceId: string;
  
  // Información básica
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  
  // 📅 FECHAS OBLIGATORIAS
  startDate: Date;
  endDate?: Date; // Para servicios de múltiples días
  startTime?: string;
  endTime?: string;
  
  // Información del servicio turístico
  packageType?: string;
  packageDescription?: string;
  location: string;
  duration: string;
  
  // Metadata
  image?: string;
  imgBanner?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  isConfirmed?: boolean;
  
  // Para presupuesto y pagos
  isPaid?: boolean;
  paymentPlan?: {
    installments: number;
    nextPaymentDate?: Date;
    amountPaid: number;
  };
  
  addedAt: Date;
}

export interface InstallmentPlan {
  totalAmount: number;
  installments: number;
  installmentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: Date;
  payments: InstallmentPayment[];
}

export interface InstallmentPayment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  transactionId?: string;
}

export interface TravelPlanner {
  id: string;
  name: string;
  description?: string;
  destination: string;
  
  // Fechas del viaje
  startDate?: Date;
  endDate?: Date;
  
  // 🛒 SHOPPING CART - Items sin fecha específica
  cart: PlannerCart;
  
  // 📅 TIMELINE - Servicios turísticos con fecha
  timeline: PlannerTimeline;
  
  // Presupuesto y pagos (sumatoria de cart + timeline)
  budget?: number;
  totalEstimated: number; // cart.total + timeline.totalCost
  totalPaid: number;
  
  // Estado y metadata
  status: PlannerStatus;
  isShared?: boolean;
  shareCode?: string;
  
  // Fechas del sistema
  createdAt: Date;
  updatedAt: Date;
  
  // Configuración
  currency: 'MXN' | 'USD';
  travelers: number;
  
  // Integración con itinerario
  autoGenerateItinerary?: boolean;
}

export interface PlannerDay {
  date: Date;
  timelineServices: TimelineService[]; // Solo servicios del timeline
  totalCost: number;
  notes?: string;
}

export interface PlannerSummary {
  totalItems: number;
  totalCost: number;
  totalPaid: number;
  pendingPayment: number;
  daysPlanned: number;
  confirmedItems: number;
  pendingItems: number;
}

// 🛒 Request para agregar ITEMS al carrito (sin fecha)
export interface AddToCartRequest {
  item: Omit<PlannerCartItem, 'id' | 'addedAt'>;
  plannerId?: string;
  notes?: string;
}

// 📅 Request para agregar SERVICIOS al timeline (con fecha obligatoria)
export interface AddToTimelineRequest {
  service: Omit<TimelineService, 'id' | 'addedAt'>;
  plannerId?: string;
  notes?: string;
}

// 🔄 Request legacy - mantener compatibilidad temporal
export interface AddToPlannerRequest {
  item: {
    type: PlannerItemType;
    serviceId: string;
    serviceName: string;
    packageType?: string;
    packageDescription?: string;
    price: number;
    quantity: number;
    plannedDate?: Date;
    plannedTime?: string;
    priority?: 'high' | 'medium' | 'low';
    notes?: string;
    isConfirmed?: boolean;
    image?: string;
    imgBanner?: string;
    location?: string;
    duration?: string;
    description?: string;
    isPaid?: boolean;
  };
  plannerId?: string;
  plannedDate?: Date;
  notes?: string;
}

export interface CreatePlannerRequest {
  name: string;
  destination: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  travelers?: number;
  currency?: 'MXN' | 'USD';
}

export interface UpdatePlannerRequest {
  name?: string;
  description?: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  travelers?: number;
  status?: PlannerStatus;
  cart?: PlannerCart;
  timeline?: PlannerTimeline;
  totalEstimated?: number;
  totalPaid?: number;
}

export interface PlannerPaymentPlan {
  plannerId: string;
  totalAmount: number;
  installments: number;
  firstPaymentAmount: number;
  monthlyAmount: number;
  startDate: Date;
  items: string[]; // IDs de items incluidos en el plan
}

// Tipos para compartir planners
export interface SharedPlannerInvite {
  plannerId: string;
  inviteCode: string;
  permissions: 'view' | 'edit' | 'admin';
  expiresAt?: Date;
}

// Tipos para conversión desde cart
export interface CartToPlannerMigration {
  cartItems: PlannerCartItem[]; // Items del cart actual
  plannerName: string;
  destination: string;
  preserveCart?: boolean;
}

// Tipo para planes de pago
export interface PaymentPlanCalculation {
  totalAmount: number;
  installments: number;
  monthlyAmount: number;
  firstPayment: number;
  remainingAmount: number;
}
