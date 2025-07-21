'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { ChevronDown, ChevronRight, Calendar, ShoppingCart, Plus, MapPin, Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const TravelPlannerSidebar: React.FC = () => {
  const router = useRouter();
  const { planners, activePlanner, setActivePlanner, getPlannerSummary } = useTravelPlanner();
  const { activeCart, setActivePlanner: setCartActivePlanner } = usePlannerCart();
  
  const [isExpanded, setIsExpanded] = useState(true);

  // DEBUG: Log cuando cambia activeCart
  useEffect(() => {
    console.log('🛒 TravelPlannerSidebar - activeCart changed:', {
      activeCart: activeCart ? {
        plannerId: activeCart.plannerId,
        itemCount: activeCart.items.length,
        total: activeCart.total
      } : null,
      activePlannerId: activePlanner?.id
    });
  }, [activeCart, activePlanner?.id]);

  // Sincronizar activePlanner entre contextos
  useEffect(() => {
    if (activePlanner?.id) {
      setCartActivePlanner(activePlanner.id);
      console.log('🔄 Sincronizando activePlanner entre contextos:', activePlanner.id);
    }
  }, [activePlanner?.id, setCartActivePlanner]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getTotalCombined = () => {
    const cartTotal = activeCart?.total || 0;
    const plannerTotal = activePlanner ? getPlannerSummary(activePlanner.id).totalCost : 0;
    return cartTotal + plannerTotal;
  };

  const navigateToPlanner = (plannerId: string) => {
    setActivePlanner(plannerId);
    setCartActivePlanner(plannerId); // Sincronizar con PlannerCartContext
    console.log('🎯 Navegando y sincronizando planner activo:', plannerId);
    router.push(`/planners/${plannerId}`);
  };

  const navigateToNewPlanner = () => {
    router.push('/planners/new');
  };

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Travel Planner
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Combined Totals */}
        <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Combinado</div>
          <div className="text-xl font-bold text-emerald-600">{formatPrice(getTotalCombined())}</div>            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                <span>Carrito: {formatPrice(activeCart?.total || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Cronograma: {formatPrice(activePlanner ? getPlannerSummary(activePlanner.id).totalCost : 0)}</span>
              </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Active Planner */}
              {activePlanner && (
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                          {activePlanner.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{activePlanner.destination}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                        Activo
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Items:</span>
                        <span className="font-medium">{getPlannerSummary(activePlanner.id).totalItems}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Total:</span>
                        <span className="font-bold text-green-600">{formatPrice(getPlannerSummary(activePlanner.id).totalCost)}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateToPlanner(activePlanner.id)}
                      className="w-full mt-3 border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* All Planners List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Mis Planners</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={navigateToNewPlanner}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo
                  </Button>
                </div>

                {planners.length === 0 ? (
                  <Card className="border-dashed border-gray-300 dark:border-gray-600">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        No tienes planners aún
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={navigateToNewPlanner}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-950"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Crear mi primer planner
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {planners.map((planner) => {
                      const summary = getPlannerSummary(planner.id);
                      const isActive = activePlanner?.id === planner.id;
                      
                      return (
                        <Card 
                          key={planner.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            isActive 
                              ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20" 
                              : "hover:border-gray-300 dark:hover:border-gray-600"
                          )}
                          onClick={() => navigateToPlanner(planner.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className={cn(
                                  "font-medium truncate",
                                  isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {planner.name}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{planner.destination}</span>
                                </div>
                              </div>
                              {isActive && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                                  Activo
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                  <Calendar className="w-3 h-3" />
                                  <span>{summary.totalItems}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                  <Users className="w-3 h-3" />
                                  <span>{planner.travelers || 1}</span>
                                </div>
                              </div>
                              <span className="font-semibold text-green-600">
                                {formatPrice(summary.totalCost)}
                              </span>
                            </div>

                            {planner.startDate && planner.endDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(planner.startDate).toLocaleDateString('es-MX', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} - {new Date(planner.endDate).toLocaleDateString('es-MX', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Shopping Cart Summary */}
              {activeCart && activeCart.items.length > 0 && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Carrito
                      </h3>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 px-2 py-1 rounded-full">
                        {activeCart.items.length} items
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                        <span>{formatPrice(activeCart.subtotal)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-600">
                        <span>Total:</span>
                        <span>{formatPrice(activeCart.total)}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/cart')}
                      className="w-full mt-3 border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:hover:bg-emerald-900"
                    >
                      Ver Carrito
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TravelPlannerSidebar;
