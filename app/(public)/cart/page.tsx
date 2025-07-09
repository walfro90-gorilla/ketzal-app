"use client"
import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, ShoppingBag, Users, User, Users2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/context/CartContext";

// Helper para obtener el icono del tipo de paquete
const getPackageIcon = (packageType: string) => {
  switch (packageType.toLowerCase()) {
    case 'individual':
    case 'single':
      return <User className="h-4 w-4" />;
    case 'doble':
    case 'double':
      return <Users2 className="h-4 w-4" />;
    case 'triple':
    case 'cuádruple':
    case 'quadruple':
      return <Users className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

// Helper para obtener el color del badge según el tipo de paquete
const getPackageColor = (packageType: string) => {
  switch (packageType.toLowerCase()) {
    case 'individual':
    case 'single':
      return 'bg-blue-100 text-blue-800';
    case 'doble':
    case 'double':
      return 'bg-green-100 text-green-800';
    case 'triple':
      return 'bg-orange-100 text-orange-800';
    case 'cuádruple':
    case 'quadruple':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper para formatear precio en pesos mexicanos
const formatMXN = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Componente para la tarjeta de servicio desplegable
const ServiceCard = ({ 
  serviceId, 
  serviceItems, 
  handleRemoveItem, 
  updateQuantity 
}: {
  serviceId: string;
  serviceItems: CartItem[];
  handleRemoveItem: (id: string, serviceName: string, packageType: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const serviceTotal = serviceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <Card key={serviceId} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          {/* Imagen del servicio */}
          <div className="flex-shrink-0">
            {serviceItems[0].imgBanner ? (
              <Image 
                src={serviceItems[0].imgBanner} 
                alt={serviceItems[0].serviceName} 
                width={120}
                height={120}
                className="w-28 h-28 object-cover rounded-lg border"
              />
            ) : serviceItems[0].image ? (
              <Image 
                src={serviceItems[0].image} 
                alt={serviceItems[0].serviceName} 
                width={120}
                height={120}
                className="w-28 h-28 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Información del servicio */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  {serviceItems[0].serviceName}
                </CardTitle>
                {serviceItems[0].service && (
                  <Badge variant="secondary" className="w-fit mb-2">
                    {serviceItems[0].service}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Contraer
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Expandir
                  </>
                )}
              </Button>
            </div>
            
            {/* Resumen del servicio */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {serviceItems.length} {serviceItems.length === 1 ? 'paquete' : 'paquetes'} • Total: {formatMXN(serviceTotal)}
              </p>
              
              {/* Vista contraída - Lista de paquetes */}
              {!isExpanded && (
                <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                  {serviceItems.map((item) => (
                    <span key={item.id} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      {getPackageIcon(item.packageType)} 
                      <span className="font-medium">{item.packageType}</span>
                      <span className="text-gray-500">(x{item.quantity})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Contenido expandible */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {isExpanded && (
          <CardContent className="space-y-4 pt-0">
            {serviceItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                      {getPackageIcon(item.packageType)}
                      {item.packageType}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPackageColor(item.packageType)}`}
                      >
                        Paquete
                      </Badge>
                    </h4>
                    {item.packageDescription && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.packageDescription}
                      </p>
                    )}
                    
                    {/* Información de disponibilidad */}
                    {item.availableQty && (
                      <p className="text-xs text-gray-500 mb-2">
                        Disponible: {item.availableQty} unidades
                      </p>
                    )}

                    {/* Precio unitario */}
                    <p className="text-sm text-gray-600 mb-3">
                      Precio unitario: <span className="font-medium">{formatMXN(item.price)}</span>
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id, item.serviceName, item.packageType)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Controles de cantidad y precio total */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        disabled={item.availableQty ? item.quantity >= item.availableQty : false}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatMXN(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </div>
    </Card>
  );
};

export default function CartPage() {
  const { items, removeFromCart, clearCart, isHydrated, updateQuantity, getGroupedItems } = useCart();

  const handleRemoveItem = (id: string, serviceName: string, packageType: string) => {
    removeFromCart(id);
    toast({
      title: "Producto eliminado",
      description: `${serviceName} (${packageType}) fue eliminado del carrito`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos fueron eliminados del carrito",
    });
  };

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        {totalItems > 0 && (
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </Badge>
        )}
      </div>

      {items.length === 0 ? (
        /* Estado vacío */
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Tu carrito está vacío</h2>
              <p className="text-gray-500">Agrega algunos productos para comenzar a comprar</p>
            </div>
            <Button 
              className="mt-6"
              onClick={() => window.history.back()}
            >
              Continuar comprando
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(getGroupedItems()).map(([serviceId, serviceItems]) => (
              <ServiceCard 
                key={serviceId}
                serviceId={serviceId}
                serviceItems={serviceItems}
                handleRemoveItem={handleRemoveItem}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Resumen del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>{formatMXN(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatMXN(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={() => alert('Checkout con Stripe próximamente')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceder al pago
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    Continuar comprando
                  </Button>
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar carrito
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
