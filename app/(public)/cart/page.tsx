"use client"
import React from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return <div className="text-gray-500">Cargando carrito...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      {items.length === 0 ? (
        <div className="text-gray-500">Tu carrito está vacío.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white rounded shadow p-4">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">Cantidad: {item.quantity}</div>
                  <div className="text-sm text-gray-600">Precio: ${item.price.toFixed(2)}</div>
                </div>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => removeFromCart(item.id)}
              >
                Quitar
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
            <div className="text-lg font-bold">
              Total: ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </div>
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              // Aquí irá la lógica de checkout con Stripe
              onClick={() => alert('Checkout con Stripe próximamente')}
            >
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
