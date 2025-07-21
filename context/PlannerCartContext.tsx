'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlannerCart, 
  PlannerCartItem, 
  InstallmentPlan, 
  PaymentOption,
  TravelPlanner
} from '@/types/travel-planner';
import { useTravelPlanner } from './TravelPlannerContext';

interface PlannerCartContextType {
  // Estado del carrito activo
  activeCart: PlannerCart | null;
  activePlannerId: string | null;
  
  // Gestión de items
  addToCart: (item: Omit<PlannerCartItem, 'id' | 'addedAt'>, plannerId: string) => Promise<boolean>;
  removeFromCart: (itemId: string, plannerId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number, plannerId: string) => Promise<boolean>;
  updatePaymentOption: (itemId: string, paymentOption: PaymentOption, plannerId: string) => Promise<boolean>;
  clearCart: (plannerId: string) => Promise<boolean>;
  
  // Gestión de planner/carrito
  setActivePlanner: (plannerId: string | null) => void;
  getCartTotal: (plannerId?: string) => number;
  getCartItemCount: (plannerId?: string) => number;
  
  // Auto-crear planner para compras rápidas
  createQuickPlanner: (name?: string) => Promise<string | null>;
  
  // Checkout y pagos
  calculateInstallments: (amount: number, installments: number) => InstallmentPlan;
  
  // Utils
  isLoading: boolean;
  error: string | null;
}

const PlannerCartContext = createContext<PlannerCartContextType | undefined>(undefined);

interface PlannerCartProviderProps {
  children: ReactNode;
}

