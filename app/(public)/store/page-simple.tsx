'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Store, 
  ShoppingBag, 
  Grid, 
  List, 
  Loader2,
  Search,
  Package
} from 'lucide-react';

import { Product } from '@/types/product';
import ProductCard from '@/components/store/ProductCard';
import Footer from '@/components/Footer';

// Datos temporales de productos mientras arreglamos la API
const TEMP_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mochila Trekking Pro",
    description: "Mochila profesional de 45L para trekkings largos, resistente al agua con múltiples compartimentos.",
    price: 89.99,
    category: 'travel-gear',
    stock: 15,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1543116153-7e33231c54b8?w=500"
    ],
    tags: ["outdoor", "trekking", "resistente"],
    specifications: {
      "Capacidad": "45 litros",
      "Material": "Nylon 420D",
      "Peso": "1.8 kg",
      "Resistencia al agua": "Sí"
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: 2,
    name: "Carpa 3 Personas",
    description: "Carpa ultraliviana para 3 personas, fácil de armar y resistente a vientos fuertes.",
    price: 145.50,
    category: 'camping',
    stock: 8,
    image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=500",
    images: [
      "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=500",
      "https://images.unsplash.com/photo-1537565266759-d30edc1aae38?w=500"
    ],
    tags: ["camping", "ultraliviana", "3-personas"],
    specifications: {
      "Capacidad": "3 personas",
      "Peso": "2.1 kg",
      "Dimensiones": "210x180x115 cm",
      "Material": "Poliéster ripstop"
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: 3,
    name: "Tabla de Surf Principiante",
    description: "Tabla de surf ideal para principiantes, foam suave y estable para un aprendizaje seguro.",
    price: 199.99,
    category: 'accessories',
    stock: 5,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500"
    ],
    tags: ["surf", "principiante", "foam"],
    specifications: {
      "Longitud": "9'0\"",
      "Ancho": "22.5\"",
      "Grosor": "3.25\"",
      "Material": "Foam EVA"
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: 4,
    name: "Kit Primeros Auxilios",
    description: "Kit completo de primeros auxilios para aventuras outdoor, compacto y completo.",
    price: 34.99,
    category: 'survival',
    stock: 25,
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500",
    images: [
      "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500",
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500"
    ],
    tags: ["seguridad", "primeros-auxilios", "outdoor"],
    specifications: {
      "Piezas": "150+ elementos",
      "Peso": "680g",
      "Certificación": "FDA aprobado",
      "Incluye": "Manual de primeros auxilios"
    },
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: 5,
    name: "Cámara Acuática GoPro",
    description: "Cámara de acción resistente al agua hasta 10m, perfecta para deportes extremos.",
    price: 299.99,
    category: 'electronics',
    stock: 12,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
      "https://images.unsplash.com/photo-1502780402662-acc01917738e?w=500"
    ],
    tags: ["cámara", "acuática", "deportes-extremos"],
    specifications: {
      "Resolución": "4K 60fps",
      "Resistencia": "10m sin carcasa",
      "Batería": "1720mAh",
      "Conectividad": "WiFi, Bluetooth"
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  },
  {
    id: 6,
    name: "Linterna LED Táctica",
    description: "Linterna táctica de alta potencia, resistente al agua y con zoom ajustable.",
    price: 49.99,
    category: 'electronics',
    stock: 30,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    tags: ["linterna", "táctica", "LED"],
    specifications: {
      "Lúmenes": "2000 lm",
      "Alcance": "300 metros",
      "Batería": "Recargable USB-C",
      "Modos": "5 modos de iluminación"
    },
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20")
  }
];

type ViewMode = 'grid' | 'list';

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [quickSearch, setQuickSearch] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(TEMP_PRODUCTS);
        setFilteredProducts(TEMP_PRODUCTS);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando productos');
        console.error('Error loading store data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = [...products];

    // Aplicar búsqueda rápida
    if (quickSearch) {
      const searchLower = quickSearch.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredProducts(filtered);
  }, [products, quickSearch]);

  const handleClearFilters = () => {
    setQuickSearch('');
  };

  const getProductsInStock = () => {
    return filteredProducts.filter(product => product.stock > 0).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tienda Ketzal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error cargando la tienda</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la Tienda */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tienda Ketzal</h1>
                <p className="text-gray-600">Equipo esencial para tus aventuras</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                {filteredProducts.length} productos
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {getProductsInStock()} en stock
              </Badge>
            </div>
          </div>

          {/* Búsqueda Rápida */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Simplificado */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {filteredProducts.length} productos encontrados
                    </p>
                    {quickSearch && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        Limpiar búsqueda
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {/* Controles de Vista */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} productos encontrados
                </span>
              </div>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid de Productos */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta modificar tu búsqueda
                  </p>
                  <Button onClick={handleClearFilters}>
                    Ver todos los productos
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    compact={viewMode === 'grid'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
