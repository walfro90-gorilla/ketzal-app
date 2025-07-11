'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TravelPlanner, 
  PlannerItem, 
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
  // Estado
  planners: TravelPlanner[];
  activePlanner: TravelPlanner | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Gestión de planners
  createPlanner: (request: CreatePlannerRequest) => Promise<string | null>;
  updatePlanner: (plannerId: string, updates: UpdatePlannerRequest) => Promise<boolean>;
  deletePlanner: (plannerId: string) => Promise<boolean>;
  setActivePlanner: (plannerId: string | null) => void;
  
  // Gestión de items
  addToPlanner: (request: AddToPlannerRequest) => Promise<boolean>;
  removeFromPlanner: (itemId: string, plannerId?: string) => Promise<boolean>;
  updatePlannerItem: (itemId: string, updates: Partial<PlannerItem>, plannerId?: string) => Promise<boolean>;
  movePlannerItem: (itemId: string, newDate: Date, plannerId?: string) => Promise<boolean>;
  
  // Organización por fechas
  getPlannerDays: (plannerId?: string) => PlannerDay[];
  getItemsByDate: (date: Date, plannerId?: string) => PlannerItem[];
  
  // Utilidades y cálculos
  getPlannerSummary: (plannerId?: string) => PlannerSummary;
  calculateTotalCost: (plannerId?: string) => number;
  getDateRange: (plannerId?: string) => { startDate: Date | null; endDate: Date | null };
  
  // Migración desde cart
  migrateFromCart: (migration: CartToPlannerMigration) => Promise<string | null>;
  
  // Compartir y colaboración
  sharePlanner: (plannerId: string) => Promise<string | null>;
  joinSharedPlanner: (shareCode: string) => Promise<boolean>;
  
  // Integración con wallet
  calculatePaymentPlan: (plannerId: string, installments: number) => PaymentPlanCalculation;
  payForItems: (itemIds: string[], plannerId: string) => Promise<boolean>;
}

const TravelPlannerContext = createContext<TravelPlannerContextType | undefined>(undefined);

export const useTravelPlanner = (): TravelPlannerContextType => {
  const context = useContext(TravelPlannerContext);
  if (!context) {
    throw new Error('useTravelPlanner must be used within a TravelPlannerProvider');
  }
  return context;
};

interface TravelPlannerProviderProps {
  children: ReactNode;
}

