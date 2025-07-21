'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

import { ProductFilter, ProductCategory } from '@/types/product';

interface ProductFiltersProps {
  filters: ProductFilter;
  onFiltersChange: (filters: ProductFilter) => void;
  onClearFilters: () => void;
  categories: ProductCategory[];
  isLoading?: boolean;
}

const categoryLabels: Record<ProductCategory, string> = {
  'travel-gear': 'Equipo de Viaje',
  'camping': 'Camping & Outdoor',
  'electronics': 'Electrónicos',
  'apparel': 'Ropa & Accesorios',
  'souvenirs': 'Souvenirs',
  'survival': 'Supervivencia',
  'health': 'Salud & Bienestar',
  'food': 'Comida & Bebidas',
  'books': 'Libros & Guías',
  'accessories': 'Accesorios'
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
  isLoading = false
}) => {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'all' ? undefined : category as ProductCategory;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({ 
      ...filters, 
      minPrice: values[0], 
      maxPrice: values[1] 
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inStock: checked || undefined });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ 
      ...filters, 
      tags: newTags.length > 0 ? newTags : undefined 
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock ||
    (filters.tags && filters.tags.length > 0)
  );

  const popularTags = [
    'mochila', 'aventura', 'viaje', 'camping', 'outdoor',
    'resistente', 'portátil', 'térmico', 'solar', 'artesanal'
  ];

  const maxPrice = 5000;
  const priceRange = [
    filters.minPrice || 0,
    filters.maxPrice || maxPrice
  ];

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar productos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Mochila, camping, electrónicos..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={filters.category || 'all'} 
            onValueChange={handleCategoryChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryLabels[category] || category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de Precio */}
        <div className="space-y-3">
          <Label>Rango de Precio</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={maxPrice}
              min={0}
              step={50}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="space-y-2">
          <Label>Disponibilidad</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock || false}
              onCheckedChange={handleInStockChange}
              disabled={isLoading}
            />
            <Label htmlFor="inStock" className="text-sm">
              Solo productos en stock
            </Label>
          </div>
        </div>

        {/* Tags Populares */}
        <div className="space-y-2">
          <Label>Tags Populares</Label>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => {
              const isSelected = filters.tags?.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => !isLoading && toggleTag(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Filtros Activos */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Filtros Aplicados:</Label>
            <div className="space-y-1 text-xs text-gray-600">
              {filters.search && (
                <div>Búsqueda: &ldquo;{filters.search}&rdquo;</div>
              )}
              {filters.category && (
                <div>Categoría: {categoryLabels[filters.category]}</div>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <div>
                  Precio: ${filters.minPrice || 0} - ${filters.maxPrice || maxPrice}
                </div>
              )}
              {filters.inStock && (
                <div>Solo en stock</div>
              )}
              {filters.tags && filters.tags.length > 0 && (
                <div>Tags: {filters.tags.join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
