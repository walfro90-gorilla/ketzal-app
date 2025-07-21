"use client"

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TourInfo, PassengerInfo, SeatSelection } from '@/types/seat-selector';

interface UseSeatSelectorReturn {
  openSeatSelector: () => void;
  selectedSeats: SeatSelection[];
  isSelecting: boolean;
  hasSeatsSelected: boolean;
  totalPrice: number;
}

export function useSeatSelector({ 
  tourId 
}: { tourId: string }): UseSeatSelectorReturn {
  const router = useRouter();
  const [selectedSeats] = useState<SeatSelection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const openSeatSelector = useCallback(() => {
    setIsSelecting(true);
    // Navegar a la página del selector de asientos
    // Puedes pasar datos via query params o estado global
    router.push(`/tours/${tourId}/seat-selection`);
  }, [router, tourId]);

  const hasSeatsSelected = selectedSeats.length > 0;
  const totalPrice = selectedSeats.reduce((sum, selection) => sum + selection.totalPrice, 0);

  return {
    openSeatSelector,
    selectedSeats,
    isSelecting,
    hasSeatsSelected,
    totalPrice
  };
}

// Hook para generar pasajeros por defecto
export function useDefaultPassengers(count: number = 1): PassengerInfo[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `Pasajero ${index + 1}`,
    type: 'Adult' as const
  }));
}

// Hook para validar disponibilidad de asientos
export function useSeatAvailability(_tourId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState<number>(0);

  const checkAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      // Aquí harías la llamada a tu API
      // const response = await fetch(`/api/tours/${_tourId}/seats/availability`);
      // const data = await response.json();
      // setAvailableSeats(data.available);
      
      // Por ahora simulamos
      setAvailableSeats(Math.floor(Math.random() * 20) + 10);
    } catch (error) {
      console.error('Error checking seat availability:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    availableSeats,
    isLoading,
    checkAvailability
  };
}
