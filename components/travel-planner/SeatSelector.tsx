"use client"

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { TourInfo, Seat, PassengerInfo, SeatSelection, SeatType } from '@/types/seat-selector';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { User, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// CSS personalizado para el componente
const seatSelectorStyles = `
  .bus-seat-selector {
    --gray-50: #fafafa;
    --gray-100: #f5f5f5;
    --gray-200: #eeeeee;
    --gray-300: #e0e0e0;
    --gray-400: #bdbdbd;
    --gray-500: #9e9e9e;
    --gray-600: #757575;
    --gray-700: #616161;
    --gray-800: #424242;
    --gray-900: #212121;
    
    --bus-border-width: 0.125rem;
    --bus-border-radius: 0.75rem;
    --bus-padding: 1rem;
    --doors-size: 2rem;
    
    font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;
  }

  .bus {
    --bus-border: var(--gray-400);
    --bus-window-background: var(--gray-200);
    
    display: inline-block;
    border: var(--bus-border-width) solid var(--bus-border);
    border-radius: var(--bus-border-radius);
    user-select: none;
    background: white;
  }

  .bus::before {
    content: "";
    display: block;
    height: 4rem;
    border-start-start-radius: calc(var(--bus-border-radius) - var(--bus-border-width));
    border-start-end-radius: calc(var(--bus-border-radius) - var(--bus-border-width));
    background-color: var(--bus-window-background);
    mask: radial-gradient(60% 35% at bottom, transparent calc(100% - 0.125rem), black);
  }

  .bus__layout {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    padding: 0 1rem 1rem 1rem;
  }

  .seat {
    --seat-size: 2.5em;
    --seat-color: var(--gray-500);
    --seat-element-color-border: var(--gray-500);
    --seat-element-color-background: white;
    --seat-element-color-background-hover: var(--gray-200);
    --seat-element-border: 0.125em solid var(--seat-element-color-border);
    --seat-font-size: 0.8rem;

    position: relative;
    width: var(--seat-size);
    height: var(--seat-size);
    color: var(--seat-color);
    font-size: var(--seat-font-size);
    cursor: pointer;
  }

  .seat::before,
  .seat::after {
    content: "";
    z-index: 1;
    position: absolute;
    display: block;
    width: 0.5em;
    height: 1.75em;
    border: var(--seat-element-border);
    background-color: var(--seat-element-color-background);
    border-radius: 999px;
    pointer-events: none;
    top: 0.5em;
  }

  .seat::before {
    left: 0;
  }

  .seat::after {
    right: 0;
  }

  .seat--variant-unavailable {
    --seat-color: var(--gray-500);
    --seat-element-color-background: var(--gray-300);
    --seat-element-color-border: var(--gray-400);
    cursor: not-allowed;
  }

  .seat--variant-selected {
    --seat-color: #19b760;
    --seat-element-color-background: #a6f7c2;
    --seat-element-color-border: #24d674;
  }

  .seat__base {
    display: grid;
    place-items: center;
    width: 2.125em;
    height: 2.5em;
    margin: 0 auto;
    border: var(--seat-element-border);
    border-radius: 0.625em;
    background-color: var(--seat-element-color-background);
    position: relative;
    padding-bottom: 0.5em;
    transition: all 0.2s ease;
  }

  .seat__base::before {
    content: "";
    z-index: 2;
    position: absolute;
    left: 0;
    width: 100%;
    height: 0.75em;
    border: var(--seat-element-border);
    background-color: var(--seat-element-color-background);
    pointer-events: none;
    bottom: 0;
    border-radius: 0.375em 0.375em 0.75em 0.75em;
  }

  .seat:hover:not(.seat--variant-unavailable):not(.seat--variant-selected) .seat__base {
    --seat-element-color-background: var(--seat-element-color-background-hover);
  }

  .row-number {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-600);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .driver-seat {
    display: grid;
    place-items: center;
    padding-bottom: 0.25rem;
    border-bottom: 0.125rem solid var(--gray-300);
    color: var(--gray-400);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
  }
`;

interface SeatSelectorProps {
  tourInfo: TourInfo;
  passengers: PassengerInfo[];
  onSeatSelect: (selection: SeatSelection) => void;
  onConfirmSelection: (selections: SeatSelection[]) => void;
  className?: string;
}

// Datos de ejemplo de asientos (esto vendría de tu API)
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const positions = ['A', 'B', 'C', 'D', 'E'] as const;
  
  for (let row = 1; row <= 12; row++) {
    positions.forEach((position) => {
      // Saltar la posición C (pasillo central)
      if (position === 'C') return;
      
      const seatNumber = `${row}${position}`;
      let type: SeatType = 'standard';
      
      // Lógica para tipos de asientos
      if (row === 1) type = 'front';
      if (row >= 10 && (position === 'A' || position === 'B')) type = 'table';
      if (Math.random() < 0.1) type = 'unavailable'; // 10% ocupados
      
      seats.push({
        id: `seat-${seatNumber}`,
        number: seatNumber,
        type,
        row,
        position,
        price: type === 'front' ? 50 : type === 'table' ? 30 : 20,
        isOccupied: type === 'unavailable'
      });
    });
  }
  
  return seats;
};

