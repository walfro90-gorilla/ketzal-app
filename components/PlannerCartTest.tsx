'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, CreditCard, Clock } from 'lucide-react';

import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { usePlannerCart } from '@/context/PlannerCartContext';
import { PlannerCartItem } from '@/types/travel-planner';

export default function PlannerCartTest() {
  const { planners } = useTravelPlanner();
  const { 
    addToCart, 
    getCartTotal, 
    getCartItemCount, 
    createQuickPlanner,
    setActivePlanner,
    activePlannerId,
    activeCart
  } = usePlannerCart();
  
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testCreateQuickPlanner = async () => {
    addTestResult('🧪 Creando planner rápido...');
    const plannerId = await createQuickPlanner('Test Compra Rápida');
    if (plannerId) {
      addTestResult(`✅ Planner rápido creado: ${plannerId}`);
    } else {
      addTestResult('❌ Error creando planner rápido');
    }
  };

  const testAddProduct = async () => {
    if (!activePlannerId) {
      addTestResult('❌ No hay planner activo');
      return;
    }

    const testProduct: Omit<PlannerCartItem, 'id' | 'addedAt'> = {
      type: 'product',
      productId: '1',
      name: 'Mochila de Aventura Ketzal Pro',
      description: 'Mochila de alta calidad diseñada para aventureros',
      price: 1299.99,
      priceAxo: 65.00,
      quantity: 1,
      paymentOption: 'cash',
      category: 'travel-gear',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    };

    addTestResult('🧪 Agregando producto al carrito...');
    const success = await addToCart(testProduct, activePlannerId);
    if (success) {
      addTestResult('✅ Producto agregado exitosamente');
    } else {
      addTestResult('❌ Error agregando producto');
    }
  };

  const testAddTour = async () => {
    if (!activePlannerId) {
      addTestResult('❌ No hay planner activo');
      return;
    }

    const testTour: Omit<PlannerCartItem, 'id' | 'addedAt'> = {
      type: 'tour',
      serviceId: '123',
      name: 'Tour Arqueológico Monte Albán',
      description: 'Explora las ruinas zapotecas más importantes',
      price: 850.00,
      quantity: 2,
      paymentOption: 'installments',
      packageType: 'Doble',
      scheduledDate: new Date('2024-03-15'),
      image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=500'
    };

    addTestResult('🧪 Agregando tour al carrito...');
    const success = await addToCart(testTour, activePlannerId);
    if (success) {
      addTestResult('✅ Tour agregado exitosamente');
    } else {
      addTestResult('❌ Error agregando tour');
    }
  };

  const migratePlanners = () => {
    addTestResult('🔄 Migrando planners existentes...');
    
    // Esta función debería ejecutarse automáticamente al detectar planners sin carrito
    // Por ahora solo reportamos el estado
    const plannersWithoutCart = planners.filter(p => !p.cart);
    addTestResult(`📊 Planners sin carrito: ${plannersWithoutCart.length}`);
    addTestResult(`📊 Planners con carrito: ${planners.filter(p => p.cart).length}`);
  };

  useEffect(() => {
    migratePlanners();
  }, [planners]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Test: Sistema de Carrito por Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controles de Test */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={testCreateQuickPlanner} className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Crear Planner Rápido
            </Button>
            <Button onClick={testAddProduct} className="w-full" disabled={!activePlannerId}>
              <CreditCard className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
            <Button onClick={testAddTour} className="w-full" disabled={!activePlannerId}>
              <Clock className="h-4 w-4 mr-2" />
              Agregar Tour
            </Button>
          </div>

          {/* Estado Actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Planner Activo</Badge>
              <p className="text-sm font-mono">
                {activePlannerId ? activePlannerId.slice(-8) : 'Ninguno'}
              </p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Items en Carrito</Badge>
              <p className="text-lg font-bold">{getCartItemCount()}</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Total Carrito</Badge>
              <p className="text-lg font-bold">${getCartTotal().toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Planners */}
      <Card>
        <CardHeader>
          <CardTitle>Planners Disponibles ({planners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planners.map((planner) => (
              <Card 
                key={planner.id} 
                className={`cursor-pointer border-2 ${activePlannerId === planner.id ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setActivePlanner(planner.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{planner.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Items:</span>
                    <span>{planner.cart?.items.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Total:</span>
                    <span>${planner.cart?.total.toFixed(2) || '0.00'}</span>
                  </div>
                  <Badge variant={planner.cart ? 'default' : 'destructive'} className="text-xs">
                    {planner.cart ? 'Con Carrito' : 'Sin Carrito'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Carrito Activo */}
      {activeCart && (
        <Card>
          <CardHeader>
            <CardTitle>Carrito Activo</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCart.items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Carrito vacío</p>
            ) : (
              <div className="space-y-3">
                {activeCart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.type} • Qty: {item.quantity} • {item.paymentOption}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      {item.priceAxo && (
                        <p className="text-sm text-orange-600">{item.priceAxo} AXO</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${activeCart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos:</span>
                    <span>${activeCart.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${activeCart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Log de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Pruebas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p>No hay resultados aún. Ejecuta algunas pruebas...</p>
            ) : (
              testResults.map((result, index) => (
                <p key={index}>{result}</p>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
