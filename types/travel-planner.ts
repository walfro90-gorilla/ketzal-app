// Travel Planner Types - Sistema híbrido para planificación de viajes

export type PlannerItemType = 'tour' | 'hotel' | 'transport' | 'activity' | 'service';

export type PlannerStatus = 'draft' | 'planning' | 'confirmed' | 'paid' | 'completed';

export interface PlannerItem {
  id: string;
  type: PlannerItemType;
  serviceId: string;
  serviceName: string;
  packageType?: string;
  packageDescription?: string;
  price: number;
  quantity: number;
  availableQty?: number;
  
  // Campos específicos del planner
  plannedDate?: Date;
  plannedTime?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  isConfirmed?: boolean;
  
  // Metadata del servicio
  image?: string;
  imgBanner?: string;
  location?: string;
  duration?: string;
  description?: string;
  
  // Para presupesto y pagos
  isPaid?: boolean;
  paymentPlan?: {
    installments: number;
    nextPaymentDate?: Date;
    amountPaid: number;
  };
}

export interface TravelPlanner {
  id: string;
  name: string;
  description?: string;
  destination: string;
  
  // Fechas del viaje
  startDate?: Date;
  endDate?: Date;
  
  // Presupuesto
  budget?: number;
  totalEstimated: number;
  totalPaid: number;
  
  // Items y organización
  items: PlannerItem[];
  
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
  items: PlannerItem[];
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

export interface AddToPlannerRequest {
  item: Omit<PlannerItem, 'id'>;
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
  cartItems: any[]; // Items del cart actual
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