export default function SeatSelector({ 
  tourInfo, 
  passengers, 
  onSeatSelect, 
  onConfirmSelection,
  className 
}: SeatSelectorProps) {
  const [seats] = useState<Seat[]>(generateSeats);
  const [selectedSeats, setSelectedSeats] = useState<Map<string, SeatSelection>>(new Map());
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);

  const handleSeatClick = useCallback((seat: Seat) => {
    if (seat.type === 'unavailable' || seat.isOccupied) return;
    
    const currentPassenger = passengers[currentPassengerIndex];
    if (!currentPassenger) return;

    const seatKey = seat.id;
    const newSelectedSeats = new Map(selectedSeats);

    // Si el asiento ya está seleccionado, deseleccionarlo
    if (newSelectedSeats.has(seatKey)) {
      newSelectedSeats.delete(seatKey);
    } else {
      // Remover selección anterior del pasajero actual
      for (const [key, selection] of newSelectedSeats.entries()) {
        if (selection.passenger.name === currentPassenger.name) {
          newSelectedSeats.delete(key);
          break;
        }
      }

      // Agregar nueva selección
      const selection: SeatSelection = {
        seat,
        passenger: currentPassenger,
        totalPrice: tourInfo.basePrice + seat.price
      };
      
      newSelectedSeats.set(seatKey, selection);
      onSeatSelect(selection);

      // Pasar al siguiente pasajero
      if (currentPassengerIndex < passengers.length - 1) {
        setCurrentPassengerIndex(currentPassengerIndex + 1);
      }
    }

    setSelectedSeats(newSelectedSeats);
  }, [selectedSeats, passengers, currentPassengerIndex, onSeatSelect, tourInfo.basePrice]);

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.has(seat.id);
    const seatClasses = cn(
      'seat',
      `seat--variant-${isSelected ? 'selected' : seat.type}`,
      'transition-all duration-200'
    );

    return (
      <button
        key={seat.id}
        className={seatClasses}
        onClick={() => handleSeatClick(seat)}
        onMouseEnter={() => setHoveredSeat(seat)}
        onMouseLeave={() => setHoveredSeat(null)}
        disabled={seat.type === 'unavailable'}
        title={`Asiento ${seat.number} - ${seat.type === 'front' ? 'Frontal' : seat.type === 'table' ? 'Mesa' : 'Estándar'}`}
      >
        <div className="seat__base">
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
        </div>
      </button>
    );
  };

  const renderBusLayout = () => {
    const rows = Array.from({ length: 12 }, (_, i) => i + 1);
    
    return (
      <div className="bus">
        <div className="bus__layout">
          {/* Asiento del conductor */}
          <div className="driver-seat col-span-1">
            <User className="w-8 h-8" />
          </div>
          <div className="col-span-4"></div>

          {/* Filas de asientos */}
          {rows.map(row => {
            const rowSeats = seats.filter(seat => seat.row === row);
            return (
              <React.Fragment key={row}>
                {/* Número de fila */}
                <div className="row-number">{row}</div>
                
                {/* Asientos A y B */}
                {['A', 'B'].map(position => {
                  const seat = rowSeats.find(s => s.position === position);
                  return seat ? renderSeat(seat) : <div key={`${row}${position}`} />;
                })}
                
                {/* Pasillo (espacio vacío) */}
                <div></div>
                
                {/* Asientos D y E */}
                {['D', 'E'].map(position => {
                  const seat = rowSeats.find(s => s.position === position);
                  return seat ? renderSeat(seat) : <div key={`${row}${position}`} />;
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLegend = () => {
    const legendItems = [
      { type: 'standard', label: 'Estándar', price: `$${tourInfo.seatPricing.standard}`, color: 'bg-white border-gray-400' },
      { type: 'front', label: 'Frontal', price: `$${tourInfo.seatPricing.front}`, color: 'bg-white border-gray-400' },
      { type: 'table', label: 'Mesa', price: `$${tourInfo.seatPricing.table}`, color: 'bg-white border-gray-400' },
      { type: 'selected', label: 'Seleccionado', price: '', color: 'bg-green-200 border-green-500' },
      { type: 'unavailable', label: 'Ocupado', price: '', color: 'bg-gray-300 border-gray-400' },
    ];

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Leyenda</h4>
        {legendItems.map(item => (
          <div key={item.type} className="legend-item">
            <div className={cn(
              "w-6 h-6 border-2 rounded",
              item.color
            )} />
            <span className="flex-1 text-sm">{item.label}</span>
            {item.price && (
              <span className="text-sm font-medium text-gray-900">{item.price}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPassengerList = () => {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Pasajeros</h4>
        {passengers.map((passenger, index) => {
          const selection = Array.from(selectedSeats.values()).find(
            s => s.passenger.name === passenger.name
          );
          const isCurrentPassenger = index === currentPassengerIndex;
          
          return (
            <div 
              key={passenger.name}
              className={cn(
                "p-3 rounded-lg border",
                isCurrentPassenger ? "border-blue-500 bg-blue-50" : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{passenger.name}</span>
                {isCurrentPassenger && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    Seleccionando
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{passenger.type}</div>
              {selection && (
                <div className="text-sm font-medium text-green-600 mt-1">
                  Asiento {selection.seat.number}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const canConfirm = selectedSeats.size === passengers.length;
  const totalPrice = Array.from(selectedSeats.values()).reduce(
    (sum, selection) => sum + selection.totalPrice, 0
  );

  return (
    <div className={cn("bus-seat-selector", className)}>
      <style>{seatSelectorStyles}</style>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
        {/* Información del Tour */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{tourInfo.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{tourInfo.route.origin} → {tourInfo.route.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{tourInfo.schedule.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tourInfo.schedule.departure} - {tourInfo.schedule.arrival}</span>
                    </div>
                  </div>
                </div>
                {tourInfo.operator.logo && (
                  <Image 
                    src={tourInfo.operator.logo} 
                    alt={tourInfo.operator.name}
                    width={48}
                    height={48}
                    className="h-12 object-contain"
                  />
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Layout del Bus */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="bg-blue-50 p-6 rounded-xl">
            {renderBusLayout()}
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {renderPassengerList()}
          {renderLegend()}
          
          {/* Resumen y confirmación */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">${totalPrice}</span>
                </div>
                <Button 
                  onClick={() => onConfirmSelection(Array.from(selectedSeats.values()))}
                  disabled={!canConfirm}
                  className="w-full"
                  size="lg"
                >
                  Confirmar Selección ({selectedSeats.size}/{passengers.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tooltip para asiento hover */}
      {hoveredSeat && (
        <div className="fixed pointer-events-none z-50 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              {hoveredSeat.number}
            </div>
            <span className="text-sm capitalize">
              {hoveredSeat.type === 'front' ? 'Frontal' : 
               hoveredSeat.type === 'table' ? 'Mesa' : 'Estándar'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
