"use client"

import { useState } from 'react';
import BusTransportAdmin from '@/components/admin/BusTransportAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceWithBusTransport } from '@/types/seat-selector';
import { Settings, Bus, RefreshCw } from 'lucide-react';

export default function AdminPanelDemo() {
  const [selectedService, setSelectedService] = useState<number>(1);
  
  // Datos de ejemplo de servicios
  const mockServices: ServiceWithBusTransport[] = [
    {
      id: 1,
      name: "Tour Cusco - Machu Picchu Premium",
      description: "Viaje en bus de lujo con asientos premium",
      hasBusTransport: true,
      busLayout: {
        totalRows: 12,
        seatsPerRow: 4,
        aislePositions: ['C'],
        exitRows: [6, 12]
      },
      seatPricing: {
        standard: 0,
        front: 30,
        table: 20
      }
    },
    {
      id: 2,
      name: "Walking Tour Lima Centro",
      description: "Recorrido a pie por el centro histórico",
      hasBusTransport: false,
      busLayout: {
        totalRows: 12,
        seatsPerRow: 4,
        aislePositions: ['C'],
        exitRows: []
      },
      seatPricing: {
        standard: 0,
        front: 25,
        table: 15
      }
    },
    {
      id: 3,
      name: "Tour Arequipa - Valle del Colca",
      description: "Tour con transporte en bus turístico de 2 días",
      hasBusTransport: true,
      busLayout: {
        totalRows: 15,
        seatsPerRow: 4,
        aislePositions: ['C'],
        exitRows: [8, 15]
      },
      seatPricing: {
        standard: 5,
        front: 40,
        table: 25
      }
    }
  ];

  // Simular guardado
  const handleSaveService = async (serviceId: number, data: Partial<ServiceWithBusTransport>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Guardando servicio ${serviceId}:`, data);
        
        // Simular actualización en el estado local
        const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
        if (serviceIndex >= 0) {
          mockServices[serviceIndex] = { ...mockServices[serviceIndex], ...data };
        }
        
        resolve(true);
      }, 1500);
    });
  };

  const selectedServiceData = mockServices.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛠️ Panel de Administración - Selector de Asientos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interface para habilitar/deshabilitar y configurar el selector de asientos 
            en servicios de tours. Configuración granular por servicio.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Lista de servicios */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Servicios
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {mockServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full text-left p-3 border-b hover:bg-gray-50 transition-colors ${
                        selectedService === service.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Servicio #{service.id}</span>
                        <Badge variant={service.hasBusTransport ? "default" : "secondary"} className="text-xs">
                          {service.hasBusTransport ? (
                            <><Bus className="w-3 h-3 mr-1" />Activo</>
                          ) : (
                            "Inactivo"
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{service.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas rápidas */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total servicios:</span>
                  <span className="font-medium">{mockServices.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Con selector:</span>
                  <span className="font-medium text-green-600">
                    {mockServices.filter(s => s.hasBusTransport).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sin selector:</span>
                  <span className="font-medium text-gray-500">
                    {mockServices.filter(s => !s.hasBusTransport).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de configuración */}
          <div className="lg:col-span-3">
            {selectedServiceData ? (
              <BusTransportAdmin
                serviceId={selectedServiceData.id}
                initialData={selectedServiceData}
                onSave={(data) => handleSaveService(selectedServiceData.id, data)}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un Servicio
                  </h3>
                  <p className="text-gray-600">
                    Elige un servicio de la lista para configurar sus opciones de transporte.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚀 Funcionalidades del Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Habilitar/deshabilitar selector por servicio
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Configurar layout del bus (filas, asientos)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Definir precios por tipo de asiento
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Vista previa en tiempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Guardado automático de configuración
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Consejos de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>
                    <strong>Tours con bus:</strong> Habilita el selector para tours que incluyan transporte
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>
                    <strong>Walking tours:</strong> Mantén deshabilitado para tours a pie
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>
                    <strong>Precios premium:</strong> Los asientos frontales suelen tener mayor demanda
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>
                    <strong>Vista previa:</strong> Usa la preview para verificar el layout antes de guardar
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔧 Integración con API
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                En producción, este panel se conectaría directamente con tu API para 
                actualizar la base de datos. Los cambios se reflejarían inmediatamente 
                en las páginas de tours.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar con BD
                </Button>
                <span className="text-xs text-gray-500">
                  Última actualización: Hace 2 minutos
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
