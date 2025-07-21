"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddToPlannerButton from '@/components/travel-planner/AddToPlannerButton';
import AddToPlannerButtonWithSeats from '@/components/travel-planner/AddToPlannerButtonWithSeats';
import { MapPin, Clock, Users, Star } from 'lucide-react';

export default function ButtonComparisonDemo() {
  const tourData = {
    serviceId: "tour-andes-001",
    serviceName: "Tour Espectacular por los Andes",
    price: 250,
    imgBanner: "/tours/andes-tour.jpg",
    packageType: "Tour Premium",
    packageDescription: "Descubre la majestuosidad de los Andes peruanos en este tour de día completo",
    type: "tour",
    availableFrom: "2025-08-15T08:00:00",
    location: "Cusco - Machu Picchu",
    description: "Un viaje increíble por paisajes únicos con guías expertos y transporte cómodo",
    tourInfo: {
      route: {
        origin: "Cusco",
        destination: "Machu Picchu"
      },
      operator: {
        name: "Andes Explorer Tours",
        logo: "/operators/andes-explorer.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚌 Selector de Asientos vs Botón Tradicional
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compara la experiencia entre el botón tradicional de agregar al planner 
            y el nuevo botón con selector visual de asientos
          </p>
        </div>

        {/* Tour Card */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{tourData.serviceName}</h2>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{tourData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>8 horas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Hasta 45 personas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>4.8 (324 reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Descripción del Tour</h3>
                  <p className="text-gray-600 mb-4">
                    {tourData.packageDescription}. Incluye transporte cómodo en bus 
                    premium, guía profesional, almuerzo típico y entrada a sitios arqueológicos.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Salida: 8:00 AM desde Plaza de Armas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Retorno: 6:00 PM aproximadamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Incluye: Transporte, guía, almuerzo</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Nuevo:</strong> Ahora puedes seleccionar tu asiento preferido 
                      en nuestros buses premium con diferentes categorías de asientos.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-right mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      ${tourData.price}
                      <span className="text-lg font-normal text-gray-600">/persona</span>
                    </div>
                    <p className="text-sm text-gray-500">Precio base - Los asientos premium tienen costo adicional</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🔄 Método Tradicional</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Botón clásico que agrega directamente al itinerario. 
                        Los asientos se asignan automáticamente al momento del pago.
                      </p>
                      <AddToPlannerButton
                        serviceId={tourData.serviceId}
                        serviceName={tourData.serviceName}
                        price={tourData.price}
                        imgBanner={tourData.imgBanner}
                        packageType={tourData.packageType}
                        packageDescription={tourData.packageDescription}
                        type={tourData.type}
                        availableFrom={tourData.availableFrom}
                        location={tourData.location}
                        description={tourData.description}
                      />
                    </div>

                    <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-2">🆕 Con Selector de Asientos</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Nueva experiencia que te permite elegir tu asiento preferido 
                        antes de agregar al itinerario. ¡Como en las aerolíneas!
                      </p>
                      <AddToPlannerButtonWithSeats
                        serviceId={tourData.serviceId}
                        serviceName={tourData.serviceName}
                        price={tourData.price}
                        imgBanner={tourData.imgBanner}
                        packageType={tourData.packageType}
                        packageDescription={tourData.packageDescription}
                        type={tourData.type}
                        availableFrom={tourData.availableFrom}
                        location={tourData.location}
                        description={tourData.description}
                        enableSeatSelection={true}
                        passengerCount={2}
                        tourInfo={tourData.tourInfo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 Método Tradicional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Agregado rápido al itinerario
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Proceso familiar y simple
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Asientos asignados automáticamente
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Sin control sobre ubicación del asiento
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                🆕 Con Selector de Asientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Visualización completa del bus
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Selección de asiento preferido
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Diferentes categorías de precio
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Control total sobre la experiencia
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  UX moderna y atractiva
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📋 Instrucciones para Probar
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Método Tradicional:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Haz clic en &quot;Agregar a Itinerario&quot;</li>
                  <li>El tour se agrega directamente</li>
                  <li>Los asientos se asignarán después</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Con Selector de Asientos:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Haz clic en &quot;Seleccionar Asientos&quot;</li>
                  <li>Se abre el selector visual del bus</li>
                  <li>Elige asientos para cada pasajero</li>
                  <li>Confirma la selección</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
