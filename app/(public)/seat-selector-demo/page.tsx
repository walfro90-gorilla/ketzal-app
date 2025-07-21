"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResponsiveSeatSelector from '@/components/travel-planner/ResponsiveSeatSelector';
import BusTransportAdmin from '@/components/admin/BusTransportAdmin';
import { 
  Monitor, 
  Smartphone, 
  Settings, 
  Users, 
  CheckCircle2,
  Bus,
  MapPin,
  Calendar,
  Star,
  RefreshCw
} from 'lucide-react';
import { BusLayout, SeatPricing, ServiceWithBusTransport } from '@/types/seat-selector';

export default function SeatSelectorDemoPage() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState(2);
  const [demoMode, setDemoMode] = useState<'user' | 'admin'>('user');

  // Configuración de ejemplo del bus
  const exampleBusLayout: BusLayout = {
    totalRows: 12,
    seatsPerRow: 4,
    aislePositions: ['C'],
    exitRows: [6, 12]
  };

  const exampleSeatPricing: SeatPricing = {
    standard: 0,
    front: 25,
    table: 15
  };

  // Datos de ejemplo del servicio
  const exampleService: ServiceWithBusTransport = {
    id: 1,
    name: "Tour Cusco - Machu Picchu Premium",
    description: "Viaje en bus de lujo con asientos premium y vista panorámica",
    hasBusTransport: true,
    busLayout: exampleBusLayout,
    seatPricing: exampleSeatPricing
  };

  const handleSeatsSelected = (seats: string[]) => {
    setSelectedSeats(seats);
    console.log('Asientos seleccionados:', seats);
  };

  const handleSaveAdminConfig = async (data: Partial<ServiceWithBusTransport>): Promise<boolean> => {
    console.log('Guardando configuración admin:', data);
    // Simular guardado
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  };

  const totalSeatCost = selectedSeats.reduce((total, seatId) => {
    const row = parseInt(seatId);
    if (row <= 3) return total + exampleSeatPricing.front;
    if (exampleBusLayout.exitRows?.includes(row)) return total + exampleSeatPricing.table;
    return total + exampleSeatPricing.standard;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚌 Sistema de Selector de Asientos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Demostración completa del sistema de selector de asientos con diseño responsive, 
            panel administrativo y integración con base de datos.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={demoMode === 'user' ? 'default' : 'outline'}
              onClick={() => setDemoMode('user')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Vista Usuario
            </Button>
            <Button
              variant={demoMode === 'admin' ? 'default' : 'outline'}
              onClick={() => setDemoMode('admin')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Vista Admin
            </Button>
          </div>
        </div>

        {demoMode === 'user' ? (
          /* Vista del Usuario */
          <div className="space-y-8">
            
            {/* Información del tour */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bus className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold">{exampleService.name}</h2>
                      <p className="text-sm text-gray-600 font-normal">{exampleService.description}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Con Transporte
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Cusco → Machu Picchu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">2 días, 1 noche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">4.8 (127 reseñas)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controles de pasajeros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración del Viaje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Pasajeros:</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      disabled={passengers <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{passengers}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPassengers(Math.min(6, passengers + 1))}
                      disabled={passengers >= 6}
                    >
                      +
                    </Button>
                  </div>
                  
                  {selectedSeats.length > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-600">Costo adicional:</span>
                      <Badge variant="secondary" className="font-medium">
                        +${totalSeatCost}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selector de asientos responsive */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selecciona tus Asientos</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Monitor className="w-4 h-4" />
                  <span className="hidden md:inline">Escritorio</span>
                  <Smartphone className="w-4 h-4 md:hidden" />
                  <span className="md:hidden">Móvil</span>
                </div>
              </div>
              
              <ResponsiveSeatSelector
                busLayout={exampleBusLayout}
                seatPricing={exampleSeatPricing}
                passengers={passengers}
                onSeatsSelected={handleSeatsSelected}
                selectedSeats={selectedSeats}
              />
            </div>

            {/* Resumen de selección */}
            {selectedSeats.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        ✅ Asientos Seleccionados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <Badge key={seat} variant="outline" className="text-green-700 border-green-300">
                            Asiento {seat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Selección
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Vista del Admin */
          <div className="space-y-8">
            
            {/* Header Admin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <div>
                    <h2 className="text-xl">Panel de Administración</h2>
                    <p className="text-sm text-gray-600 font-normal">
                      Configurar transporte y selector de asientos por servicio
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Panel de administración */}
            <BusTransportAdmin
              serviceId={exampleService.id}
              initialData={exampleService}
              onSave={handleSaveAdminConfig}
            />

            {/* Información adicional */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔧 Funcionalidades Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Habilitar/deshabilitar selector por servicio
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Configurar layout del bus (filas, asientos, pasillos)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Definir precios por tipo de asiento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Vista previa en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Guardado automático en base de datos
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📱 Características Responsive</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      Diseño optimizado para escritorio
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      Interfaz táctil para móviles
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      Detección automática de dispositivo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Paginación en pantallas pequeñas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Controles touch-friendly
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Footer informativo */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 Sistema Completo Implementado
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✅ Frontend</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Selector responsive</li>
                  <li>• Panel administrativo</li>
                  <li>• Optimización móvil</li>
                  <li>• Integración con contextos</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">✅ Backend</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• API endpoints creados</li>
                  <li>• Validación de datos</li>
                  <li>• Manejo de errores</li>
                  <li>• Integración con Prisma</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">✅ Base de Datos</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Campos agregados al schema</li>
                  <li>• Migración aplicada</li>
                  <li>• Configuración JSON</li>
                  <li>• Relaciones preservadas</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-gray-600">
                Este sistema está listo para producción y se integra perfectamente 
                con la aplicación Ketzal existente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
