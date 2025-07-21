'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  CalendarDays,
  Star,
  DollarSign,
  Users,
  Package,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Temporary interface to match what the context actually returns
interface ContextPlannerItem {
  id: string;
  type: string;
  serviceName: string;
  price: number;
  plannedDate?: Date;
  plannedTime?: string;
  location?: string;
  duration?: string;
  description?: string;
  packageType?: string;
  notes?: string;
  isPaid?: boolean;
  isConfirmed?: boolean;
}

interface PlannerTimelineProps {
  plannerId?: string;
  className?: string;
  onTotalChange?: (total: number) => void;
}

type ViewMode = 'horizontal' | 'vertical';

const PlannerTimeline: React.FC<PlannerTimelineProps> = ({ 
  plannerId, 
  className,
  onTotalChange 
}) => {
  const { activePlanner, getPlannerDays, getPlannerSummary } = useTravelPlanner();
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  
  const currentPlanner = plannerId ? 
    activePlanner?.id === plannerId ? activePlanner : null :
    activePlanner;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const days = currentPlanner ? getPlannerDays(currentPlanner.id) as any[] : [];
  const summary = currentPlanner ? getPlannerSummary(currentPlanner.id) : null;

  // Reportar el total al componente padre cuando cambie
  useEffect(() => {
    if (onTotalChange && summary) {
      onTotalChange(summary.totalCost || 0);
    }
  }, [summary, onTotalChange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return <MapPin className="w-4 h-4" />;
      case 'hotel':
        return <Users className="w-4 h-4" />;
      case 'transport':
        return <Package className="w-4 h-4" />;
      case 'activity':
        return <Star className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'tour':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'hotel':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'transport':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'activity':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const renderTimelineItem = (item: ContextPlannerItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Service Type Icon */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            getServiceTypeColor(item.type)
          )}>
            {getServiceTypeIcon(item.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {item.serviceName}
                </h4>
                {item.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline" className={getServiceTypeColor(item.type)}>
                  {item.type}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Time and Duration */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
              {item.plannedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.plannedTime}</span>
                </div>
              )}
              {item.duration && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
              )}
            </div>

            {/* Package Info */}
            {item.packageType && (
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {item.packageType}
                </Badge>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-2 mb-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> {item.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatPrice(item.price)}</span>
                </div>
                {item.isPaid && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Pagado
                  </Badge>
                )}
                {item.isConfirmed && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Confirmado
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderVerticalTimeline = () => (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day.date.toISOString()} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {format(day.date, "EEEE, dd 'de' MMMM", { locale: es })}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {day.items.length} {day.items.length === 1 ? 'actividad' : 'actividades'} programadas
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatPrice(day.totalCost)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total del día
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-3 relative">
            {/* Timeline Line */}
            {day.items.length > 1 && (
              <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
            )}
            
            {day.items.map((item: ContextPlannerItem) => (
              <div key={item.id} className="relative z-10">
                {renderTimelineItem(item)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHorizontalTimeline = () => (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {days.map((day) => (
          <Card key={day.date.toISOString()} className="min-w-80 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {format(day.date, "dd MMM", { locale: es })}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {day.items.length} actividades - {formatPrice(day.totalCost)}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.items.map((item: ContextPlannerItem) => (
                <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getServiceTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    {item.plannedTime && (
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {item.plannedTime}
                      </span>
                    )}
                  </div>
                  <h5 className="font-medium text-sm line-clamp-2 mb-1">
                    {item.serviceName}
                  </h5>
                  <div className="text-sm font-semibold text-green-600">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (!currentPlanner) {
    return (
      <Card className={cn("h-full flex items-center justify-center", className)}>
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No hay planner seleccionado
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Selecciona un planner para ver su cronograma
          </p>
        </CardContent>
      </Card>
    );
  }

  if (days.length === 0) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Cronograma de Viaje
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'vertical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('vertical')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Vertical
              </Button>
              <Button
                variant={viewMode === 'horizontal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('horizontal')}
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Horizontal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No hay servicios programados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Agrega servicios turísticos con fechas específicas para ver tu cronograma
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Explorar Servicios
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cronograma de Viaje
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'vertical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('vertical')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Vertical
            </Button>
            <Button
              variant={viewMode === 'horizontal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('horizontal')}
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Horizontal
            </Button>
          </div>
        </div>
        
        {summary && (
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{days.length} días</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{summary.totalItems} servicios</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatPrice(summary.totalCost)}</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        {viewMode === 'vertical' ? renderVerticalTimeline() : renderHorizontalTimeline()}
      </CardContent>
    </Card>
  );
};

export default PlannerTimeline;
