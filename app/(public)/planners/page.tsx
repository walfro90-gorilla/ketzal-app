'use client'

import React, { useState } from 'react';
import PlannerCreateConfirmDialog from './PlannerCreateConfirmDialog';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CalendarIcon, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { PlannerStatus, TravelPlanner } from '@/types/travel-planner';
import { toast } from '@/hooks/use-toast';

const PlannerCard: React.FC<{ planner: TravelPlanner; onEdit: (planner: TravelPlanner) => void }> = ({ 
  planner, 
  onEdit 
}) => {
  const router = useRouter();
  const { deletePlanner } = useTravelPlanner();

  const getStatusColor = (status: PlannerStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: PlannerStatus) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'planning': return 'Planificando';
      case 'confirmed': return 'Confirmado';
      case 'paid': return 'Pagado';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el planner "${planner.name}"?`)) {
      try {
        await deletePlanner(planner.id);
        toast({
          title: "Planner eliminado",
          description: `El planner "${planner.name}" ha sido eliminado exitosamente.`,
        });
      } catch {
        toast({
          title: "Error",
          description: "No se pudo eliminar el planner. Inténtalo de nuevo.",
        });
      }
    }
  };

  const totalDays = planner.startDate && planner.endDate 
    ? Math.ceil((new Date(planner.endDate).getTime() - new Date(planner.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{planner.name}</CardTitle>
            <Badge className={getStatusColor(planner.status)}>
              {getStatusText(planner.status)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/planners/${planner.id}`)}
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(planner)}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {planner.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{planner.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {planner.startDate ? format(new Date(planner.startDate), 'dd MMM', { locale: es }) : 'No definido'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{totalDays} días</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                ${planner.cart?.total?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{planner.travelers || 1} personas</span>
            </div>
          </div>

          {planner.destination && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{planner.destination}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{planner.items.length} servicios</span>
            <span>Actualizado {format(new Date(planner.updatedAt), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PlannerForm: React.FC<{ 
  planner?: TravelPlanner; 
  onClose: () => void; 
  onSave: (data: Partial<TravelPlanner>) => void 
}> = ({ planner, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: planner?.name || '',
    description: planner?.description || '',
    destination: planner?.destination || '',
    startDate: planner?.startDate ? new Date(planner.startDate) : undefined,
    endDate: planner?.endDate ? new Date(planner.endDate) : undefined,
    budget: planner?.budget || 0,
    travelers: planner?.travelers || 1,
    status: planner?.status || 'draft' as PlannerStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Planner *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Viaje a Cancún 2024"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="Ej: Cancún, México"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe tu viaje..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData({ ...formData, startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Fecha de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Presupuesto (USD)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelers">Viajeros</Label>
          <Input
            id="travelers"
            type="number"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {planner ? 'Actualizar' : 'Crear'} Planner
        </Button>
      </div>
    </form>
  );
};

export default function PlannersPage() {
  const { planners, createPlanner, updatePlanner } = useTravelPlanner();
  const [selectedPlanner, setSelectedPlanner] = useState<TravelPlanner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<PlannerStatus | 'all'>('all');
  const [pendingCreateData, setPendingCreateData] = useState<Partial<TravelPlanner> | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredPlanners = planners.filter(p => 
    filter === 'all' || p.status === filter
  );

  // Handler para crear planner, ahora muestra el modal de confirmación
  const handleCreatePlanner = async (data: Partial<TravelPlanner>) => {
    // Mapear solo los campos válidos para CreatePlannerRequest
    const mapped: import('@/types/travel-planner').CreatePlannerRequest = {
      name: data.name || '',
      destination: data.destination || '',
      description: data.description || '',
      startDate: data.startDate instanceof Date ? data.startDate : (typeof data.startDate === 'string' ? new Date(data.startDate) : undefined),
      endDate: data.endDate instanceof Date ? data.endDate : (typeof data.endDate === 'string' ? new Date(data.endDate) : undefined),
      budget: typeof data.budget === 'number' ? data.budget : undefined,
      travelers: typeof data.travelers === 'number' ? data.travelers : undefined,
      currency: data.currency || 'USD',
    };
    setPendingCreateData(mapped);
    setShowConfirm(true);
  };

  // Confirmación avanzada: ejecuta el create sólo si el usuario confirma
  const confirmCreatePlanner = async () => {
    if (!pendingCreateData) return;
    setShowConfirm(false);
    try {
      await createPlanner(
        pendingCreateData as Omit<TravelPlanner, 'id' | 'items' | 'createdAt' | 'updatedAt' | 'totalCost'>,
        async () => true // Confirmación ya fue dada por el modal
      );
      setIsFormOpen(false);
      setPendingCreateData(null);
      toast({
        title: "Planner creado",
        description: `El planner "${pendingCreateData.name}" ha sido creado exitosamente.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear el planner. Inténtalo de nuevo.",
      });
    }
  };

  const handleUpdatePlanner = async (data: Partial<TravelPlanner>) => {
    if (!selectedPlanner) return;
    try {
      await updatePlanner(selectedPlanner.id, data);
      setSelectedPlanner(null);
      setIsFormOpen(false);
      toast({
        title: "Planner actualizado",
        description: `El planner "${data.name}" ha sido actualizado exitosamente.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el planner. Inténtalo de nuevo.",
      });
    }
  };

  const handleEditPlanner = (planner: TravelPlanner) => {
    setSelectedPlanner(planner);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mis Planners de Viaje
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Organiza y planifica tus viajes de manera inteligente
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedPlanner(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Planner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedPlanner ? 'Editar Planner' : 'Crear Nuevo Planner'}
                </DialogTitle>
              </DialogHeader>
              <PlannerForm
                planner={selectedPlanner || undefined}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedPlanner(null);
                }}
                onSave={selectedPlanner ? handleUpdatePlanner : handleCreatePlanner}
              />
            </DialogContent>
          </Dialog>
          {/* Modal de confirmación avanzado para crear planner */}
          <PlannerCreateConfirmDialog
            open={showConfirm}
            onConfirm={confirmCreatePlanner}
            onCancel={() => { setShowConfirm(false); setPendingCreateData(null); }}
            plannerName={pendingCreateData?.name || ''}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({planners.length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Borradores ({planners.filter(p => p.status === 'draft').length})
          </Button>
          <Button
            variant={filter === 'planning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('planning')}
          >
            Planificando ({planners.filter(p => p.status === 'planning').length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completados ({planners.filter(p => p.status === 'completed').length})
          </Button>
        </div>

        {/* Lista de Planners */}
        {filteredPlanners.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {filter === 'all' ? 'No tienes planners de viaje' : `No tienes planners ${filter === 'draft' ? 'en borrador' : filter === 'planning' ? 'planificando' : 'completados'}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crea tu primer planner para comenzar a organizar tu próximo viaje
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer planner
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanners.map((planner) => (
              <PlannerCard
                key={planner.id}
                planner={planner}
                onEdit={handleEditPlanner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
