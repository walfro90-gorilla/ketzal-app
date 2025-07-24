'use client'

import { useState } from 'react'

import { Facebook,  Globe, ChevronDown, Instagram, Youtube, LayoutDashboard, LogIn, LogOut, Crown, MapPin, Calendar, Wallet, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTravelPlanner } from '@/context/TravelPlannerContext'
import { usePlannerCart } from '@/context/PlannerCartContext'
import { useLoading } from '@/components/LoadingContext'


const TopBar = () => {
  const { data: session } = useSession();

  useLoading();
  
  const { activePlanner, planners, createPlanner, setActivePlanner, getPlannerSummary } = useTravelPlanner();
  const { activeCart } = usePlannerCart();

  // Estados para el modal de nuevo planner
  const [showNewPlannerModal, setShowNewPlannerModal] = useState(false);
  const [newPlannerName, setNewPlannerName] = useState('');
  const [newPlannerDestination, setNewPlannerDestination] = useState('');
  const [isCreatingPlanner, setIsCreatingPlanner] = useState(false);

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  // Calcular total combinado
  const getTotalCombined = () => {
    const cartTotal = activeCart?.total || 0;
    const plannerTotal = activePlanner ? getPlannerSummary(activePlanner.id).totalCost : 0;
    return cartTotal + plannerTotal;
  };

  // Función de logout optimizada
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true
      });
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/login';
    }
  };

  // Funciones para manejo de planners
  const handleCreateNewPlanner = async () => {
    if (!newPlannerName.trim() || !newPlannerDestination.trim()) return;
    
    setIsCreatingPlanner(true);
    try {
      const plannerId = await createPlanner({
        name: newPlannerName.trim(),
        destination: newPlannerDestination.trim(),
        description: `Viaje a ${newPlannerDestination.trim()}`,
        currency: 'MXN',
        travelers: 1
      }, async () => true); // Confirmación por defecto
      
      if (plannerId) {
        setNewPlannerName('');
        setNewPlannerDestination('');
        setShowNewPlannerModal(false);
        console.log('✅ Nuevo planner creado:', plannerId);
      }
    } catch (error) {
      console.error('❌ Error creando planner:', error);
    } finally {
      setIsCreatingPlanner(false);
    }
  };

  const handlePlannerChange = (plannerId: string) => {
    setActivePlanner(plannerId);
  };

  // Verificar si es super admin
  const isSuperAdmin = session?.user?.role === 'superadmin';

  // Obtener iniciales del usuario
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-green-600 text-white py-2 transition-transform duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                <Globe className="h-4 w-4 mr-1" />
                Latino
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>English</DropdownMenuItem>
              <DropdownMenuItem disabled>中国人</DropdownMenuItem>
              <DropdownMenuItem disabled>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                $ MXN
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>$ USD</DropdownMenuItem>
              <DropdownMenuItem disabled>€ EUR</DropdownMenuItem>
              <DropdownMenuItem disabled>£ GBP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          {/* Social Media Links */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-green-700"
              onClick={() => window.open('https://www.facebook.com/ketzal.app.mx', '_blank')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>

          {/* User Menu */}
          {!session || !session.user || !session.user.name ? (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-green-700">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-white hover:bg-green-700 px-2 py-1 h-auto"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border-2 border-green-400">
                      <AvatarImage 
                        src={session.user.image || undefined} 
                        alt={session.user.name} 
                      />
                      <AvatarFallback className="bg-green-800 text-green-100 text-xs font-semibold">
                        {getUserInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-xs font-medium leading-none">{session.user.name}</span>
                      <span className="text-xs text-green-200 leading-none">
                        {session.user.role || "Usuario"}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-80 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700" 
                align="end"
                sideOffset={8}
              >
                {/* User Header */}
                <DropdownMenuLabel className="p-0">
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-800">
                      <AvatarImage 
                        src={session.user.image || undefined} 
                        alt={session.user.name} 
                      />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                        {getUserInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {session.user.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {session.user.email}
                      </div>
                      <Badge 
                        variant={isSuperAdmin ? "destructive" : "secondary"}
                        className="mt-1 text-xs"
                      >
                        {session.user.role || "Usuario"}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Sección de Planner - Adaptable */}
                {!activePlanner ? (
                  /* Sin planner activo - Mostrar botón crear nuevo */
                  <div className="mx-4 mb-3">
                    <Dialog open={showNewPlannerModal} onOpenChange={setShowNewPlannerModal}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/30 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="font-medium">Planner Nuevo</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Crear Nuevo Planner</DialogTitle>
                          <DialogDescription>
                            Crea un nuevo planner para organizar tu próximo viaje
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="planner-name">Nombre del Planner</Label>
                            <Input
                              id="planner-name"
                              placeholder="ej. Vacaciones en Cancún"
                              value={newPlannerName}
                              onChange={(e) => setNewPlannerName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planner-destination">Destino</Label>
                            <Input
                              id="planner-destination"
                              placeholder="ej. Cancún, México"
                              value={newPlannerDestination}
                              onChange={(e) => setNewPlannerDestination(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowNewPlannerModal(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleCreateNewPlanner}
                            disabled={!newPlannerName.trim() || !newPlannerDestination.trim() || isCreatingPlanner}
                          >
                            {isCreatingPlanner ? 'Creando...' : 'Crear Planner'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  /* Con planner activo - Mostrar mini visualizador */
                  <div className="mx-4 mb-3 space-y-3">
                    {/* Selector de Planner (si hay más de uno) */}
                    {planners.length > 1 && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Cambiar Planner
                        </Label>
                        <Select value={activePlanner.id} onValueChange={handlePlannerChange}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {planners.map((planner) => (
                              <SelectItem key={planner.id} value={planner.id} className="text-xs">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{planner.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Mini Visualizador del Planner Activo */}
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                            Planner Activo
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400">
                          En curso
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                              {activePlanner.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {activePlanner.destination}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{getPlannerSummary(activePlanner.id).totalItems}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <Wallet className="h-3 w-3" />
                              <span>{formatPrice(getPlannerSummary(activePlanner.id).totalCost)}</span>
                            </div>
                          </div>
                          <Link href={`/planners/${activePlanner.id}`}>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30">
                              <LayoutDashboard className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Combinado */}
                {(activePlanner || (activeCart && activeCart.items.length > 0)) && (
                  <div className="mx-4 mb-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                      Total Combinado
                    </div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(getTotalCombined())}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Planner: {formatPrice(activePlanner ? getPlannerSummary(activePlanner.id).totalCost : 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Carrito: {formatPrice(activeCart?.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <DropdownMenuSeparator />

                {/* Menu Items */}
                <DropdownMenuGroup>
                  <Link href="/home">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  <Link href="/wallet">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Mi Monedero</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/planners">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Mis Planners</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/perfil">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M4 20c0-2.828 3.582-5 8-5s8 2.172 8 5"/></svg></span>
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>

                {/* Super Admin Section */}
                {isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/super-admin">
                        <DropdownMenuItem className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400">
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Panel Super Admin</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </>
                )}

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar

