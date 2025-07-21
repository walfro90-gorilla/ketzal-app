// Tipos para el selector de asientos de tours

export type SeatType = 'standard' | 'front' | 'table' | 'unavailable' | 'selected';

export interface Seat {
  id: string;
  number: string;
  type: SeatType;
  row: number;
  position: 'A' | 'B' | 'C' | 'D' | 'E';
  isRotated?: boolean;
  price: number;
  isOccupied?: boolean;
}

export interface SeatPricing {
  standard: number;
  front: number;
  table: number;
}

export interface BusLayout {
  totalRows: number;
  seatsPerRow: number;
  aislePositions: string[]; // e.g., ['C'] for center aisle
  exitRows?: number[];
  customSeats?: {
    row: number;
    position: string;
    type: SeatType;
    unavailable?: boolean;
  }[];
}

export interface TourInfo {
  id: string;
  name: string;
  route: {
    origin: string;
    destination: string;
  };
  schedule: {
    departure: string;
    arrival: string;
    date: string;
  };
  operator: {
    name: string;
    logo?: string;
  };
  basePrice: number;
  seatPricing: SeatPricing;
  busLayout?: BusLayout;
}

export interface PassengerInfo {
  name: string;
  type: 'Adult' | 'Child' | 'Senior';
  selectedSeat?: Seat;
}

export interface SeatSelection {
  seat: Seat;
  passenger: PassengerInfo;
  totalPrice: number;
}

// Nuevos tipos para la base de datos
export interface ServiceWithBusTransport {
  id: number;
  name: string;
  description?: string;
  hasBusTransport?: boolean;
  busLayout?: BusLayout;
  seatPricing?: SeatPricing;
  transportProviderID?: number;
  includes?: string[];
  // ... otros campos del servicio
}
