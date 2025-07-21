'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { TravelPlanner } from '@/types/travel-planner';
import { ArrowLeft, MapPin, Users, DollarSign, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import PlannerShoppingCart from '@/components/travel-planner/PlannerShoppingCart';
import PlannerTimeline from '@/components/travel-planner/PlannerTimeline';

const PlannerDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { planners, deletePlanner, isLoading } = useTravelPlanner();
  const { getCartTotal } = usePlannerCart();

  const plannerId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const planner = planners.find((p: TravelPlanner) => p.id === plannerId);

  // Get totals from context
  const cartTotal = plannerId ? getCartTotal(plannerId) : 0;
  const timelineTotal = 0; // TODO: Implement timeline total from context
  
  // Calcular totales combinados (cart + timeline)
  const grandTotal = cartTotal + timelineTotal;
  const handleDeletePlanner = async () => {
    if (!planner) return;
    
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este planner?');
    if (confirmed) {
      const success = await deletePlanner(planner.id);
      if (success) {
        toast({
          title: 'Planner eliminado',
          description: 'El planner ha sido eliminado exitosamente'
        });
        router.push('/planners');
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el planner'
        });
      }
    }
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toLocaleString()} MXN`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planner...</p>
        </div>
      </div>
    );
  }

  if (!planner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Planner no encontrado</h1>
          <p className="text-gray-600 mb-6">El planner que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push('/planners')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Planners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
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
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Información del Viaje</CardTitle>
                    <CardDescription className="text-sm">Detalles principales</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</label>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{planner.destination}</span>
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
                    <CardDescription className="text-sm">Carrito + Timeline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <label className="text-xs font-medium text-green-700 uppercase tracking-wider">Carrito de compras</label>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-green-600">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-xs font-medium text-blue-700 uppercase tracking-wider">Timeline servicios</label>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-blue-600">{formatPrice(timelineTotal)}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Total general</label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(grandTotal)}</span>
                      {planner.budget && (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            grandTotal <= planner.budget 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {grandTotal <= planner.budget ? '✓ Dentro' : '⚠ Excedido'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {planner.budget && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progreso del presupuesto</span>
                        <span className="font-medium">
                          {Math.round((grandTotal / planner.budget) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            grandTotal <= planner.budget 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : 'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${Math.min((grandTotal / planner.budget) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Restante: {formatPrice(Math.max(planner.budget - grandTotal, 0))}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card de acciones */}
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Planner
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                    onClick={handleDeletePlanner}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Planner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal: Carrito + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* 🛒 Carrito de Compras */}
            <PlannerShoppingCart
              plannerId={planner.id}
            />

            {/* 📅 Timeline del Viaje */}
            <PlannerTimeline
              plannerId={planner.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerDetailPage;
