"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye,
  Smartphone,
  Monitor,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { BusLayout, SeatPricing } from '@/types/seat-selector';

interface MobileSeatSelectorProps {
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

export default function MobileSeatSelector({
  busLayout,
  seatPricing,
  passengers,
  onSeatsSelected,
  selectedSeats = []
}: MobileSeatSelectorProps) {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(selectedSeats);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  
  // Configuración responsive
  const seatsPerPage = isExpanded ? 16 : 8;
  const seatSize = isExpanded ? 'w-12 h-12' : 'w-10 h-10';
  const seatTextSize = isExpanded ? 'text-xs' : 'text-[10px]';

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
  const totalPages = Math.ceil(seats.length / seatsPerPage);
  const currentSeats = seats.slice(currentPage * seatsPerPage, (currentPage + 1) * seatsPerPage);

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
    if (seat.isOccupied) return 'bg-gray-400';
    if (seat.isSelected) return 'bg-blue-500 border-blue-600';
    
    switch (seat.type) {
      case 'front': return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'table': return 'bg-purple-100 border-purple-300 hover:bg-purple-200';
      default: return 'bg-white border-gray-300 hover:bg-gray-50';
    }
  };

  return (
    <div className="bg-white">
      {/* Header compacto */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-sm">Selector de Asientos</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            className="p-2"
          >
            {viewMode === 'compact' ? <Eye className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Información de selección */}
      <div className="p-3 bg-blue-50 border-b">
        <div className="flex items-center justify-between text-sm">
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            {selectedSeatIds.length}/{passengers} pasajeros
          </span>
          
          {totalPrice > 0 && (
            <Badge variant="secondary" className="font-medium">
              +${totalPrice}
            </Badge>
          )}
        </div>
        
        {selectedSeatIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedSeatIds.map(seatId => (
              <Badge key={seatId} variant="default" className="text-xs">
                {seatId}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Selector de asientos */}
      <div className="p-4">
        {/* Indicador del frente del bus */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            Frente del bus
          </div>
        </div>

        {/* Grid de asientos */}
        <div className={`grid gap-2 mb-4 ${
          isExpanded 
            ? 'grid-cols-4' 
            : busLayout.seatsPerRow === 4 
              ? 'grid-cols-2' 
              : 'grid-cols-3'
        }`}>
          {currentSeats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              disabled={seat.isOccupied}
              className={`
                ${seatSize} 
                border-2 rounded-lg 
                flex items-center justify-center
                ${getSeatColor(seat)}
                ${seat.isSelected ? 'ring-2 ring-blue-300' : ''}
                transition-all duration-200
                touch-manipulation
                ${seat.isOccupied ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span className={`${seatTextSize} font-medium ${
                seat.isSelected ? 'text-white' : 
                seat.isOccupied ? 'text-gray-500' : 'text-gray-700'
              }`}>
                {seat.id}
              </span>
            </button>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <span className="text-sm text-gray-600">
              {currentPage + 1} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-1"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Leyenda móvil */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Premium (+${seatPricing.front})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Mesa (+${seatPricing.table})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Estándar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSeatIds([]);
              onSeatsSelected([]);
            }}
            className="flex-1 flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </Button>
          
          <Button
            size="sm"
            disabled={selectedSeatIds.length !== passengers}
            className="flex-1"
          >
            Confirmar ({selectedSeatIds.length}/{passengers})
          </Button>
        </div>
        
        {selectedSeatIds.length !== passengers && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {selectedSeatIds.length < passengers 
              ? `Selecciona ${passengers - selectedSeatIds.length} asiento(s) más`
              : `Demasiados asientos seleccionados`
            }
          </p>
        )}
      </div>
    </div>
  );
}
