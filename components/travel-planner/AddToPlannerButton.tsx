"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlannerCart } from "@/context/PlannerCartContext";
import { useTravelPlanner } from "@/context/TravelPlannerContext";
import { CheckCircle2, Calendar } from "lucide-react";

interface AddToPlannerButtonProps {
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
}

export default function AddToPlannerButton({
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
  availableTo,
  location = "",
  description = "",
}: AddToPlannerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const { addToCart, setActivePlanner: setCartActivePlanner } = usePlannerCart();
  const { activePlanner, addToPlanner } = useTravelPlanner();

  // Determinar si es un servicio turístico (va al timeline) o producto (va al carrito)
  const isService = type === 'service' || type === 'tour' || type === 'hotel' || type === 'transport' || type === 'activity';
  const buttonText = isService ? "Agregar a Itinerario" : "Agregar al Planner";

  const handleAddToPlanner = async () => {
    if (!activePlanner?.id) {
      console.error('❌ No hay planner activo seleccionado');
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

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 handleAddToCart iniciado - Producto');
      
      // 🔧 SINCRONIZACIÓN FORZADA: Asegurar que PlannerCartContext esté sincronizado
      if (activePlanner?.id) {
        console.log('🔄 Sincronizando PlannerCartContext con activePlanner:', activePlanner.id);
        setCartActivePlanner(activePlanner.id);
        
        // Pequeña pausa para permitir que la sincronización se complete
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
        console.log('🎯 PlannerId usado:', activePlanner!.id);
        console.log('📦 Item agregado:', newItem);
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
      console.log('🔍 handleAddToTimeline iniciado - Servicio turístico', {
        serviceId,
        serviceName,
        availableFrom,
        availableTo
      });

      // Usar las fechas del servicio directamente
      const startDateTime = new Date(availableFrom);

      // Extraer horas por defecto (09:00 para inicio, 17:00 para fin)
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
          Agregado
        </>
      ) : (
        <>
          {isService && <Calendar className="w-4 h-4 mr-2" />}
          {buttonText}
        </>
      )}
    </Button>
  );
}
