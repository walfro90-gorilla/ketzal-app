"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bus, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  DollarSign,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { BusLayout, SeatPricing, ServiceWithBusTransport } from '@/types/seat-selector';

interface BusTransportAdminProps {
  serviceId: number;
  initialData?: ServiceWithBusTransport;
  onSave?: (data: Partial<ServiceWithBusTransport>) => Promise<boolean>;
}

export default function BusTransportAdmin({ 
  serviceId, 
  initialData,
  onSave 
}: BusTransportAdminProps) {
  const [isLoading, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<ServiceWithBusTransport>>({
    hasBusTransport: initialData?.hasBusTransport || false,
    busLayout: initialData?.busLayout || {
      totalRows: 12,
      seatsPerRow: 4,
      aislePositions: ['C'],
      exitRows: [6, 12],
      customSeats: []
    },
    seatPricing: initialData?.seatPricing || {
      standard: 0,
      front: 25,
      table: 15
    }
  });

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch(`/api/admin/services/${serviceId}/bus-transport`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasBusTransport: formData.hasBusTransport,
          busLayout: formData.busLayout,
          seatPricing: formData.seatPricing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la configuración');
      }

      const result = await response.json();
      
      // Llamar al callback externo si existe
      if (onSave) {
        const success = await onSave(formData);
        if (!success) {
          throw new Error('Error en el callback de guardado');
        }
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      console.log('Configuración guardada exitosamente:', result);
      
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      // Aquí podrías mostrar un toast o notificación de error
      alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const updateBusLayout = (updates: Partial<BusLayout>) => {
    setFormData(prev => ({
      ...prev,
      busLayout: { ...prev.busLayout!, ...updates }
    }));
  };

  const updateSeatPricing = (updates: Partial<SeatPricing>) => {
    setFormData(prev => ({
      ...prev,
      seatPricing: { ...prev.seatPricing!, ...updates }
    }));
  };

  const generatePreviewSeats = () => {
    const seats = [];
    const layout = formData.busLayout!;
    
    for (let row = 1; row <= layout.totalRows; row++) {
      const positions = ['A', 'B', 'D', 'E']; // Excluding 'C' (aisle)
      
      positions.forEach(position => {
        let type: 'standard' | 'front' | 'table' = 'standard';
        
        if (row === 1) type = 'front';
        if (row >= layout.totalRows - 2 && (position === 'A' || position === 'B')) {
          type = 'table';
        }
        
        seats.push({
          row,
          position,
          type,
          number: `${row}${position}`
        });
      });
    }
    
    return seats;
  };

  const previewSeats = generatePreviewSeats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bus className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Configuración de Transporte en Bus</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Servicio ID: {serviceId} - Gestiona el selector de asientos
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={formData.hasBusTransport ? "default" : "secondary"}>
                {formData.hasBusTransport ? "Activo" : "Inactivo"}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? "Ocultar" : "Vista Previa"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="bus-transport"
              checked={formData.hasBusTransport}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, hasBusTransport: checked }))
              }
            />
            <Label htmlFor="bus-transport" className="text-sm font-medium">
              Habilitar selector de asientos para este servicio
            </Label>
          </div>
          
          {!formData.hasBusTransport && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  El selector de asientos está deshabilitado. Los usuarios verán el botón tradicional.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración del Bus Layout */}
      {formData.hasBusTransport && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración del Bus
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total-rows" className="text-sm font-medium">
                    Número de filas
                  </Label>
                  <Input
                    id="total-rows"
                    type="number"
                    min="8"
                    max="20"
                    value={formData.busLayout?.totalRows || 12}
                    onChange={(e) => updateBusLayout({ totalRows: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seats-per-row" className="text-sm font-medium">
                    Asientos por fila
                  </Label>
                  <Input
                    id="seats-per-row"
                    type="number"
                    min="3"
                    max="6"
                    value={formData.busLayout?.seatsPerRow || 4}
                    onChange={(e) => updateBusLayout({ seatsPerRow: parseInt(e.target.value) })}
                    className="mt-1"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Actualmente fijo en 4 asientos</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Filas de emergencia</Label>
                <Input
                  placeholder="Ej: 6,12"
                  value={formData.busLayout?.exitRows?.join(',') || '6,12'}
                  onChange={(e) => {
                    const rows = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                    updateBusLayout({ exitRows: rows });
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separar con comas. Estas filas tendrán más espacio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Precios por Tipo de Asiento
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="standard-price" className="text-sm font-medium">
                  Asientos estándar (costo adicional)
                </Label>
                <Input
                  id="standard-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.seatPricing?.standard || 0}
                  onChange={(e) => updateSeatPricing({ standard: parseFloat(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">$0 = Sin costo adicional</p>
              </div>

              <div>
                <Label htmlFor="front-price" className="text-sm font-medium">
                  Asientos frontales (costo adicional)
                </Label>
                <Input
                  id="front-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.seatPricing?.front || 25}
                  onChange={(e) => updateSeatPricing({ front: parseFloat(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Primera fila - Mejor vista</p>
              </div>

              <div>
                <Label htmlFor="table-price" className="text-sm font-medium">
                  Asientos con mesa (costo adicional)
                </Label>
                <Input
                  id="table-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.seatPricing?.table || 15}
                  onChange={(e) => updateSeatPricing({ table: parseFloat(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Últimas 2 filas - Con mesa</p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen de precios:</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <div className="flex justify-between">
                    <span>• Estándar:</span>
                    <span>+${formData.seatPricing?.standard || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Frontal:</span>
                    <span>+${formData.seatPricing?.front || 25}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Mesa:</span>
                    <span>+${formData.seatPricing?.table || 15}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vista Previa del Layout */}
      {formData.hasBusTransport && previewMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Vista Previa del Bus
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="max-w-md mx-auto">
                {/* Ventana del bus */}
                <div className="h-16 bg-gray-200 rounded-t-lg mb-4 flex items-center justify-center">
                  <span className="text-xs text-gray-600">Ventana Frontal</span>
                </div>
                
                {/* Layout de asientos */}
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {/* Header */}
                  <div className="text-center font-medium text-gray-600">#</div>
                  <div className="text-center font-medium text-gray-600">A</div>
                  <div className="text-center font-medium text-gray-600">B</div>
                  <div className="text-center font-medium text-gray-600"></div>
                  <div className="text-center font-medium text-gray-600">D E</div>
                  
                  {/* Filas de asientos */}
                  {Array.from({ length: formData.busLayout!.totalRows }, (_, i) => i + 1).map(row => (
                    <React.Fragment key={row}>
                      <div className="text-center text-gray-500 text-xs py-1">{row}</div>
                      
                      {['A', 'B'].map(pos => {
                        const seat = previewSeats.find(s => s.row === row && s.position === pos);
                        return (
                          <div
                            key={`${row}${pos}`}
                            className={`h-6 w-6 rounded border text-center text-xs leading-6 ${
                              seat?.type === 'front' ? 'bg-blue-200 border-blue-400' :
                              seat?.type === 'table' ? 'bg-green-200 border-green-400' :
                              'bg-gray-200 border-gray-400'
                            }`}
                          >
                            {seat?.number}
                          </div>
                        );
                      })}
                      
                      <div className="text-center text-gray-400 text-xs py-1">|</div>
                      
                      <div className="flex gap-1">
                        {['D', 'E'].map(pos => {
                          const seat = previewSeats.find(s => s.row === row && s.position === pos);
                          return (
                            <div
                              key={`${row}${pos}`}
                              className={`h-6 w-6 rounded border text-center text-xs leading-6 ${
                                seat?.type === 'front' ? 'bg-blue-200 border-blue-400' :
                                seat?.type === 'table' ? 'bg-green-200 border-green-400' :
                                'bg-gray-200 border-gray-400'
                              }`}
                            >
                              {seat?.number}
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                    <span>Frontal (+${formData.seatPricing?.front})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                    <span>Mesa (+${formData.seatPricing?.table})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                    <span>Estándar (+${formData.seatPricing?.standard})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw className="w-4 h-4" />
          <span>Los cambios se aplicarán inmediatamente</span>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setFormData(initialData || {})}>
            Descartar Cambios
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : saved ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Guardando..." : saved ? "Guardado ✓" : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
