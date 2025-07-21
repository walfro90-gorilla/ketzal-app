"use client"

import React, { useState, useEffect } from 'react';
import SimpleSeatSelector from './SimpleSeatSelector';
import MobileSeatSelector from './MobileSeatSelector';
import { BusLayout, SeatPricing } from '@/types/seat-selector';

interface ResponsiveSeatSelectorProps {
  busLayout: BusLayout;
  seatPricing: SeatPricing;
  passengers: number;
  onSeatsSelected: (seats: string[]) => void;
  selectedSeats?: string[];
}

export default function ResponsiveSeatSelector(props: ResponsiveSeatSelectorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Evitar hidration mismatch mostrando placeholder
  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando selector de asientos...</div>
      </div>
    );
  }

  return isMobile ? (
    <MobileSeatSelector {...props} />
  ) : (
    <SimpleSeatSelector {...props} />
  );
}
