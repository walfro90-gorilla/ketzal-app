"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SeatSelector from '@/components/travel-planner/SeatSelector';
import { TourInfo, PassengerInfo, SeatSelection } from '@/types/seat-selector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { useTravelPlanner } from '@/context/TravelPlannerContext';

interface TourSeatSelectionPageProps {
  tourId: string;
  tourData?: TourInfo;
}

export default function TourSeatSelectionPage({ 
  tourId, 
  tourData 
}: TourSeatSelectionPageProps) {
  const router = useRouter();
  const { addToCart } = usePlannerCart();
  const { activePlanner } = useTravelPlanner();

  // Datos de ejemplo - en producción vendrían de props o API
  const defaultTourInfo: TourInfo = tourData || {
    id: tourId,
    name: "Tour Espectacular por los Andes",
    route: {
      origin: "Lima",
      destination: "Cusco"
    },
    schedule: {
      departure: "08:00",
      arrival: "18:00", 
      date: "2025-08-15"
    },
    operator: {
      name: "Andes Explorer",
      logo: "/tour-operators/andes-explorer.png"
    },
    basePrice: 150,
    seatPricing: {
      standard: 20,
      front: 50,
      table: 30
    }
  };

  // Pasajeros de ejemplo - en producción vendrían del estado del carrito
  const [passengers] = useState<PassengerInfo[]>([
    { name: "Juan Pérez", type: "Adult" },
    { name: "María García", type: "Adult" },
    { name: "Sofía Pérez", type: "Child" }
  ]);

  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSeatSelect = (selection: SeatSelection) => {
    console.log('Asiento seleccionado:', selection);
    // Actualizar el estado local
    setSelectedSeats(prev => {
      const filtered = prev.filter(s => s.passenger.name !== selection.passenger.name);
      return [...filtered, selection];
    });
  };

  const handleConfirmSelection = async (selections: SeatSelection[]) => {
    if (!activePlanner?.id) {
      console.error('No hay planner activo');
      return;
    }

    setIsConfirming(true);
    try {
      console.log('Confirmando selecciones:', selections);
      
      // Agregar cada selección al carrito
      for (const selection of selections) {
        const cartItem = {
          serviceId: `${defaultTourInfo.id}-seat-${selection.seat.id}`,
          name: `${defaultTourInfo.name} - Asiento ${selection.seat.number}`,
          price: selection.totalPrice,
          quantity: 1,
          type: 'service' as const,
          image: '', // Agregar imagen del tour si está disponible
          packageType: `Asiento ${selection.seat.type === 'front' ? 'Frontal' : 
                                   selection.seat.type === 'table' ? 'Mesa' : 'Estándar'}`,
          description: `Pasajero: ${selection.passenger.name} (${selection.passenger.type})`,
          paymentOption: 'cash' as const
        };

        await addToCart(cartItem, activePlanner.id);
      }

      setSelectedSeats(selections);
      
      // Navegar de regreso o a la siguiente página
      router.push('/planner/cart'); // o donde quieras redirigir
      
    } catch (error) {
      console.error('Error al confirmar selección:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Seleccionar Asientos
              </h1>
              <p className="text-gray-600">
                Elige los asientos para tu tour
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SeatSelector
          tourInfo={defaultTourInfo}
          passengers={passengers}
          onSeatSelect={handleSeatSelect}
          onConfirmSelection={handleConfirmSelection}
          className="bg-white rounded-xl shadow-sm"
        />

        {/* Estado de carga */}
        {isConfirming && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Confirmando selección...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con información adicional */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Los asientos frontales ofrecen mejor vista panorámica. 
              Los asientos con mesa son ideales para familias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