export const TravelPlannerProvider: React.FC<TravelPlannerProviderProps> = ({ children }) => {
  if (DEBUG_PLANNER) console.log('🚀 TravelPlannerProvider: Component initializing...');
  
  const [planners, setPlanners] = useState<TravelPlanner[]>([]);
  const [activePlanner, setActiveplannerState] = useState<TravelPlanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Claves para localStorage
  const PLANNERS_STORAGE_KEY = 'ketzal-travel-planners';
  const ACTIVE_PLANNER_KEY = 'ketzal-active-planner';

  // Funciones auxiliares para localStorage
  const loadPlannersFromStorage = (): TravelPlanner[] => {
    if (typeof window === 'undefined') return [];
    try {
      const savedPlanners = localStorage.getItem(PLANNERS_STORAGE_KEY);
      if (!savedPlanners) return [];
      
      const parsed: TravelPlanner[] = JSON.parse(savedPlanners);
      // Convertir strings de fecha a objetos Date
      return parsed.map((planner: TravelPlanner) => ({
        ...planner,
        startDate: planner.startDate ? new Date(planner.startDate) : undefined,
        endDate: planner.endDate ? new Date(planner.endDate) : undefined,
        createdAt: new Date(planner.createdAt),
        updatedAt: new Date(planner.updatedAt),
        items: planner.items.map((item: PlannerItem) => ({
          ...item,
          plannedDate: item.plannedDate ? new Date(item.plannedDate) : undefined
        }))
      }));
    } catch (error) {
      console.error('Error loading planners from localStorage:', error);
      return [];
    }
  };

  const savePlannersToStorage = (plannersToSave: TravelPlanner[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PLANNERS_STORAGE_KEY, JSON.stringify(plannersToSave));
    } catch (error) {
      console.error('Error saving planners to localStorage:', error);
    }
  };

  const loadActivePlannerFromStorage = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(ACTIVE_PLANNER_KEY);
    } catch (error) {
      console.error('Error loading active planner from localStorage:', error);
      return null;
    }
  };

  const saveActivePlannerToStorage = (plannerId: string | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (plannerId) {
        localStorage.setItem(ACTIVE_PLANNER_KEY, plannerId);
      } else {
        localStorage.removeItem(ACTIVE_PLANNER_KEY);
      }
    } catch (error) {
      console.error('Error saving active planner to localStorage:', error);
    }
  };

  // Cargar planners al inicializar
  useEffect(() => {
    const savedPlanners = loadPlannersFromStorage();
    const activeId = loadActivePlannerFromStorage();
    
    if (DEBUG_PLANNER) {
      console.log('📦 Planners cargados desde localStorage:', savedPlanners);
      console.log('🎯 Active planner ID:', activeId);
    }
    
    setPlanners(savedPlanners);
    
    if (activeId) {
      const activePlannerFound = savedPlanners.find(p => p.id === activeId);
      setActiveplannerState(activePlannerFound || null);
    }
    
    setIsInitialized(true);
  }, []);

  // Guardar planners cuando cambien
  useEffect(() => {
    if (isInitialized) {
      if (DEBUG_PLANNER) console.log('💾 Guardando planners en localStorage:', planners);
      savePlannersToStorage(planners);
    }
  }, [planners, isInitialized]);

  // Crear nuevo planner
  const createPlanner = async (request: CreatePlannerRequest): Promise<string | null> => {
    if (DEBUG_PLANNER) console.log('🆕 Creando nuevo planner:', request);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPlanner: TravelPlanner = {
        id: `planner_${Date.now()}`,
        name: request.name,
        description: request.description,
        destination: request.destination,
        startDate: request.startDate,
        endDate: request.endDate,
        budget: request.budget,
        totalEstimated: 0,
        totalPaid: 0,
        items: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: request.currency || 'MXN',
        travelers: request.travelers || 1,
        autoGenerateItinerary: true
      };

      setPlanners(prev => [...prev, newPlanner]);
      setActiveplannerState(newPlanner);
      saveActivePlannerToStorage(newPlanner.id);
      
      if (DEBUG_PLANNER) console.log('✅ Planner creado exitosamente:', newPlanner);
      return newPlanner.id;
      
    } catch (error) {
      setError('Error al crear el planner');
      console.error('❌ Error creating planner:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar planner
  const updatePlanner = async (plannerId: string, updates: UpdatePlannerRequest): Promise<boolean> => {
    if (DEBUG_PLANNER) console.log('📝 Actualizando planner:', plannerId, updates);
    
    setIsLoading(true);
    setError(null);
    
    try {
      setPlanners(prev => prev.map(planner => 
        planner.id === plannerId 
          ? { ...planner, ...updates, updatedAt: new Date() }
          : planner
      ));

      // Actualizar activePlanner si es el que se está editando
      if (activePlanner?.id === plannerId) {
        setActiveplannerState(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
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
    if (DEBUG_PLANNER) console.log('🗑️ Eliminando planner:', plannerId);
    
    try {
      setPlanners(prev => prev.filter(p => p.id !== plannerId));
      
      if (activePlanner?.id === plannerId) {
        setActiveplannerState(null);
        saveActivePlannerToStorage(null);
      }

      return true;
    } catch (error) {
      setError('Error al eliminar el planner');
      console.error('❌ Error deleting planner:', error);
      return false;
    }
  };

  // Establecer planner activo
  const setActivePlanner = (plannerId: string | null): void => {
    if (DEBUG_PLANNER) console.log('🎯 Estableciendo planner activo:', plannerId);
    
    if (!plannerId) {
      setActiveplannerState(null);
      saveActivePlannerToStorage(null);
      return;
    }

    const planner = planners.find(p => p.id === plannerId);
    if (planner) {
      setActiveplannerState(planner);
      saveActivePlannerToStorage(plannerId);
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
      const newItem: PlannerItem = {
        ...request.item,
        id: `item_${Date.now()}`,
        plannedDate: request.plannedDate,
        notes: request.notes,
        isConfirmed: false,
        isPaid: false
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

      // Actualizar activePlanner si es necesario
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

      // Actualizar activePlanner si es necesario
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
    updates: Partial<PlannerItem>, 
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

      // Actualizar activePlanner si es necesario
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
  const getItemsByDate = (date: Date, plannerId?: string): PlannerItem[] => {
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
    });

    if (!plannerId) return null;

    // Convertir items del cart a items del planner
    for (const cartItem of migration.cartItems) {
      await addToPlanner({
        item: {
          type: 'tour', // Default, podríamos inferir del cartItem
          serviceId: cartItem.serviceId,
          serviceName: cartItem.serviceName,
          packageType: cartItem.packageType,
          packageDescription: cartItem.packageDescription,
          price: cartItem.price,
          quantity: cartItem.quantity,
          availableQty: cartItem.availableQty,
          image: cartItem.image,
          imgBanner: cartItem.imgBanner,
          description: `Migrado desde carrito - ${cartItem.packageType}`
        },
        plannerId
      });
    }

    return plannerId;
  };

  // Funciones placeholder para funcionalidades futuras
  const sharePlanner = async (plannerId: string): Promise<string | null> => {
    // TODO: Implementar compartir planner
    console.log('🔗 Compartir planner:', plannerId);
    return `share_${plannerId}_${Date.now()}`;
  };

  const joinSharedPlanner = async (shareCode: string): Promise<boolean> => {
    // TODO: Implementar unirse a planner compartido
    console.log('🤝 Unirse a planner compartido:', shareCode);
    return true;
  };

  const calculatePaymentPlan = (plannerId: string, installments: number): PaymentPlanCalculation => {
    // TODO: Integrar con wallet para planes de pago
    const totalCost = calculateTotalCost(plannerId);
    const firstPayment = totalCost * 0.3; // 30% inicial
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
    // TODO: Integrar con wallet para pagos
    console.log('💳 Pagar items:', itemIds, plannerId);
    return true;
  };

  const value: TravelPlannerContextType = {
    // Estado
    planners,
    activePlanner,
    isLoading,
    isInitialized,
    error,
    
    // Gestión de planners
    createPlanner,
    updatePlanner,
    deletePlanner,
    setActivePlanner,
    
    // Gestión de items
    addToPlanner,
    removeFromPlanner,
    updatePlannerItem,
    movePlannerItem,
    
    // Organización por fechas
    getPlannerDays,
    getItemsByDate,
    
    // Utilidades y cálculos
    getPlannerSummary,
    calculateTotalCost,
    getDateRange,
    
    // Migración desde cart
    migrateFromCart,
    
    // Compartir y colaboración
    sharePlanner,
    joinSharedPlanner,
    
    // Integración con wallet
    calculatePaymentPlan,
    payForItems
  };

  return (
    <TravelPlannerContext.Provider value={value}>
      {children}
    </TravelPlannerContext.Provider>
  );
};
