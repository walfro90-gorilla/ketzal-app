'use client';
import React, { createContext, useContext, useState, useEffect } from "react";

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
  addItem: (item: { id: string; name: string; price: number; image?: string; quantity: number; category?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
  getGroupedItems: () => { [serviceId: string]: CartItem[] };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Clave para localStorage
const CART_STORAGE_KEY = 'ketzal-cart';

// Funciones auxiliares para localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    // console.log('🛒 Carrito cargado desde localStorage:', savedItems);
    setItems(savedItems);
    setIsHydrated(true);
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (isHydrated) {
      // console.log('💾 Guardando carrito en localStorage:', items);
      saveCartToStorage(items);
    }
  }, [items, isHydrated]);


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

  // Función simplificada para productos físicos
  const addItem = (item: { id: string; name: string; price: number; image?: string; quantity: number; category?: string }) => {
    setItems((prev) => {
      const cartItem: CartItem = {
        id: item.id,
        serviceId: item.id,
        serviceName: item.name,
        packageType: 'product', // Tipo especial para productos físicos
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        service: item.category || 'product'
      };
      
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        // Si ya existe, incrementar cantidad
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      // Si no existe, agregar nuevo item
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  
  const clearCart = () => {
    setItems([]);
    // Limpiar también el localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

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
    <CartContext.Provider value={{ items, addToCart, addItem, removeFromCart, updateQuantity, clearCart, getGroupedItems, isHydrated }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}