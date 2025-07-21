'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  Edit,
  CheckCircle2
} from 'lucide-react';
import PlannerShoppingCart from '@/components/travel-planner/PlannerShoppingCart';
import PlannerTimeline from '@/components/travel-planner/PlannerTimeline';

const PlannerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const plannerId = params?.id as string;

  const { planners, deletePlanner } = useTravelPlanner();
  
  const [planner, setPlanner] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [timelineTotal, setTimelineTotal] = useState(0);

  // Total combinado de carrito + timeline
  const grandTotal = cartTotal + timelineTotal;

  useEffect(() => {
    if (plannerId && planners.length > 0) {
      const foundPlanner = planners.find(p => p.id === plannerId);
      setPlanner(foundPlanner || null);
      setIsLoading(false);
    }
  }, [plannerId, planners]);

  const handleDeletePlanner = async () => {
    if (!planner) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar el planner "${planner.name}"?`)) {
      const success = await deletePlanner(planner.id);
      if (success) {
        toast({
          title: "✅ Planner eliminado",
          description: "El planner se eliminó correctamente",
        });
        router.push('/planners');
      } else {
        toast({
          title: "❌ Error",
          description: "No se pudo eliminar el planner",
        });
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No especificada';
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando planner...</p>
        </div>
      </div>
    );
  }

  if (!planner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Planner no encontrado</h1>
          <p className="text-muted-foreground mb-6">El planner que buscas no existe o fue eliminado.</p>
          <Button onClick={() => router.push('/planners')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Planners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/planners')}
              className="bg-white border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-blue-600" />
                {planner.name}
              </h1>
              <p className="text-gray-600 mt-1">{planner.description || planner.destination}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  📍 {planner.destination}
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  👥 {planner.travelers} {planner.travelers === 1 ? 'viajero' : 'viajeros'}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  💰 {formatPrice(grandTotal)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Planner - Sidebar mejorado */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card principal de información */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">Información del Viaje</CardTitle>
                  <CardDescription className="text-sm">Detalles de tu planner</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</label>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{planner.destination}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(planner.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(planner.endDate)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Viajeros</label>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">{planner.travelers} {planner.travelers === 1 ? 'persona' : 'personas'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
                  <div className="mt-2">
                    <Badge 
                      variant={planner.status === 'completed' ? 'default' : 'secondary'}
                      className={`${
                        planner.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {planner.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de presupuesto */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">Resumen Financiero</CardTitle>
                  <CardDescription className="text-sm">Totales de tu planner</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Carrito de Compras:</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Servicios en Timeline:</span>
                  <span className="font-medium text-gray-900">{formatPrice(timelineTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg border border-green-200">
                  <span className="font-semibold text-green-800">Total General:</span>
                  <span className="font-bold text-lg text-green-800">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones del planner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/planners/${planner.id}/edit`)}
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Planner
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePlanner}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Planner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal - Carrito y Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carrito de Compras */}
          <PlannerShoppingCart 
            plannerId={planner.id}
            onCartUpdate={(cartTotal) => setCartTotal(cartTotal)}
          />

          {/* Timeline de Servicios */}
          <PlannerTimeline 
            plannerId={planner.id}
            onTimelineUpdate={(timelineTotal) => setTimelineTotal(timelineTotal)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlannerDetailPage;
