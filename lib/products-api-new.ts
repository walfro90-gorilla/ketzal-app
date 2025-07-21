// API client for Products
import { Product, ProductFilter, ProductCategory } from '@/types/product';

// Datos de prueba mientras no esté disponible el backend
const MOCK_PRODUCTS: Product[] = [
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
  },
  {
    id: 7,
    name: "Repelente Natural",
    description: "Repelente de insectos natural con aceites esenciales, libre de DEET.",
    price: 12.99,
    category: 'health',
    stock: 40,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500"
    ],
    tags: ["repelente", "natural", "aceites-esenciales"],
    specifications: {
      "Volumen": "100ml",
      "Ingredientes": "Aceites naturales",
      "Protección": "8 horas",
      "Libre de": "DEET, parabenos"
    },
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  },
  {
    id: 8,
    name: "Bloqueador Solar SPF 50+",
    description: "Protector solar de amplio espectro, resistente al agua y de larga duración.",
    price: 18.99,
    category: 'health',
    stock: 35,
    image: "https://images.unsplash.com/photo-1556909114-9f2fdf8b6a52?w=500",
    images: [
      "https://images.unsplash.com/photo-1556909114-9f2fdf8b6a52?w=500",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
    ],
    tags: ["bloqueador", "SPF50", "resistente-agua"],
    specifications: {
      "SPF": "50+",
      "Volumen": "150ml",
      "Resistencia": "80 minutos en agua",
      "Tipo": "Amplio espectro UVA/UVB"
    },
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05")
  }
];

// Funciones de API simples
export const getAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 100);
  });
};

export const getProductById = async (id: number): Promise<Product> => {
  const products = await getAllProducts();
  const product = products.find(p => p.id === id);
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  return product;
};

export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  const products = await getAllProducts();
  return products.filter(p => p.category === category);
};

export const searchProducts = async (query: string, category?: ProductCategory): Promise<Product[]> => {
  const products = await getAllProducts();
  const searchLower = query.toLowerCase();
  
  return products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchLower) ||
                        product.description?.toLowerCase().includes(searchLower) ||
                        product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    
    const matchesCategory = !category || product.category === category;
    
    return matchesQuery && matchesCategory;
  });
};

export const filterProducts = async (filters: ProductFilter): Promise<Product[]> => {
  let products = await getAllProducts();

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.category) {
    products = products.filter(p => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.inStock) {
    products = products.filter(p => p.stock > 0);
  }

  if (filters.tags && filters.tags.length > 0) {
    products = products.filter(product =>
      filters.tags!.some(tag => product.tags?.includes(tag))
    );
  }

  return products;
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  const products = await getAllProducts();
  const categories = new Set<ProductCategory>();
  
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  
  return Array.from(categories);
};

export const getRelatedProducts = async (productId: number, limit: number = 4): Promise<Product[]> => {
  const product = await getProductById(productId);
  const allProducts = await getAllProducts();
  
  const related = allProducts
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
  
  return related;
};

export const checkStock = async (productId: number, quantity: number): Promise<boolean> => {
  const product = await getProductById(productId);
  return product.stock >= quantity;
};

// Hook personalizado para productos
export const useProducts = () => {
  return {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    filterProducts,
    getCategories,
    getRelatedProducts,
    checkStock,
  };
};
