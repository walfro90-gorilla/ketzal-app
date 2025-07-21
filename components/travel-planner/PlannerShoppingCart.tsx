'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { ShoppingCart, Plus, Minus, Trash2, Package, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlannerShoppingCartProps {
  plannerId: string;
  className?: string;
  onTotalChange?: (total: number) => void;
}

const PlannerShoppingCart: React.FC<PlannerShoppingCartProps> = ({ 
  plannerId, 
  className,
  onTotalChange 
}) => {
  const { 
    activeCart, 
    removeFromCart, 
    updateQuantity, 
    updatePaymentOption,
    getCartItemCount,
    setActivePlanner
  } = usePlannerCart();

  // Establecer el planner activo cuando el componente se monta
  useEffect(() => {
    if (plannerId) {
      setActivePlanner(plannerId);
    }
  }, [plannerId, setActivePlanner]);

  // Reportar el total al componente padre cuando cambie
  useEffect(() => {
    if (onTotalChange && activeCart && activeCart.plannerId === plannerId) {
      onTotalChange(activeCart.total || 0);
    }
  }, [activeCart, plannerId, onTotalChange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId, plannerId);
    } else {
      await updateQuantity(itemId, newQuantity, plannerId);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId, plannerId);
  };

  const handlePaymentOptionChange = async (itemId: string, paymentOption: 'cash' | 'installments') => {
    await updatePaymentOption(itemId, paymentOption, plannerId);
  };

  if (!activeCart || activeCart.plannerId !== plannerId || activeCart.items.length === 0) {
    return (
      <Card className={cn("h-fit", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Carrito vacío
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Agrega productos y servicios sin fecha específica
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Explorar Productos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras
          </CardTitle>
          <Badge variant="secondary">
            {getCartItemCount(plannerId)} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {activeCart.items.map((item) => (
            <Card key={item.id} className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Item Image */}
                  {item.image && (
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  
                  {/* Item Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.category && (
                          <Badge variant="outline" className="mt-2">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {formatPrice(item.price)} c/u
                        </div>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pago:</span>
                      <div className="flex gap-2">
                        <Button
                          variant={item.paymentOption === 'cash' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePaymentOptionChange(item.id, 'cash')}
                          className={cn(
                            "text-xs",
                            item.paymentOption === 'cash' && "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          💵 Contado
                        </Button>
                        <Button
                          variant={item.paymentOption === 'installments' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePaymentOptionChange(item.id, 'installments')}
                          className={cn(
                            "text-xs",
                            item.paymentOption === 'installments' && "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Cuotas
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Nota:</strong> {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span>{formatPrice(activeCart.subtotal)}</span>
              </div>
              {activeCart.taxes > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Impuestos:</span>
                  <span>{formatPrice(activeCart.taxes)}</span>
                </div>
              )}
              {activeCart.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>-{formatPrice(activeCart.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between font-bold text-lg text-emerald-600">
                  <span>Total:</span>
                  <span>{formatPrice(activeCart.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                💳 Proceder al Pago
              </Button>
              <Button variant="outline" className="w-full">
                📝 Agregar Nota al Carrito
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PlannerShoppingCart;
