"use client"

import { TourPricingWithSeats } from '@/components/tour-pricing-with-seats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Users, Star, Calendar } from 'lucide-react';

export default function TourPricingDemo() {
  // Datos de ejemplo de un tour real
  const tourData = {
    id: "tour-cusco-machu-picchu",
    name: "Tour Cusco - Machu Picchu Premium",
    description: "Viaje en bus de lujo con asientos premium y guía especializado. Incluye transporte cómodo, almuerzo gourmet y entrada prioritaria a Machu Picchu.",
    bannerImage: "/tours/cusco-machu-picchu.jpg",
    availableFrom: "2025-08-01T06:00:00",
    availableTo: "2025-12-31T20:00:00",
    originalPrice: 350,
    packs: [
      { name: "Económico", price: 250, qty: 20 },
      { name: "Estándar", price: 300, qty: 15 },
      { name: "Premium", price: 400, qty: 8 },
      { name: "VIP", price: 500, qty: 4 }
    ],
    location: "Cusco - Machu Picchu",
    organizer: {
      name: "Andes Explorer Tours",
      logo: "/operators/andes-explorer.png"
    },
    includes: [
      "Transporte en bus premium",
      "Guía profesional bilingüe",
      "Almuerzo gourmet",
      "Entrada a Machu Picchu",
      "Fotografías profesionales"
    ]
  };

  // Ejemplo de tour sin transporte en bus
  const tourDataWithoutBus = {
    ...tourData,
    id: "tour-walking-lima",
    name: "Walking Tour Lima Centro Histórico",
    description: "Recorrido a pie por el centro histórico de Lima con guía especializado. Descubre la historia colonial y republicana de la capital peruana.",
    includes: [
      "Guía profesional",
      "Entrada a museos",
      "Degustación gastronómica",
      "Mapa turístico"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚌 Integración del Selector de Asientos en Tours
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demostración de cómo funciona el nuevo sistema de selección de asientos 
            integrado en las páginas de tours. El sistema detecta automáticamente 
            si un tour incluye transporte en bus.
          </p>
        </div>

        {/* Cards de demostración */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Tour CON selector de asientos */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-green-500 to-blue-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bus className="w-6 h-6" />
                      <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                        Selector de Asientos Activo
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{tourData.name}</h2>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{tourData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>12 horas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>45 personas max</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Características del Tour</h3>
                    <p className="text-gray-600 text-sm mb-3">{tourData.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Incluye:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tourData.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Bus className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Detección Automática Activa
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">
                        El sistema detectó que este tour incluye transporte en bus, 
                        por lo que el selector de asientos está habilitado automáticamente.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Componente de pricing CON selector */}
            <TourPricingWithSeats
              packs={tourData.packs}
              price={tourData.originalPrice}
              availableFrom={tourData.availableFrom}
              availableTo={tourData.availableTo}
              originalPrice={tourData.originalPrice}
              title={tourData.name}
              idService={tourData.id}
              bannerImage={tourData.bannerImage}
              hasBusTransport={true}
              location={tourData.location}
              description={tourData.description}
              organizer={tourData.organizer}
            />
          </div>

          {/* Tour SIN selector de asientos */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-orange-500 to-red-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-6 h-6" />
                      <Badge className="bg-gray-500 text-white border-gray-400">
                        Tour a Pie - Sin Bus
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{tourDataWithoutBus.name}</h2>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Lima Centro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>4 horas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>15 personas max</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Características del Tour</h3>
                    <p className="text-gray-600 text-sm mb-3">{tourDataWithoutBus.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Incluye:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tourDataWithoutBus.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">
                          Tour Tradicional
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Este tour no incluye transporte en bus, por lo que usa 
                        el botón tradicional de agregar al planner.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Componente de pricing SIN selector */}
            <TourPricingWithSeats
              packs={tourDataWithoutBus.packs}
              price={tourDataWithoutBus.originalPrice}
              availableFrom={tourDataWithoutBus.availableFrom}
              availableTo={tourDataWithoutBus.availableTo}
              originalPrice={tourDataWithoutBus.originalPrice}
              title={tourDataWithoutBus.name}
              idService={tourDataWithoutBus.id}
              bannerImage={tourDataWithoutBus.bannerImage}
              hasBusTransport={false}
              location="Lima Centro"
              description={tourDataWithoutBus.description}
              organizer={tourDataWithoutBus.organizer}
            />
          </div>
        </div>

        {/* Información técnica */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Bus className="w-5 h-5" />
                Con Selector de Asientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Detección automática de transporte
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Selector visual de asientos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Precios diferenciados por asiento
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Múltiples pasajeros
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  UX moderna tipo aerolínea
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Users className="w-5 h-5" />
                Tour Tradicional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Botón tradicional
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Agregado directo al planner
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Sin selección de asientos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Proceso rápido y simple
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Compatible con tours a pie
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Calendar className="w-5 h-5" />
                Detección Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Palabras clave detectadas:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• &quot;bus&quot;, &quot;transporte&quot;</li>
                    <li>• Nombre del proveedor de transporte</li>
                    <li>• Lista de incluidos</li>
                    <li>• Descripción del servicio</li>
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-blue-600 font-medium">
                    💡 El sistema es inteligente y detecta automáticamente 
                    qué tours necesitan selector de asientos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instrucciones de uso */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              📋 Cómo Probar la Integración
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700 flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  Tour con Selector de Asientos:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Selecciona un paquete del dropdown</li>
                  <li>Elige el número de pasajeros</li>
                  <li>Haz clic en &quot;Seleccionar Asientos&quot;</li>
                  <li>Se abre el modal con el layout del bus</li>
                  <li>Selecciona asientos para cada pasajero</li>
                  <li>Confirma la selección</li>
                  <li>Se agrega al planner con asientos específicos</li>
                </ol>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-orange-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Tour Tradicional:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Selecciona un paquete del dropdown</li>
                  <li>Haz clic en &quot;Agregar a Itinerario&quot;</li>
                  <li>Se agrega directamente al planner</li>
                  <li>Proceso rápido y familiar</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>💡 Consejo:</strong> Para acceder a un tour real con esta funcionalidad, 
                visita <code className="bg-blue-100 px-2 py-1 rounded">/tours/[id]</code> 
                donde [id] es el ID de cualquier tour existente en tu base de datos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
