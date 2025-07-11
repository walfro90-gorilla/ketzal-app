'use client'

import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Settings,
  Plus,
  Star,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { TravelPlanner } from '@/types/travel-planner';

interface TravelPlannerSidebarProps {
  trigger?: React.ReactNode;
  side?: 'left' | 'right';
}

const TravelPlannerSidebar: React.FC<TravelPlannerSidebarProps> = ({ 
  trigger,
  side = 'right' 
}) => {
  const { 
    planners, 
    activePlanner, 
    setActivePlanner,
    getPlannerSummary,
    createPlanner 
  } = useTravelPlanner();
  
  const [isOpen, setIsOpen] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'planning': return 'Planificando';
      case 'confirmed': return 'Confirmado';
      case 'paid': return 'Pagado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const handleCreateQuickPlanner = async () => {
    const plannerId = await createPlanner({
      name: 'Mi nuevo viaje',
      destination: 'Destino por definir'
    });
    
    if (plannerId) {
      setActivePlanner(plannerId);
    }
  };

  const renderPlannerCard = (planner: TravelPlanner) => {
    const summary = getPlannerSummary(planner.id);
    const isActive = activePlanner?.id === planner.id;

    return (
      <Card 
        key={planner.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}
        onClick={() => setActivePlanner(planner.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {planner.name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {planner.destination}
              </div>
            </div>
            {isActive && (
              <Star className="h-5 w-5 text-blue-500 fill-current" />
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(planner.status)}>
              {getStatusLabel(planner.status)}
            </Badge>
            {summary.totalItems > 0 && (
              <Badge variant="outline">
                {summary.totalItems} items
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Fechas del viaje */}
          {(planner.startDate || planner.endDate) && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              {planner.startDate && format(planner.startDate, 'dd MMM', { locale: es })}
              {planner.startDate && planner.endDate && ' - '}
              {planner.endDate && format(planner.endDate, 'dd MMM yyyy', { locale: es })}
            </div>
          )}

          {/* Viajeros */}
          {planner.travelers && planner.travelers > 1 && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Users className="h-4 w-4 mr-2" />
              {planner.travelers} viajeros
            </div>
          )}

          {/* Resumen financiero */}
          {summary.totalCost > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total estimado:</span>
                <span className="font-semibold">{formatCurrency(summary.totalCost)}</span>
              </div>
              
              {summary.totalPaid > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pagado:</span>
                  <span className="text-green-600 font-semibold">
                    {formatCurrency(summary.totalPaid)}
                  </span>
                </div>
              )}

              {summary.pendingPayment > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pendiente:</span>
                  <span className="text-orange-600 font-semibold">
                    {formatCurrency(summary.pendingPayment)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Progreso */}
          {summary.totalItems > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{summary.confirmedItems}/{summary.totalItems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${summary.totalItems > 0 ? (summary.confirmedItems / summary.totalItems) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Estado del planner */}
          {summary.totalItems === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              Sin items agregados
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderActivePlannerSummary = () => {
    if (!activePlanner) return null;

    const summary = getPlannerSummary();
    
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Planner Activo
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{activePlanner.name}</h3>
              <p className="text-blue-100 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {activePlanner.destination}
              </p>
            </div>

            {summary.totalItems > 0 && (
              <div className="space-y-2">
                <Separator className="bg-blue-400" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-blue-100">Items</div>
                    <div className="font-semibold">{summary.totalItems}</div>
                  </div>
                  <div>
                    <div className="text-blue-100">Días</div>
                    <div className="font-semibold">{summary.daysPlanned}</div>
                  </div>
                </div>

                {summary.totalCost > 0 && (
                  <div>
                    <div className="text-blue-100 text-sm">Total estimado</div>
                    <div className="text-xl font-bold">{formatCurrency(summary.totalCost)}</div>
                  </div>
                )}
              </div>
            )}

            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                // TODO: Navegar a la página del planner
                console.log('Ver planner completo:', activePlanner.id);
              }}
            >
              Ver Planner Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <MapPin className="h-4 w-4 mr-2" />
      Travel Planners
      {planners.length > 0 && (
        <Badge variant="secondary" className="ml-2">
          {planners.length}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      
      <SheetContent side={side} className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Mis Travel Planners
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Planner activo - resumen rápido */}
          {activePlanner && renderActivePlannerSummary()}

          {/* Lista de todos los planners */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Todos los Planners</h3>
              <Button 
                size="sm" 
                onClick={handleCreateQuickPlanner}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </div>

            {planners.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No tienes planners aún</p>
                  <p className="text-sm mb-4">
                    Crea tu primer planner para organizar tu próximo viaje
                  </p>
                  <Button onClick={handleCreateQuickPlanner}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear mi primer planner
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {planners.map(renderPlannerCard)}
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          {planners.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Ver presupuestos
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Vista calendario
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TravelPlannerSidebar;