export const PlannerCartProvider: React.FC<PlannerCartProviderProps> = ({ children }) => {
  const [activeCart, setActiveCart] = useState<PlannerCart | null>(null);
  const [activePlannerId, setActivePlannerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { planners, updatePlanner, createPlanner } = useTravelPlanner();

  // Sincronizar carrito activo cuando cambia el planner
  useEffect(() => {
    console.log('🔄 PlannerCartContext - Sincronizando carrito activo:', {
      activePlannerId,
      plannersLength: planners.length,
      plannerIds: planners.map(p => p.id)
    });
    
    if (activePlannerId) {
      const planner = planners.find(p => p.id === activePlannerId);
      console.log('📋 Planner encontrado:', planner ? {
        id: planner.id,
        name: planner.name,
        cartItems: planner.cart?.items.length || 0,
        cartTotal: planner.cart?.total || 0
      } : 'NO ENCONTRADO');
      
      if (planner) {
        setActiveCart(planner.cart);
        console.log('✅ ActiveCart actualizado:', {
          itemCount: planner.cart?.items.length || 0,
          total: planner.cart?.total || 0
        });
      }
    } else {
      setActiveCart(null);
      console.log('🔄 ActiveCart limpiado (no hay planner activo)');
    }
  }, [activePlannerId, planners]);

  const generateCartItemId = () => {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const updatePlannerCart = async (plannerId: string, cartUpdater: (cart: PlannerCart) => PlannerCart): Promise<boolean> => {
    try {
      console.log('🔄 updatePlannerCart iniciado:', { plannerId });
      setIsLoading(true);
      setError(null);

      // NUEVA ESTRATEGIA: Usar una función que siempre obtenga el estado más fresco
      const getCurrentPlanners = () => {
        // Buscar en el estado local primero
        let currentPlanners = planners;
        
        // Si no hay planners, intentar obtenerlos desde localStorage como backup
        if (currentPlanners.length === 0) {
          try {
            const stored = localStorage.getItem('ketzal-travel-planners'); // 🔧 FIXED: Usar la misma clave que TravelPlannerContext
            if (stored) {
              const parsedPlanners = JSON.parse(stored);
              // Convertir strings de fecha a objetos Date para consistencia
              currentPlanners = parsedPlanners.map((planner: TravelPlanner) => ({
                ...planner,
                startDate: planner.startDate ? new Date(planner.startDate) : undefined,
                endDate: planner.endDate ? new Date(planner.endDate) : undefined,
                createdAt: new Date(planner.createdAt),
                updatedAt: new Date(planner.updatedAt),
                cart: {
                  ...planner.cart,
                  updatedAt: new Date(planner.cart.updatedAt)
                }
              }));
              console.log('📦 Planners obtenidos desde localStorage como backup:', currentPlanners.length);
            }
          } catch (error) {
            console.log('⚠️ No se pudieron obtener planners desde localStorage:', error);
          }
        }
        
        return currentPlanners;
      };

      // Intentar encontrar el planner con la nueva estrategia
      let planner = null;
      let retryCount = 0;
      const maxRetries = 10; // Aumentamos aún más los reintentos
      
      while (!planner && retryCount < maxRetries) {
        const currentPlanners = getCurrentPlanners();
        planner = currentPlanners.find(p => p.id === plannerId);
        
        if (!planner) {
          console.log(`🔍 Planner no encontrado, intento ${retryCount + 1}/${maxRetries}`);
          console.log(`📊 Planners disponibles en intento ${retryCount + 1}:`, currentPlanners.map(p => ({ id: p.id, name: p.name })));
          
          // 🔧 MEJORA: Si es el primer intento y no hay planners en el estado pero sí en localStorage, 
          // forzar una actualización del estado del contexto padre
          if (retryCount === 0 && planners.length === 0 && currentPlanners.length > 0) {
            console.log('🔄 Forzando actualización de planners desde localStorage...');
            // Esto actualizará el estado del TravelPlannerContext
            // El useEffect se encargará de la sincronización
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
          retryCount++;
        }
      }
      
      console.log('📋 Planner encontrado:', planner ? { id: planner.id, name: planner.name, cart: planner.cart } : 'NO ENCONTRADO');
      
      if (!planner) {
        console.error(`❌ Planner ${plannerId} no encontrado después de ${maxRetries} reintentos`);
        console.error('📊 Estado final de planners:', getCurrentPlanners().map(p => ({ id: p.id, name: p.name })));
        throw new Error('Planner no encontrado después de reintentos');
      }

      console.log('🛒 Cart actual:', planner.cart);
      const updatedCart = cartUpdater(planner.cart);
      console.log('🛒 Cart actualizado:', updatedCart);
      
      // Actualizar el planner directamente con el carrito actualizado
      console.log('💾 Llamando updatePlanner con carrito actualizado...');
      const success = await updatePlanner(plannerId, {
        cart: updatedCart,
        budget: updatedCart.total,
        totalEstimated: updatedCart.total
      });
      
      console.log('✅ updatePlanner resultado:', success);
      
      if (success) {
        console.log('🎉 Cart actualizado exitosamente');
        
        // Forzar actualización del activeCart si es el planner activo
        if (plannerId === activePlannerId) {
          const currentPlanners = getCurrentPlanners();
          const updatedPlanner = currentPlanners.find(p => p.id === plannerId);
          if (updatedPlanner) {
            console.log('🔄 Actualizando activeCart con datos frescos');
            setActiveCart(updatedPlanner.cart);
          } else {
            // 🔧 FALLBACK: Si no encontramos el planner, intentar de nuevo después de un delay
            console.log('⏳ Planner no encontrado inmediatamente, reintentando...');
            setTimeout(() => {
              const retryPlanners = getCurrentPlanners();
              const retryPlanner = retryPlanners.find(p => p.id === plannerId);
              if (retryPlanner) {
                console.log('✅ Planner encontrado en reintentos, actualizando activeCart');
                setActiveCart(retryPlanner.cart);
              }
            }, 300);
          }
        }
      }
      
      return success;
    } catch (err) {
      console.error('❌ Error en updatePlannerCart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: Omit<PlannerCartItem, 'id' | 'addedAt'>, plannerId: string): Promise<boolean> => {
    console.log('🛒 addToCart iniciado:', { item, plannerId, activePlannerId });
    
    // 🔧 CRÍTICO: Asegurar que el activePlannerId esté sincronizado
    if (plannerId !== activePlannerId) {
      console.log('⚠️ ActivePlannerId no coincide, sincronizando:', { current: activePlannerId, target: plannerId });
      setActivePlannerId(plannerId);
      
      // Pequeña pausa para permitir la sincronización
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    const result = await updatePlannerCart(plannerId, (cart) => {
      const newItem: PlannerCartItem = {
        ...item,
        id: generateCartItemId(),
        addedAt: new Date()
      };

      const updatedItems = [...cart.items, newItem];
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxes = subtotal * 0.16; // 16% IVA
      const total = subtotal + taxes - cart.discount;

      console.log('🔄 Cart actualizado en addToCart:', {
        itemsCount: updatedItems.length,
        subtotal,
        total
      });

      return {
        ...cart,
        items: updatedItems,
        subtotal,
        taxes,
        total,
        updatedAt: new Date()
      };
    });

    // NUEVA ESTRATEGIA: Forzar re-sincronización inmediata
    if (result && plannerId === activePlannerId) {
      console.log('🔄 Forzando re-sincronización inmediata del activeCart');
      
      // Esperar un tick para que el estado se propague
      setTimeout(() => {
        const currentPlanners = planners;
        const updatedPlanner = currentPlanners.find(p => p.id === plannerId);
        if (updatedPlanner) {
          console.log('🎯 Actualizando activeCart con datos más frescos:', {
            itemsCount: updatedPlanner.cart?.items.length || 0,
            total: updatedPlanner.cart?.total || 0
          });
          setActiveCart(updatedPlanner.cart);
        }
      }, 100);
    }

    return result;
  };

  const removeFromCart = async (itemId: string, plannerId: string): Promise<boolean> => {
    return updatePlannerCart(plannerId, (cart) => {
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxes = subtotal * 0.16;
      const total = subtotal + taxes - cart.discount;

      return {
        ...cart,
        items: updatedItems,
        subtotal,
        taxes,
        total,
        updatedAt: new Date()
      };
    });
  };

  const updateQuantity = async (itemId: string, quantity: number, plannerId: string): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(itemId, plannerId);
    }

    return updatePlannerCart(plannerId, (cart) => {
      const updatedItems = cart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxes = subtotal * 0.16;
      const total = subtotal + taxes - cart.discount;

      return {
        ...cart,
        items: updatedItems,
        subtotal,
        taxes,
        total,
        updatedAt: new Date()
      };
    });
  };

  const updatePaymentOption = async (itemId: string, paymentOption: PaymentOption, plannerId: string): Promise<boolean> => {
    return updatePlannerCart(plannerId, (cart) => {
      const updatedItems = cart.items.map(item => 
        item.id === itemId ? { ...item, paymentOption } : item
      );

      return {
        ...cart,
        items: updatedItems,
        updatedAt: new Date()
      };
    });
  };

  const clearCart = async (plannerId: string): Promise<boolean> => {
    return updatePlannerCart(plannerId, (cart) => ({
      ...cart,
      items: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      updatedAt: new Date()
    }));
  };

  const createQuickPlanner = async (name?: string): Promise<string | null> => {
    try {
      console.log('🚀 createQuickPlanner iniciado:', { name });
      setIsLoading(true);
      setError(null);

      const quickPlannerName = name || `Compra Rápida ${new Date().toLocaleDateString()}`;
      console.log('📝 Nombre del planner:', quickPlannerName);
      
      const plannerId = await createPlanner({
        name: quickPlannerName,
        destination: 'Compra rápida',
        currency: 'MXN',
        travelers: 1,
        budget: 0
      });

      console.log('🆔 Planner creado con ID:', plannerId);

      if (plannerId) {
        setActivePlannerId(plannerId);
        console.log('✅ Planner ID guardado y activado');
        return plannerId;
      }
      
      return null;
    } catch (err) {
      console.error('❌ Error en createQuickPlanner:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error creando planner rápido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setActivePlanner = (plannerId: string | null) => {
    setActivePlannerId(plannerId);
  };

  const getCartTotal = (plannerId?: string): number => {
    const targetPlannerId = plannerId || activePlannerId;
    if (!targetPlannerId) return 0;

    const planner = planners.find(p => p.id === targetPlannerId);
    return planner?.cart.total || 0;
  };

  const getCartItemCount = (plannerId?: string): number => {
    const targetPlannerId = plannerId || activePlannerId;
    if (!targetPlannerId) return 0;

    const planner = planners.find(p => p.id === targetPlannerId);
    return planner?.cart.items.reduce((count, item) => count + item.quantity, 0) || 0;
  };

  const calculateInstallments = (amount: number, installments: number): InstallmentPlan => {
    const installmentAmount = Math.round((amount / installments) * 100) / 100;
    const startDate = new Date();
    
    const payments = Array.from({ length: installments }, (_, index) => ({
      id: `payment_${index + 1}_${Date.now()}`,
      installmentNumber: index + 1,
      amount: installmentAmount,
      dueDate: new Date(startDate.getTime() + (index * 30 * 24 * 60 * 60 * 1000)), // Mensual
      status: 'pending' as const
    }));

    return {
      totalAmount: amount,
      installments,
      installmentAmount,
      frequency: 'monthly',
      startDate,
      payments
    };
  };

  const contextValue: PlannerCartContextType = {
    activeCart,
    activePlannerId,
    addToCart,
    removeFromCart,
    updateQuantity,
    updatePaymentOption,
    clearCart,
    setActivePlanner,
    getCartTotal,
    getCartItemCount,
    createQuickPlanner,
    calculateInstallments,
    isLoading,
    error
  };

  return (
    <PlannerCartContext.Provider value={contextValue}>
      {children}
    </PlannerCartContext.Provider>
  );
};

export const usePlannerCart = (): PlannerCartContextType => {
  const context = useContext(PlannerCartContext);
  if (!context) {
    throw new Error('usePlannerCart debe usarse dentro de PlannerCartProvider');
  }
  return context;
};
