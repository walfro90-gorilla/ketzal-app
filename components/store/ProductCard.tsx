'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Package, 
  Info,
  X
} from 'lucide-react';

import { Product } from '@/types/product';
import { PlannerCartItem, PaymentOption } from '@/types/travel-planner';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { useCart } from '@/context/CartContext';
import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  showAddToPlanner?: boolean;
}

// Función para determinar si un producto es físico o servicio
const isPhysicalProduct = (category?: string): boolean => {
  const physicalCategories = [
    'travel-gear',
    'camping', 
    'electronics',
    'apparel',
    'souvenirs',
    'survival',
    'health',
    'food',
    'books',
    'accessories'
  ];
  return physicalCategories.includes(category || '');
};

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  compact = false,
  showAddToPlanner = true 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('cash');
  const [selectedPlannerId, setSelectedPlannerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { planners } = useTravelPlanner();
  const { addToCart, createQuickPlanner } = usePlannerCart();
  const { addItem } = useCart(); // Carrito global para productos físicos
  
  const isPhysical = isPhysicalProduct(product.category);

  // Modal simple state
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getCategoryLabel = (category?: string) => {
    const categoryLabels: Record<string, string> = {
      'travel-gear': 'Equipo de Viaje',
      'camping': 'Camping',
      'electronics': 'Electrónicos',
      'apparel': 'Ropa',
      'souvenirs': 'Souvenirs',
      'survival': 'Supervivencia',
      'health': 'Salud',
      'food': 'Comida',
      'books': 'Libros',
      'accessories': 'Accesorios'
    };
    return categoryLabels[category || ''] || category || 'General';
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'travel-gear': 'bg-blue-100 text-blue-800',
      'camping': 'bg-green-100 text-green-800',
      'electronics': 'bg-purple-100 text-purple-800',
      'apparel': 'bg-pink-100 text-pink-800',
      'souvenirs': 'bg-orange-100 text-orange-800',
      'survival': 'bg-red-100 text-red-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  // Agregar al carrito global (productos físicos)
  const handleAddToGlobalCart = async () => {
    setIsLoading(true);
    try {
      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        category: product.category
      };
      
      addItem(cartItem);
      
      toast({
        title: "Producto agregado",
        description: `${product.name} agregado al carrito`,
      });
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async () => {
    console.log('🔍 handleQuickAdd iniciado', { showAddToPlanner, product });
    if (!showAddToPlanner) return;
    
    setIsLoading(true);
    try {
      console.log('📊 Estado inicial:', { 
        selectedPlannerId, 
        plannersCount: planners.length,
        planners: planners.map(p => ({ id: p.id, name: p.name }))
      });

      // Si no hay planners, crear uno rápido
      let targetPlannerId = selectedPlannerId;
      if (!targetPlannerId && planners.length === 0) {
        console.log('🆕 Creando planner rápido...');
        const quickPlannerId = await createQuickPlanner(`Compra ${product.name}`);
        console.log('✅ Planner creado:', quickPlannerId);
        if (!quickPlannerId) {
          throw new Error('No se pudo crear planner rápido');
        }
        targetPlannerId = quickPlannerId;
        
        // Esperar para que el contexto se actualice
        console.log('⏳ Esperando sincronización del contexto...');
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Si aún no hay planner seleccionado, usar el primero disponible
      if (!targetPlannerId && planners.length > 0) {
        targetPlannerId = planners[0].id;
        console.log('📌 Usando primer planner disponible:', targetPlannerId);
      }

      console.log('🎯 Target planner ID:', targetPlannerId);

      const cartItem: Omit<PlannerCartItem, 'id' | 'addedAt'> = {
        type: 'product',
        productId: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        priceAxo: product.priceAxo,
        quantity,
        paymentOption,
        category: product.category,
        image: product.image
      };

      console.log('🛒 Cart item creado:', cartItem);
      console.log('🚀 Llamando addToCart...');
      
      const success = await addToCart(cartItem, targetPlannerId);
      console.log('✅ AddToCart resultado:', success);
      
      if (success) {
        toast({
          title: "🎉 Producto agregado exitosamente",
          description: `${product.name} se agregó al planner correctamente`,
        });
        setIsDialogOpen(false);
        setIsSimpleModalOpen(false);
        setQuantity(1);
        
        // Debug de confirmación
        console.log('🎉 SUCCESS: Producto agregado al planner');
        console.log('🔄 Estados reseteados, modales cerrados');
      } else {
        throw new Error('Error agregando producto al planner');
      }
    } catch (error) {
      console.error('❌ Error en handleQuickAdd:', error);
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "No se pudo agregar el producto al planner"
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 handleQuickAdd finalizado');
    }
  };

  if (compact) {
    return (
      <>
        <Card className="h-full hover:shadow-lg transition-shadow">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-t-lg"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-2 right-2 bg-orange-500">
                ¡Últimos {product.stock}!
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                Agotado
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-green-600">{formatPrice(product.price)}</span>
              {product.priceAxo && (
                <span className="text-sm text-orange-600">{product.priceAxo} AXO</span>
              )}
            </div>
            {showAddToPlanner && (
              <div className="space-y-2">
                {isPhysical ? (
                  // Productos físicos: Botón principal para carrito + botón secundario para planner
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={product.stock === 0 || isLoading}
                      onClick={handleAddToGlobalCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Comprar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={product.stock === 0}
                      onClick={() => setIsSimpleModalOpen(true)}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  // Servicios: Solo botón de planner
                  <Button 
                    size="sm" 
                    className="w-full"
                    disabled={product.stock === 0}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Agregar a Planner
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* MODAL PLANNER COMPLETO PARA MODO COMPACT */}
        {isSimpleModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setIsSimpleModalOpen(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-blue-500 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-600">
                  Agregar {product.name} al Planner
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSimpleModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="quantity-compact">Cantidad</Label>
                  <Input
                    id="quantity-compact"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment-compact">Forma de Pago</Label>
                  <Select value={paymentOption} onValueChange={(value: PaymentOption) => setPaymentOption(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona forma de pago" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="cash">Contado</SelectItem>
                      <SelectItem value="installments">Meses sin intereses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {planners.length > 0 && (
                <div className="mb-4">
                  <Label htmlFor="planner-compact">Seleccionar Planner</Label>
                  <Select value={selectedPlannerId} onValueChange={setSelectedPlannerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un planner" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      {planners.map((planner) => (
                        <SelectItem key={planner.id} value={planner.id}>
                          {planner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-4">
                <span>Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsSimpleModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={async () => {
                    await handleQuickAdd();
                    setIsSimpleModalOpen(false);
                  }} 
                  disabled={isLoading} 
                  className="flex-1"
                >
                  {isLoading ? 'Agregando...' : 
                   planners.length === 0 ? 'Crear Planner y Agregar' : 
                   'Agregar al Planner'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL SERVICIOS PARA MODO COMPACT */}
        {isDialogOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setIsDialogOpen(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-green-500 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-green-600">
                  Agregar {product.name} al Planner
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="quantity-compact-service">Cantidad</Label>
                  <Input
                    id="quantity-compact-service"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment-compact-service">Forma de Pago</Label>
                  <Select value={paymentOption} onValueChange={(value: PaymentOption) => setPaymentOption(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona forma de pago" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="cash">Contado</SelectItem>
                      <SelectItem value="installments">Meses sin intereses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {planners.length > 0 && (
                <div className="mb-4">
                  <Label htmlFor="planner-compact-service">Seleccionar Planner</Label>
                  <Select value={selectedPlannerId} onValueChange={setSelectedPlannerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un planner" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      {planners.map((planner) => (
                        <SelectItem key={planner.id} value={planner.id}>
                          {planner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-4">
                <span>Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleQuickAdd} 
                  disabled={isLoading} 
                  className="flex-1"
                >
                  {isLoading ? 'Agregando...' : 
                   planners.length === 0 ? 'Crear Planner y Agregar' : 
                   'Agregar al Planner'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-t-lg"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-2 right-2 bg-orange-500">
                ¡Últimos {product.stock}!
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                Agotado
              </Badge>
            )}
            <div className="absolute top-2 left-2">
              <Badge className={getCategoryColor(product.category)}>
                {getCategoryLabel(product.category)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{product.name}</h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {product.description}
            </p>
          )}

          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="font-bold text-xl text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.priceAxo && (
                <div className="text-sm text-orange-600">
                  {product.priceAxo} AXO coins
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                Stock: {product.stock}
              </div>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
            >
              <Info className="h-4 w-4 mr-2" />
              Detalles
            </Button>
            {showAddToPlanner && (
              <>
                {isPhysical ? (
                  // Productos físicos: Botón principal para carrito + botón secundario para planner
                  <>
                    <Button 
                      className="flex-1"
                      disabled={product.stock === 0 || isLoading}
                      onClick={handleAddToGlobalCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar Ahora
                    </Button>
                    <Button 
                      variant="outline"
                      disabled={product.stock === 0}
                      onClick={() => setIsSimpleModalOpen(true)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Al Planner
                    </Button>
                  </>
                ) : (
                  // Servicios: Solo botón de planner
                  <>
                    <Button 
                      className="flex-1"
                      disabled={product.stock === 0}
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Agregar a Planner
                    </Button>
                    
                    {/* MODAL HTML NATIVO PARA SERVICIOS */}
                    {isDialogOpen && (
                      <div 
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                        style={{ zIndex: 99999 }}
                        onClick={() => setIsDialogOpen(false)}
                      >
                        <div 
                          className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-green-500 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-green-600">
                              Agregar {product.name} al Planner
                            </h2>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor="quantity">Cantidad</Label>
                              <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="payment">Forma de Pago</Label>
                              <Select value={paymentOption} onValueChange={(value: PaymentOption) => setPaymentOption(value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona forma de pago" />
                                </SelectTrigger>
                                <SelectContent className="z-[999999]">
                                  <SelectItem value="cash">Contado</SelectItem>
                                  <SelectItem value="installments">Meses sin intereses</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {planners.length > 0 && (
                            <div className="mb-4">
                              <Label htmlFor="planner">Seleccionar Planner</Label>
                              <Select value={selectedPlannerId} onValueChange={setSelectedPlannerId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un planner" />
                                </SelectTrigger>
                                <SelectContent className="z-[999999]">
                                  {planners.map((planner) => (
                                    <SelectItem key={planner.id} value={planner.id}>
                                      {planner.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-4">
                            <span>Total:</span>
                            <span className="font-bold text-lg">
                              {formatPrice(product.price * quantity)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                              Cancelar
                            </Button>
                            <Button onClick={handleQuickAdd} disabled={isLoading} className="flex-1">
                              {isLoading ? 'Agregando...' : 
                               planners.length === 0 ? 'Crear Planner y Agregar' : 
                               'Agregar al Planner'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* MODAL PLANNER COMPLETO PARA MODO LISTA */}
      {isSimpleModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setIsSimpleModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-blue-500 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-600">
                Agregar {product.name} al Planner
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSimpleModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="quantity-list">Cantidad</Label>
                <Input
                  id="quantity-list"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="payment-list">Forma de Pago</Label>
                <Select value={paymentOption} onValueChange={(value: PaymentOption) => setPaymentOption(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona forma de pago" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999]">
                    <SelectItem value="cash">Contado</SelectItem>
                    <SelectItem value="installments">Meses sin intereses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {planners.length > 0 && (
              <div className="mb-4">
                <Label htmlFor="planner-list">Seleccionar Planner</Label>
                <Select value={selectedPlannerId} onValueChange={setSelectedPlannerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un planner" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999]">
                    {planners.map((planner) => (
                      <SelectItem key={planner.id} value={planner.id}>
                        {planner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-4">
              <span>Total:</span>
              <span className="font-bold text-lg">
                {formatPrice(product.price * quantity)}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSimpleModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={async () => {
                  await handleQuickAdd();
                  setIsSimpleModalOpen(false);
                }} 
                disabled={isLoading} 
                className="flex-1"
              >
                {isLoading ? 'Agregando...' : 
                 planners.length === 0 ? 'Crear Planner y Agregar' : 
                 'Agregar al Planner'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
