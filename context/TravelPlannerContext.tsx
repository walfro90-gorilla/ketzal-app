'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { fetchPlanners, createPlannerAPI, updatePlannerAPI, deletePlannerAPI } from '@/lib/api/planners.api';
import { 
  TravelPlanner, 
  PlannerCartItem,
  CreatePlannerRequest, 
  UpdatePlannerRequest,
  AddToPlannerRequest,
  PlannerSummary,
  PlannerDay,
  CartToPlannerMigration,
  PaymentPlanCalculation
} from '@/types/travel-planner';

// 🐛 DEBUGGING - Cambiar a true para activar logs detallados del planner
const DEBUG_PLANNER = false;



interface TravelPlannerContextType {
  planners: TravelPlanner[];
  activePlanner: TravelPlanner | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  createPlanner: (request: CreatePlannerRequest, confirmFn: () => Promise<boolean>) => Promise<string | null>;
  updatePlanner: (plannerId: string, updates: UpdatePlannerRequest) => Promise<boolean>;
  deletePlanner: (plannerId: string) => Promise<boolean>;
  setActivePlanner: (plannerId: string | null) => void;
  addToPlanner: (request: AddToPlannerRequest) => Promise<boolean>;
  removeFromPlanner: (itemId: string, plannerId?: string) => Promise<boolean>;
  updatePlannerItem: (itemId: string, updates: Partial<PlannerCartItem>, plannerId?: string) => Promise<boolean>;
  movePlannerItem: (itemId: string, newDate: Date, plannerId?: string) => Promise<boolean>;
  getPlannerDays: (plannerId?: string) => PlannerDay[];
  getItemsByDate: (date: Date, plannerId?: string) => PlannerCartItem[];
  getPlannerSummary: (plannerId?: string) => PlannerSummary;
  calculateTotalCost: (plannerId?: string) => number;
  getDateRange: (plannerId?: string) => { startDate: Date | null; endDate: Date | null };
  migrateFromCart: (migration: CartToPlannerMigration) => Promise<string | null>;
  sharePlanner: (plannerId: string) => Promise<string | null>;
  joinSharedPlanner: (shareCode: string) => Promise<boolean>;
  calculatePaymentPlan: (plannerId: string, installments: number) => PaymentPlanCalculation;
  payForItems: (itemIds: string[], plannerId: string) => Promise<boolean>;
}

const TravelPlannerContext = createContext<TravelPlannerContextType | undefined>(undefined);

