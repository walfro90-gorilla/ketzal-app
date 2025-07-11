'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTravelPlanner } from '@/context/TravelPlannerContext';
import { PlannerItemType } from '@/types/travel-planner';
import { toast } from '@/hooks/use-toast';

interface AddToPlannerButtonProps {
  serviceId: string;
  serviceName: string;
  packageType?: string;
  packageDescription?: string;
  price: number;
  image?: string;
  imgBanner?: string;
  location?: string;
  duration?: string;
  description?: string;
  type?: PlannerItemType;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const AddToPlannerButton: React.FC<AddToPlannerButtonProps> = ({
  serviceId,
  serviceName,
  packageType,
  packageDescription,
  price,
  image,
  imgBanner,
  location,
  duration,
  description,
  type = 'tour',
  className,
  variant = 'default',
  size = 'default'
}) => {
  const { 
    planners, 
    activePlanner, 
    addToPlanner, 
    createPlanner,
    setActivePlanner 
  } = useTravelPlanner();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [plannedTime, setPlannedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingPlanner, setIsCreatingPlanner] = useState(false);
  const [newPlannerName, setNewPlannerName] = useState('');
  const [newPlannerDestination, setNewPlannerDestination] = useState('');

  // Función para agregar directamente al planner activo
  const handleQuickAdd = async () => {
    if (!activePlanner) {
      setIsDialogOpen(true);
      return;
    }

    const success = await addToPlanner({
      item: {
        type,
        serviceId,
        serviceName,
        packageType,
        packageDescription,
        price,
        quantity: 1,
        image,
        imgBanner,
        location,
        duration,
        description: description || `${serviceName} - ${packageType || 'Servicio'}`
      }
    });

    if (success) {
      toast({
        title: '¡Agregado al planner!',
        description: `${serviceName} fue agregado a "${activePlanner.name}"`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo agregar al planner',
        variant: 'destructive'
      });
    }
  };

  // Función para agregar a un planner específico
  const handleAddToSpecificPlanner = async (plannerId: string) => {
    const success = await addToPlanner({
      item: {
        type,
        serviceId,
        serviceName,
        packageType,
        packageDescription,
        price,
        quantity: 1,
        image,
        imgBanner,
        location,
        duration,
        description: description || `${serviceName} - ${packageType || 'Servicio'}`
      },
      plannerId,
      plannedDate: selectedDate,
      notes
    });

    if (success) {
      const planner = planners.find(p => p.id === plannerId);
      toast({
        title: '¡Agregado al planner!',
        description: `${serviceName} fue agregado a "${planner?.name}"`,
      });
      setIsDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo agregar al planner',
        variant: 'destructive'
      });
    }
  };

  // Función para crear nuevo planner
  const handleCreateNewPlanner = async () => {
    if (!newPlannerName.trim() || !newPlannerDestination.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa el nombre y destino del planner',
        variant: 'destructive'
      });
      return;
    }

    const plannerId = await createPlanner({
      name: newPlannerName,
      destination: newPlannerDestination
    });

    if (plannerId) {
      // Agregar el item al nuevo planner
      await handleAddToSpecificPlanner(plannerId);
      setIsCreatingPlanner(false);
      setNewPlannerName('');
      setNewPlannerDestination('');
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo crear el planner',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setPlannedTime('');
    setNotes('');
  };

  // Si no hay planners, mostrar opción de crear
  if (planners.length === 0) {
    return (
      <>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className={className}
          variant={variant}
          size={size}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Planner
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear tu primer Travel Planner</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="plannerName">Nombre del planner</Label>
                <Input
                  id="plannerName"
                  value={newPlannerName}
                  onChange={(e) => setNewPlannerName(e.target.value)}
                  placeholder="ej. Viaje a Oaxaca 2025"
                />
              </div>
              
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={newPlannerDestination}
                  onChange={(e) => setNewPlannerDestination(e.target.value)}
                  placeholder="ej. Oaxaca, México"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateNewPlanner}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear y Agregar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Si hay un planner activo, mostrar botón con dropdown
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={className}
            variant={variant}
            size={size}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {activePlanner ? `Agregar a ${activePlanner.name}` : 'Agregar a Planner'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          {activePlanner && (
            <DropdownMenuItem onClick={handleQuickAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar a &ldquo;{activePlanner.name}&rdquo;
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Agregar con fecha específica
          </DropdownMenuItem>
          
          {planners.length > 1 && activePlanner && (
            <>
              <hr className="my-1" />
              {planners
                .filter(p => p.id !== activePlanner.id)
                .map(planner => (
                  <DropdownMenuItem 
                    key={planner.id}
                    onClick={() => handleAddToSpecificPlanner(planner.id)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Agregar a &ldquo;{planner.name}&rdquo;
                  </DropdownMenuItem>
                ))
              }
            </>
          )}
          
          <hr className="my-1" />
          <DropdownMenuItem onClick={() => setIsCreatingPlanner(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear nuevo planner
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para agregar con detalles */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar al Planner</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Información del servicio */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm">{serviceName}</h4>
              {packageType && (
                <p className="text-sm text-gray-600">{packageType}</p>
              )}
              <p className="text-lg font-bold text-green-600">
                ${price.toLocaleString()} MXN
              </p>
            </div>

            {/* Selector de planner */}
            <div>
              <Label>Planner de destino</Label>
              <div className="space-y-2 mt-1">
                {planners.map(planner => (
                  <div
                    key={planner.id}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                      planner.id === activePlanner?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setActivePlanner(planner.id)}
                  >
                    <div className="font-medium text-sm">{planner.name}</div>
                    <div className="text-xs text-gray-500">{planner.destination}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fecha planificada */}
            <div>
              <Label>Fecha planificada (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      "Seleccionar fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hora planificada */}
            {selectedDate && (
              <div>
                <Label htmlFor="plannedTime">Hora planificada (opcional)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="plannedTime"
                    type="time"
                    value={plannedTime}
                    onChange={(e) => setPlannedTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Notas */}
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar notas sobre este item..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => activePlanner && handleAddToSpecificPlanner(activePlanner.id)}
                className="flex-1"
                disabled={!activePlanner}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar al Planner
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear nuevo planner */}
      <Dialog open={isCreatingPlanner} onOpenChange={setIsCreatingPlanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Planner</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPlannerName">Nombre del planner</Label>
              <Input
                id="newPlannerName"
                value={newPlannerName}
                onChange={(e) => setNewPlannerName(e.target.value)}
                placeholder="ej. Viaje a Oaxaca 2025"
              />
            </div>
            
            <div>
              <Label htmlFor="newDestination">Destino</Label>
              <Input
                id="newDestination"
                value={newPlannerDestination}
                onChange={(e) => setNewPlannerDestination(e.target.value)}
                placeholder="ej. Oaxaca, México"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleCreateNewPlanner}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Planner
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreatingPlanner(false);
                  setNewPlannerName('');
                  setNewPlannerDestination('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToPlannerButton;
