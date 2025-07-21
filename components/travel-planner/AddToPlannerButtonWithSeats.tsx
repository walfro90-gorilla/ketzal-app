"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePlannerCart } from "@/context/PlannerCartContext";
import { useTravelPlanner } from "@/context/TravelPlannerContext";
import { CheckCircle2, Calendar, Users, ArrowRight } from "lucide-react";
import SeatSelector from "./SeatSelector";
import ResponsiveSeatSelector from "./ResponsiveSeatSelector";
import { TourInfo, PassengerInfo, SeatSelection } from "@/types/seat-selector";

interface AddToPlannerButtonWithSeatsProps {
  serviceId: string;
  serviceName: string;
  price: number;
  imgBanner?: string;
  packageType?: string;
  packageDescription?: string;
  type: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  // Fechas del servicio
  availableFrom?: string;
  availableTo?: string | null;
  // Props adicionales para tours
  location?: string;
  description?: string;
  // Nuevas props para selector de asientos
  enableSeatSelection?: boolean;
  passengerCount?: number;
  tourInfo?: Partial<TourInfo>;
}

export default function AddToPlannerButtonWithSeats({
  serviceId,
  serviceName,
  price,
  imgBanner,
  packageType = "Servicio",
  packageDescription = "",
  type,
  variant = "default",
  size = "default",
  availableFrom,
  availableTo: _availableTo, // eslint-disable-line @typescript-eslint/no-unused-vars
  location = "",
  description = "",
  enableSeatSelection = false,
  passengerCount = 1,
  tourInfo,
}: AddToPlannerButtonWithSeatsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  
  const { addToCart, setActivePlanner: setCartActivePlanner } = usePlannerCart();
  const { activePlanner, addToPlanner } = useTravelPlanner();

  // Determinar si es un servicio turístico (va al timeline) o producto (va al carrito)
  const isService = type === 'service' || type === 'tour' || type === 'hotel' || type === 'transport' || type === 'activity';
  const buttonText = isService ? "Agregar a Itinerario" : "Agregar al Planner";

  // Generar pasajeros por defecto
  const generatePassengers = (): PassengerInfo[] => {
    return Array.from({ length: passengerCount }, (_, index) => ({
      name: `Pasajero ${index + 1}`,
      type: 'Adult' as const
    }));
  };

  // Crear información del tour por defecto
  const defaultTourInfo: TourInfo = {
    id: serviceId,
    name: serviceName,
    route: {
      origin: tourInfo?.route?.origin || location,
      destination: tourInfo?.route?.destination || "Destino"
    },
    schedule: {
      departure: "08:00",
      arrival: "18:00",
      date: availableFrom ? new Date(availableFrom).toLocaleDateString() : new Date().toLocaleDateString()
    },
    operator: {
      name: tourInfo?.operator?.name || "Ketzal Tours",
      logo: tourInfo?.operator?.logo
    },
    basePrice: price,
    seatPricing: {
      standard: 0,
      front: 25,
      table: 15
    }
  };

  const handleAddToPlanner = async () => {
    if (!activePlanner?.id) {
      console.error('❌ No hay planner activo seleccionado');
      return;
    }

    // Si es un tour con selección de asientos habilitada, mostrar el selector
    if (enableSeatSelection && type === 'tour') {
      setShowSeatSelector(true);
      return;
    }

    // Si es un servicio turístico, agregar al timeline
    if (isService) {
      await handleAddToTimeline();
      return;
    }

    // Si es un producto, agregar directamente al carrito
    await handleAddToCart();
  };

  const handleSeatSelectionConfirm = async (selections: SeatSelection[]) => {
    if (!activePlanner?.id) return;

    setIsLoading(true);
    try {
      // Agregar cada selección de asiento como item separado
      for (const selection of selections) {
        if (isService) {
          const request = {
            item: {
              type: type as "tour" | "hotel" | "transport" | "activity" | "service" | "product",
              serviceId: `${serviceId}-${selection.seat.id}`,
              serviceName: `${serviceName} - Asiento ${selection.seat.number}`,
              packageType: `${packageType} - ${selection.seat.type === 'front' ? 'Frontal' : 
                                             selection.seat.type === 'table' ? 'Mesa' : 'Estándar'}`,
              packageDescription: `${packageDescription}\nPasajero: ${selection.passenger.name}`,
              price: selection.totalPrice,
              quantity: 1,
              plannedDate: availableFrom ? new Date(availableFrom) : new Date(),
              plannedTime: "08:00",
              priority: 'medium' as const,
              image: imgBanner,
              imgBanner,
              location: location || '',
              duration: "08:00 - 18:00",
              description: `${description}\nAsiento: ${selection.seat.number}`,
              isConfirmed: false,
              isPaid: false
            },
            plannedDate: availableFrom ? new Date(availableFrom) : new Date()
          };

          await addToPlanner(request);
        } else {
          const newItem = {
            serviceId: `${serviceId}-${selection.seat.id}`,
            name: `${serviceName} - Asiento ${selection.seat.number}`,
            price: selection.totalPrice,
            quantity: 1,
            type: type as "product" | "service",
            image: imgBanner || '',
            packageType: `${packageType} - Asiento ${selection.seat.type}`,
            description: `${packageDescription}\nPasajero: ${selection.passenger.name}`,
            paymentOption: 'cash' as const
          };

          await addToCart(newItem, activePlanner.id);
        }
      }

      setSelectedSeats(selections);
      setIsAdded(true);
      setShowSeatSelector(false);
      setTimeout(() => setIsAdded(false), 3000);

    } catch (error) {
      console.error('❌ Error al confirmar selección de asientos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 handleAddToCart iniciado - Producto');
      
      if (activePlanner?.id) {
        console.log('🔄 Sincronizando PlannerCartContext con activePlanner:', activePlanner.id);
        setCartActivePlanner(activePlanner.id);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const newItem = {
        serviceId,
        name: serviceName,
        price,
        quantity: 1,
        type: type as "product" | "service",
        image: imgBanner || '',
        packageType,
        description: packageDescription,
        paymentOption: 'cash' as const
      };

      const success = await addToCart(newItem, activePlanner!.id);
      
      if (success) {
        console.log('✅ Producto agregado exitosamente al carrito');
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        console.error('❌ Error: No se pudo agregar el producto al carrito');
      }
    } catch (error) {
      console.error('❌ Error en handleAddToCart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToTimeline = async () => {
    if (!availableFrom) {
      console.error('❌ El servicio no tiene fecha de inicio disponible');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 handleAddToTimeline iniciado - Servicio turístico');

      const startDateTime = new Date(availableFrom);
      const startTime = "09:00";
      const endTime = "17:00";

      const request = {
        item: {
          type: type as "tour" | "hotel" | "transport" | "activity" | "service" | "product",
          serviceId,
          serviceName,
          packageType,
          packageDescription,
          price,
          quantity: 1,
          plannedDate: startDateTime,
          plannedTime: startTime,
          priority: 'medium' as const,
          image: imgBanner,
          imgBanner,
          location: packageDescription || location || '',
          duration: `${startTime} - ${endTime}`,
          description: packageDescription || description || '',
          isConfirmed: false,
          isPaid: false
        },
        plannedDate: startDateTime
      };

      const success = await addToPlanner(request);
      
      if (success) {
        console.log('✅ Servicio agregado exitosamente al timeline');
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error('❌ Error en handleAddToTimeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToPlanner}
        disabled={isLoading || !activePlanner?.id}
        className="w-full"
      >
        {isLoading ? (
          "Agregando..."
        ) : isAdded ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {selectedSeats.length > 0 ? `${selectedSeats.length} Asientos Agregados` : 'Agregado'}
          </>
        ) : (
          <>
            {isService && <Calendar className="w-4 h-4 mr-2" />}
            {enableSeatSelection && type === 'tour' && (
              <Users className="w-4 h-4 mr-2" />
            )}
            {enableSeatSelection && type === 'tour' ? 'Seleccionar Asientos' : buttonText}
            {enableSeatSelection && type === 'tour' && (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </>
        )}
      </Button>

      {/* Dialog del Selector de Asientos */}
      <Dialog open={showSeatSelector} onOpenChange={setShowSeatSelector}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Seleccionar Asientos - {serviceName}</DialogTitle>
          </DialogHeader>
          
          <SeatSelector
            tourInfo={defaultTourInfo}
            passengers={generatePassengers()}
            onSeatSelect={(selection) => {
              console.log('Asiento seleccionado:', selection);
            }}
            onConfirmSelection={handleSeatSelectionConfirm}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