export const TravelPlannerProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [planners, setPlanners] = useState<TravelPlanner[]>([]);
  const [activePlanner, setActiveplannerState] = useState<TravelPlanner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);






  // Cargar planners desde la base de datos
  useEffect(() => {
    const loadPlanners = async () => {
      if (!session?.user?.id || !session?.accessToken) {
        if (DEBUG_PLANNER) console.log('❌ No user session, skipping planner load');
        setIsInitialized(true);
        return;
      }
      setIsLoading(true);
      try {
        const plannersFromApi = await fetchPlanners(session.accessToken);
        setPlanners(plannersFromApi);
        // Selecciona el primero como activo si hay planners
        setActiveplannerState(plannersFromApi[0] || null);
      } catch (err) {
        setError('Error al cargar planners: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        setPlanners([]);
        setActiveplannerState(null);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };
    loadPlanners();
  }, [session?.user?.id, session?.accessToken]);



  // Crear nuevo planner (guarda en la base de datos)
  const createPlanner = async (request: CreatePlannerRequest, confirmFn: () => Promise<boolean>): Promise<string | null> => {
    if (!session?.user?.id || !session?.accessToken) {
      setError('No hay sesión de usuario');
      return null;
    }
    const confirmed = await confirmFn();
    if (!confirmed) return null;
    setIsLoading(true);
    try {
      const planner = await createPlannerAPI(session.accessToken, request);
      setPlanners(prev => [...prev, planner]);
      setActiveplannerState(planner);
      return planner.id;
    } catch (err) {
      setError('Error al crear planner: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar planner
  const updatePlanner = async (plannerId: string, updates: UpdatePlannerRequest): Promise<boolean> => {
    if (!session?.user?.id || !session?.accessToken) {
      setError('No hay sesión de usuario');
      return false;
    }
    if (DEBUG_PLANNER) console.log('📝 Actualizando planner:', plannerId, updates);
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updatePlannerAPI(session.accessToken, plannerId, updates);
      setPlanners(prev => prev.map(planner => 
        planner.id === plannerId 
          ? { ...planner, ...updated }
          : planner
      ));
      if (activePlanner?.id === plannerId) {
        setActiveplannerState(updated);
      }
      return true;
    } catch (error) {
      setError('Error al actualizar el planner');
      console.error('❌ Error updating planner:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar planner
  const deletePlanner = async (plannerId: string): Promise<boolean> => {
    if (!session?.user?.id || !session?.accessToken) {
      setError('No hay sesión de usuario');
      return false;
    }
    if (DEBUG_PLANNER) console.log('🗑️ Eliminando planner:', plannerId);
    setIsLoading(true);
    try {
      await deletePlannerAPI(session.accessToken, plannerId);
      setPlanners(prev => prev.filter(p => p.id !== plannerId));
      if (activePlanner?.id === plannerId) {
        setActiveplannerState(null);
      }
      return true;
    } catch (error) {
      setError('Error al eliminar el planner');
      console.error('❌ Error deleting planner:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Establecer planner activo
  const setActivePlanner = (plannerId: string | null): void => {
    if (DEBUG_PLANNER) console.log('🎯 Estableciendo planner activo:', plannerId);
    if (!plannerId) {
      setActiveplannerState(null);
      return;
    }
    const planner = planners.find(p => p.id === plannerId);
    if (planner) {
      setActiveplannerState(planner);
    }
  };

  // Agregar item al planner
  const addToPlanner = async (request: AddToPlannerRequest): Promise<boolean> => {
    const targetPlannerId = request.plannerId || activePlanner?.id;
    if (!targetPlannerId) {
      setError('No hay planner activo seleccionado');
      return false;
    }
    if (DEBUG_PLANNER) console.log('➕ Agregando item al planner:', targetPlannerId, request);
    try {
      const newItem: PlannerCartItem = {
        id: `item_${Date.now()}`,
        type: request.item.type as 'product' | 'service',
        serviceId: request.item.serviceId,
        name: request.item.serviceName,
        description: request.item.description,
        price: request.item.price,
        priceAxo: request.item.price * 0.9,
        quantity: request.item.quantity,
        paymentOption: 'cash',
        image: request.item.image,
        category: request.item.packageType,
        notes: request.notes,
        addedAt: new Date(),
        plannedDate: request.plannedDate,
        isConfirmed: request.item.isConfirmed || false,
        isPaid: request.item.isPaid || false
      };
      setPlanners(prev => prev.map(planner => {
        if (planner.id === targetPlannerId) {
          const updatedItems = [...planner.items, newItem];
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...planner,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        }
        return planner;
      }));
      if (activePlanner?.id === targetPlannerId) {
        setActiveplannerState(prev => {
          if (!prev) return null;
          const updatedItems = [...prev.items, newItem];
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...prev,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        });
      }
      return true;
    } catch (error) {
      setError('Error al agregar item al planner');
      console.error('❌ Error adding item to planner:', error);
      return false;
    }
  };

  // Remover item del planner
  const removeFromPlanner = async (itemId: string, plannerId?: string): Promise<boolean> => {
    const targetPlannerId = plannerId || activePlanner?.id;
    if (!targetPlannerId) return false;
    if (DEBUG_PLANNER) console.log('➖ Removiendo item del planner:', itemId);
    try {
      setPlanners(prev => prev.map(planner => {
        if (planner.id === targetPlannerId) {
          const updatedItems = planner.items.filter(item => item.id !== itemId);
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...planner,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        }
        return planner;
      }));
      if (activePlanner?.id === targetPlannerId) {
        setActiveplannerState(prev => {
          if (!prev) return null;
          const updatedItems = prev.items.filter(item => item.id !== itemId);
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...prev,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        });
      }
      return true;
    } catch (error) {
      setError('Error al remover item del planner');
      console.error('❌ Error removing item from planner:', error);
      return false;
    }
  };

  // Actualizar item del planner
  const updatePlannerItem = async (
    itemId: string, 
    updates: Partial<PlannerCartItem>, 
    plannerId?: string
  ): Promise<boolean> => {
    const targetPlannerId = plannerId || activePlanner?.id;
    if (!targetPlannerId) return false;
    if (DEBUG_PLANNER) console.log('📝 Actualizando item del planner:', itemId, updates);
    try {
      setPlanners(prev => prev.map(planner => {
        if (planner.id === targetPlannerId) {
          const updatedItems = planner.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          );
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...planner,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        }
        return planner;
      }));
      if (activePlanner?.id === targetPlannerId) {
        setActiveplannerState(prev => {
          if (!prev) return null;
          const updatedItems = prev.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          );
          const totalEstimated = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...prev,
            items: updatedItems,
            totalEstimated,
            updatedAt: new Date()
          };
        });
      }
      return true;
    } catch (error) {
      setError('Error al actualizar item del planner');
      console.error('❌ Error updating planner item:', error);
      return false;
    }
  };

  // Mover item a nueva fecha
  const movePlannerItem = async (itemId: string, newDate: Date, plannerId?: string): Promise<boolean> => {
    return updatePlannerItem(itemId, { plannedDate: newDate }, plannerId);
  };

  // Obtener días organizados del planner
  const getPlannerDays = (plannerId?: string): PlannerDay[] => {
    const targetPlanner = plannerId 
      ? planners.find(p => p.id === plannerId)
      : activePlanner;
    if (!targetPlanner) return [];
    const daysMap = new Map<string, PlannerDay>();
    targetPlanner.items.forEach(item => {
      if (!item.plannedDate) return;
      const dateKey = item.plannedDate.toISOString().split('T')[0];
      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, {
          date: new Date(item.plannedDate),
          timelineServices: [],
          items: [],
          totalCost: 0
        });
      }
      const day = daysMap.get(dateKey)!;
      day.items.push(item);
      day.totalCost += item.price * item.quantity;
    });
    return Array.from(daysMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Obtener items por fecha
  const getItemsByDate = (date: Date, plannerId?: string): PlannerCartItem[] => {
    const targetPlanner = plannerId 
      ? planners.find(p => p.id === plannerId)
      : activePlanner;
    if (!targetPlanner) return [];
    const dateKey = date.toISOString().split('T')[0];
    return targetPlanner.items.filter(item => {
      if (!item.plannedDate) return false;
      return item.plannedDate.toISOString().split('T')[0] === dateKey;
    });
  };

  // Obtener resumen del planner
  const getPlannerSummary = (plannerId?: string): PlannerSummary => {
    const targetPlanner = plannerId 
      ? planners.find(p => p.id === plannerId)
      : activePlanner;
    if (!targetPlanner) {
      return {
        totalItems: 0,
        totalCost: 0,
        totalPaid: 0,
        pendingPayment: 0,
        daysPlanned: 0,
        confirmedItems: 0,
        pendingItems: 0
      };
    }
    const totalItems = targetPlanner.items.length;
    const totalCost = targetPlanner.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPaid = targetPlanner.items
      .filter(item => item.isPaid)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const daysPlanned = new Set(
      targetPlanner.items
        .filter(item => item.plannedDate)
        .map(item => item.plannedDate!.toISOString().split('T')[0])
    ).size;
    const confirmedItems = targetPlanner.items.filter(item => item.isConfirmed).length;
    const pendingItems = totalItems - confirmedItems;
    return {
      totalItems,
      totalCost,
      totalPaid,
      pendingPayment: totalCost - totalPaid,
      daysPlanned,
      confirmedItems,
      pendingItems
    };
  };

  // Calcular costo total
  const calculateTotalCost = (plannerId?: string): number => {
    const targetPlanner = plannerId 
      ? planners.find(p => p.id === plannerId)
      : activePlanner;
    if (!targetPlanner) return 0;
    return targetPlanner.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Obtener rango de fechas
  const getDateRange = (plannerId?: string): { startDate: Date | null; endDate: Date | null } => {
    const targetPlanner = plannerId 
      ? planners.find(p => p.id === plannerId)
      : activePlanner;
    if (!targetPlanner || targetPlanner.items.length === 0) {
      return { startDate: null, endDate: null };
    }
    const dates = targetPlanner.items
      .filter(item => item.plannedDate)
      .map(item => item.plannedDate!)
      .sort((a, b) => a.getTime() - b.getTime());
    return {
      startDate: dates.length > 0 ? dates[0] : null,
      endDate: dates.length > 0 ? dates[dates.length - 1] : null
    };
  };

  // Migrar desde cart (implementación básica)
  const migrateFromCart = async (migration: CartToPlannerMigration): Promise<string | null> => {
    if (DEBUG_PLANNER) console.log('🔄 Migrando desde cart:', migration);
    // Crear nuevo planner
    const plannerId = await createPlanner({
      name: migration.plannerName,
      destination: migration.destination
    }, async () => true);
    if (!plannerId) return null;
    // Convertir items del cart a items del planner
    for (const cartItem of migration.cartItems) {
      await addToPlanner({
        item: {
          type: 'product',
          serviceId: cartItem.serviceId || cartItem.productId || '',
          serviceName: cartItem.name,
          packageType: cartItem.type,
          packageDescription: cartItem.description || '',
          price: cartItem.price,
          quantity: cartItem.quantity,
          image: cartItem.image,
          description: `Migrado desde carrito - ${cartItem.name}`
        },
        plannerId
      });
    }
    return plannerId;
  };



  // Funciones placeholder para funcionalidades futuras
  const sharePlanner = async (plannerId: string): Promise<string | null> => {
    console.log('🔗 Compartir planner:', plannerId);
    return `share_${plannerId}_${Date.now()}`;
  };

  const joinSharedPlanner = async (shareCode: string): Promise<boolean> => {
    console.log('🤝 Unirse a planner compartido:', shareCode);
    return true;
  };

  const calculatePaymentPlan = (plannerId: string, installments: number): PaymentPlanCalculation => {
    const totalCost = calculateTotalCost(plannerId);
    const firstPayment = totalCost * 0.3;
    const remainingAmount = totalCost - firstPayment;
    const monthlyAmount = remainingAmount / (installments - 1);
    return {
      totalAmount: totalCost,
      installments,
      monthlyAmount,
      firstPayment,
      remainingAmount
    };
  };

  const payForItems = async (itemIds: string[], plannerId: string): Promise<boolean> => {
    console.log('💳 Pagar items:', itemIds, plannerId);
    return true;
  };

  const value: TravelPlannerContextType = {
    planners,
    activePlanner,
    isLoading,
    isInitialized,
    error,
    createPlanner,
    updatePlanner,
    deletePlanner,
    setActivePlanner,
    addToPlanner,
    removeFromPlanner,
    updatePlannerItem,
    movePlannerItem,
    getPlannerDays,
    getItemsByDate,
    getPlannerSummary,
    calculateTotalCost,
    getDateRange,
    migrateFromCart,
    sharePlanner,
    joinSharedPlanner,
    calculatePaymentPlan,
    payForItems
  };

  return (
    <TravelPlannerContext.Provider value={value}>
      {children}
    </TravelPlannerContext.Provider>
  );
};

export const useTravelPlanner = () => {
  const context = useContext(TravelPlannerContext);
  if (context === undefined) {
    throw new Error('useTravelPlanner debe usarse dentro de TravelPlannerProvider');
  }
  return context;
};
