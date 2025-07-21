"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Monitor,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { BusLayout, SeatPricing } from '@/types/seat-selector';

interface SimpleSeatSelectorProps {
  busLayout: BusLayout;
  seatPricing: SeatPricing;
  passengers: number;
  onSeatsSelected: (seats: string[]) => void;
  selectedSeats?: string[];
}

interface SeatInfo {
  id: string;
  type: 'standard' | 'front' | 'table';
  price: number;
  row: number;
  column: string;
  isSelected: boolean;
  isOccupied: boolean;
}

export default function SimpleSeatSelector({
  busLayout,
  seatPricing,
  passengers,
  onSeatsSelected,
  selectedSeats = []
}: SimpleSeatSelectorProps) {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(selectedSeats);

  // Generar información de asientos
  const generateSeats = (): SeatInfo[] => {
    const seats: SeatInfo[] = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, busLayout.seatsPerRow);
    
    for (let row = 1; row <= busLayout.totalRows; row++) {
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        const seatId = `${row}${column}`;
        
        // Determinar tipo de asiento
        let seatType: 'standard' | 'front' | 'table' = 'standard';
        if (row <= 3) seatType = 'front';
        if (busLayout.exitRows?.includes(row)) seatType = 'table';
        
        seats.push({
          id: seatId,
          type: seatType,
          price: seatPricing[seatType] || 0,
          row,
          column,
          isSelected: selectedSeatIds.includes(seatId),
          isOccupied: Math.random() < 0.3 // 30% ocupación aleatoria
        });
      }
    }
    
    return seats;
  };

  const seats = generateSeats();

  // Manejar selección de asientos
  const handleSeatClick = (seatId: string) => {
    if (seats.find(s => s.id === seatId)?.isOccupied) return;
    
    let newSelected: string[];
    
    if (selectedSeatIds.includes(seatId)) {
      newSelected = selectedSeatIds.filter(id => id !== seatId);
    } else {
      if (selectedSeatIds.length >= passengers) {
        // Reemplazar el primer asiento seleccionado
        newSelected = [...selectedSeatIds.slice(1), seatId];
      } else {
        newSelected = [...selectedSeatIds, seatId];
      }
    }
    
    setSelectedSeatIds(newSelected);
    onSeatsSelected(newSelected);
  };

  // Calcular precio total
  const totalPrice = selectedSeatIds.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);

  // Obtener color del asiento
  const getSeatColor = (seat: SeatInfo) => {
    if (seat.isOccupied) return 'bg-gray-400 cursor-not-allowed';
    if (seat.isSelected) return 'bg-blue-500 border-blue-600 text-white';
    
    switch (seat.type) {
      case 'front': return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'table': return 'bg-purple-100 border-purple-300 hover:bg-purple-200';
      default: return 'bg-white border-gray-300 hover:bg-gray-50';
    }
  };

  // Organizar asientos en filas
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, SeatInfo[]>);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <span>Selector de Asientos</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{selectedSeatIds.length}/{passengers} pasajeros</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información de selección */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Asientos seleccionados:
            </span>
            
            {selectedSeatIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSeatIds.map(seatId => (
                  <Badge key={seatId} variant="default">
                    {seatId}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">
                Ninguno
              </span>
            )}
          </div>
          
          {totalPrice > 0 && (
            <Badge variant="secondary" className="text-sm font-medium">
              Costo adicional: +${totalPrice}
            </Badge>
          )}
        </div>

        {/* Indicador del frente del bus */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            Frente del bus
          </div>
        </div>

        {/* Layout del bus */}
        <div className="relative bg-gray-50 border-2 border-gray-300 rounded-2xl p-6">
          <div className="space-y-3">
            {Object.entries(seatsByRow)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([rowNum, rowSeats]) => (
                <div key={rowNum} className="flex items-center gap-4">
                  {/* Número de fila */}
                  <div className="w-8 text-center text-sm font-medium text-gray-600">
                    {rowNum}
                  </div>
                  
                  {/* Asientos de la izquierda */}
                  <div className="flex gap-2">
                    {rowSeats
                      .filter((_, index) => index < Math.ceil(busLayout.seatsPerRow / 2))
                      .map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.isOccupied}
                          className={`
                            w-12 h-12 border-2 rounded-lg
                            flex items-center justify-center
                            ${getSeatColor(seat)}
                            ${seat.isSelected ? 'ring-2 ring-blue-300' : ''}
                            transition-all duration-200
                            disabled:cursor-not-allowed disabled:opacity-50
                          `}
                        >
                          <span className="text-xs font-medium">
                            {seat.id}
                          </span>
                        </button>
                      ))}
                  </div>
                  
                  {/* Pasillo */}
                  <div className="w-8 border-l border-r border-dashed border-gray-300 h-8"></div>
                  
                  {/* Asientos de la derecha */}
                  <div className="flex gap-2">
                    {rowSeats
                      .filter((_, index) => index >= Math.ceil(busLayout.seatsPerRow / 2))
                      .map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.isOccupied}
                          className={`
                            w-12 h-12 border-2 rounded-lg
                            flex items-center justify-center
                            ${getSeatColor(seat)}
                            ${seat.isSelected ? 'ring-2 ring-blue-300' : ''}
                            transition-all duration-200
                            disabled:cursor-not-allowed disabled:opacity-50
                          `}
                        >
                          <span className="text-xs font-medium">
                            {seat.id}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
            <span>Premium (+${seatPricing.front})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Mesa (+${seatPricing.table})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
            <span>Estándar (+${seatPricing.standard})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span>Ocupado</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedSeatIds([]);
              onSeatsSelected([]);
            }}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar selección
          </Button>
          
          <Button
            disabled={selectedSeatIds.length !== passengers}
            className="flex-1 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmar asientos ({selectedSeatIds.length}/{passengers})
          </Button>
        </div>
        
        {selectedSeatIds.length !== passengers && (
          <p className="text-sm text-center text-gray-500">
            {selectedSeatIds.length < passengers 
              ? `Selecciona ${passengers - selectedSeatIds.length} asiento(s) más para continuar`
              : `Has seleccionado demasiados asientos. Límite: ${passengers}`
            }
          </p>
        )}
      </CardContent>
    </Card>
  );
}
