'use client';
import React, { createContext, useContext, useState } from "react";

export type CartItem = {
  id: string;                    // serviceId + packageType para unicidad (ej: "service_123_Doble")
  serviceId: string;             // ID del servicio original
  serviceName: string;           // Nombre del servicio
  packageType: string;           // "Doble", "Triple", "Cuádruple"
  packageDescription?: string;   // Descripción del paquete
  price: number;                 // Precio del paquete
  quantity: number;
  availableQty?: number;         // Cantidad disponible del paquete
  image?: string;               // Imagen del servicio (legacy)
  imgBanner?: string;           // Imagen banner del servicio
  service?: string;             // Categoría del servicio
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
  getGroupedItems: () => { [serviceId: string]: CartItem[] };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);


  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Crear ID único: serviceId + packageType
      const uniqueId = `${item.serviceId}_${item.packageType}`;
      const itemWithUniqueId = { ...item, id: uniqueId };
      
      const found = prev.find((i) => i.id === uniqueId);
      if (found) {
        // Si ya existe, incrementar cantidad
        return prev.map((i) =>
          i.id === uniqueId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      // Si no existe, agregar nuevo item
      return [...prev, itemWithUniqueId];
    });
  };

  const removeFromCart = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Función para agrupar items por servicio
  const getGroupedItems = () => {
    return items.reduce((acc, item) => {
      const serviceId = item.serviceId;
      if (!acc[serviceId]) {
        acc[serviceId] = [];
      }
      acc[serviceId].push(item);
      return acc;
    }, {} as { [serviceId: string]: CartItem[] });
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getGroupedItems, isHydrated: true }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}