'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { ArrowLeft, MapPin, Users, DollarSign, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import PlannerShoppingCart from '@/components/travel-planner/PlannerShoppingCart';
import PlannerTimeline from '@/components/travel-planner/PlannerTimeline';

const PlannerDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { planners, deletePlanner, isLoading } = useTravelPlanner();
  
  const [cartTotal, setCartTotal] = useState(0);
  const [timelineTotal, setTimelineTotal] = useState(0);

  const plannerId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const planner = planners.find((p: { id: string }) => p.id === plannerId);

  // Función para eliminar el planner completo
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

  // Calcular totales combinados (cart + timeline)
  const grandTotal = cartTotal + timelineTotal;

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
            
            {/* Botones de acción */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeletePlanner}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
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

                  <div className="border-t pt-4">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total general</label>
                    <div className="flex items-center mt-2">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal - Carrito y Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carrito de Compras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">🛒</span>
                  </div>
                  Carrito de Compras
                </CardTitle>
                <CardDescription>
                  Productos y servicios sin fecha específica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlannerShoppingCart 
                  plannerId={planner.id}
                  onTotalChange={setCartTotal}
                />
              </CardContent>
            </Card>

            {/* Timeline de Servicios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">📅</span>
                  </div>
                  Timeline de Servicios
                </CardTitle>
                <CardDescription>
                  Servicios turísticos programados por fecha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlannerTimeline 
                  plannerId={planner.id}
                  onTotalChange={setTimelineTotal}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerDetailPage;