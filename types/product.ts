// Product Types for Ketzal Store

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  priceAxo?: number;
  stock: number;
  image: string;
  category?: string;
  images?: string[];
  specifications?: ProductSpecifications;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSpecifications {
  weight?: string;
  dimensions?: string;
  material?: string;
  capacity?: string;
  features?: string[];
  [key: string]: string | string[] | undefined; // Para especificaciones adicionales
}

export type ProductCategory = 
  | 'travel-gear'    // Equipo de viaje
  | 'camping'        // Camping y outdoor
  | 'electronics'    // Electrónicos
  | 'apparel'        // Ropa y accesorios
  | 'souvenirs'      // Souvenirs y recuerdos
  | 'survival'       // Equipo de supervivencia
  | 'health'         // Salud y bienestar
  | 'food'           // Comida y bebidas
  | 'books'          // Libros y guías
  | 'accessories';   // Accesorios varios

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

export interface ProductCartItem {
  productId: number;
  product: Product;
  quantity: number;
  selectedSpecifications?: Record<string, string | number>;
  personalizations?: Record<string, string>;
}

// Para integración con travel planner
export interface ProductToPlannerRequest {
  productId: number;
  quantity: number;
  plannerId?: string;
  paymentOption: 'cash' | 'installments';
  installments?: number;
  notes?: string;
}
