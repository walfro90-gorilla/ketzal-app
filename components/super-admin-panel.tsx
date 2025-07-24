'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserCheck, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

import { 
  fetchSuppliers, 
  fetchPendingAdminRequests, 
  approveSupplier, 
  rejectSupplier, 
  fetchSystemStats
} from '@/lib/api/super-admin-api'

interface PendingRequest {
  supplierId: number
  supplierName: string
  contactEmail: string
  phoneNumber: string | null
  address: string | null
  description: string | null
  supplierType: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: Date | null
    createdAt: Date
  } | null
  extras: any
  status: string
}

interface SystemStats {
  totalUsers: number
  totalAdmins: number
  totalSuppliers: number
  pendingRequests: number
  approvedSuppliers: number
  rejectedSuppliers: number
  superAdmins: number
}

interface SupplierWithStatus {
  id: number
  name: string
  contactEmail: string
  phoneNumber: string | null
  address: string | null
  description: string | null
  supplierType: string | null
  extras: any
  createdAt: Date
  status: string
  statusText: string
  statusColor: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  UserSuppliers: {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: Date | null
    createdAt: Date
  }[]
}

export default function SuperAdminPanel() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [allSuppliers, setAllSuppliers] = useState<SupplierWithStatus[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [requests, systemStats, suppliers] = await Promise.all([
        fetchPendingAdminRequests(),
        fetchSystemStats(),
        fetchSuppliers()
      ])
      setPendingRequests(requests)
      setStats(systemStats)
      setAllSuppliers(suppliers)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar datos del panel')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (supplierId: number, userId?: string) => {
    setActionLoading(supplierId)
    try {
      if (!userId) throw new Error('No se encontró el usuario asociado al supplier');
      const result = await approveSupplier(supplierId, userId)
      toast.success(result.message || 'Solicitud aprobada')
      await loadData()
    } catch (error) {
      console.error('Error en handleApprove:', error);
      toast.error('Error inesperado al aprobar solicitud')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (supplierId: number, userId?: string) => {
    setActionLoading(supplierId)
    try {
      if (!userId) throw new Error('No se encontró el usuario asociado al supplier');
      const result = await rejectSupplier(supplierId, userId)
      toast.success(result.message || 'Solicitud rechazada')
      await loadData()
    } catch (error) {
      console.error('Error en handleReject:', error);
      toast.error('Error inesperado al rechazar solicitud')
    } finally {
      setActionLoading(null)
    }
  }

  // Estado para controlar el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'approve' | 'reject' | null
    supplierId?: number
    userId?: string
    supplierName?: string
  }>({ type: null })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Super Administrador</h1>
          <p className="text-gray-600">Gestión de solicitudes y usuarios del sistema</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedSuppliers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejectedSuppliers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Solicitudes Pendientes ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos los Suppliers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡No hay solicitudes pendientes!
                </h3>
                <p className="text-gray-600">
                  Todas las solicitudes de administrador han sido procesadas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request, idx) => (
                <Card key={request.supplierId ?? `pending-${idx}`} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{request.supplierName}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {request.contactEmail}
                          </div>
                          {request.phoneNumber && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {request.phoneNumber}
                            </div>
                          )}
                          {request.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {request.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </Badge>
                        {request.supplierType && (
                          <Badge variant="secondary">
                            {request.supplierType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Usuario asociado */}
                    {request.user && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Usuario Asociado:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Nombre:</span> {request.user.name}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {request.user.email}
                          </div>
                          <div>
                            <span className="font-medium">Rol Actual:</span> 
                            <Badge variant="outline" className="ml-2">
                              {request.user.role}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Email Verificado:</span> 
                            {request.user.emailVerified ? '✅ Sí' : '❌ No'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documentación */}
                    {request.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Documentación:</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Fecha de solicitud */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Solicitud enviada: {new Date(request.createdAt).toLocaleDateString()}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-3 pt-4 border-t">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            onClick={() => setConfirmDialog({
                              type: 'approve',
                              supplierId: request.supplierId,
                              userId: request.user?.id,
                              supplierName: request.supplierName
                            })}
                            disabled={actionLoading === request.supplierId}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {actionLoading === request.supplierId ? 'Aprobando...' : 'Aprobar'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Aprobar supplier?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro que deseas aprobar <b>{request.supplierName}</b>? El usuario será notificado y su rol cambiará a admin.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                setConfirmDialog({ type: null })
                                await handleApprove(request.supplierId, request.user?.id)
                              }}
                              disabled={actionLoading === request.supplierId}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => setConfirmDialog({
                              type: 'reject',
                              supplierId: request.supplierId,
                              userId: request.user?.id,
                              supplierName: request.supplierName
                            })}
                            disabled={actionLoading === request.supplierId}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {actionLoading === request.supplierId ? 'Rechazando...' : 'Rechazar'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Rechazar supplier?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro que deseas rechazar <b>{request.supplierName}</b>? El usuario será notificado del rechazo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                setConfirmDialog({ type: null })
                                await handleReject(request.supplierId, request.user?.id)
                              }}
                              disabled={actionLoading === request.supplierId}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {allSuppliers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No hay suppliers registrados
                  </h3>
                  <p className="text-gray-600">
                    Aún no se han registrado suppliers en el sistema.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allSuppliers.map((supplier, idx) => (
                  <Card key={supplier.id ?? `supplier-${idx}`} className={`border-l-4 ${
                    supplier.statusColor === 'green' 
                      ? 'border-l-green-500' 
                      : supplier.statusColor === 'red' 
                        ? 'border-l-red-500'
                        : 'border-l-orange-500'
                  }`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{supplier.name}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {supplier.contactEmail}
                            </div>
                            {supplier.phoneNumber && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {supplier.phoneNumber}
                              </div>
                            )}
                            {supplier.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {supplier.address}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge 
                            variant="outline" 
                            className={
                              supplier.statusColor === 'green' 
                                ? 'text-green-600 border-green-200 bg-green-50' 
                                : supplier.statusColor === 'red' 
                                  ? 'text-red-600 border-red-200 bg-red-50'
                                  : 'text-orange-600 border-orange-200 bg-orange-50'
                            }
                          >
                            {supplier.statusColor === 'green' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {supplier.statusColor === 'red' && <XCircle className="h-3 w-3 mr-1" />}
                            {supplier.statusColor === 'orange' && <Clock className="h-3 w-3 mr-1" />}
                            {supplier.statusText}
                          </Badge>
                          {supplier.supplierType && (
                            <Badge variant="secondary">
                              {supplier.supplierType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Usuario asociado */}
                      {supplier.UserSuppliers && supplier.UserSuppliers.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Usuario Asociado:</h4>
                          {supplier.UserSuppliers.map((user, idx) => (
                            <div key={user.id ?? `user-${idx}`} className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Nombre:</span> {user.name}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {user.email}
                              </div>
                              <div>
                                <span className="font-medium">Rol:</span> 
                                <Badge variant="outline" className="ml-2">
                                  {user.role}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Email Verificado:</span> 
                                {user.emailVerified ? '✅ Sí' : '❌ No'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Estado y fechas */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Estado del Supplier:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Estado:</span> 
                            <Badge variant="outline" className="ml-2">
                              {supplier.statusText}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Fecha de registro:</span> 
                            {new Date(supplier.createdAt).toLocaleDateString()}
                          </div>
                          {supplier.approvedAt && (
                            <div>
                              <span className="font-medium text-green-600">Aprobado:</span> 
                              {new Date(supplier.approvedAt).toLocaleDateString()}
                            </div>
                          )}
                          {supplier.rejectedAt && (
                            <div>
                              <span className="font-medium text-red-600">Rechazado:</span> 
                              {new Date(supplier.rejectedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {supplier.rejectionReason && (
                          <div className="mt-2">
                            <span className="font-medium text-red-600">Razón del rechazo:</span>
                            <p className="text-sm text-red-700 mt-1 p-2 bg-red-50 rounded">
                              {supplier.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Descripción */}
                      {supplier.description && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Descripción:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {supplier.description}
                          </p>
                        </div>
                      )}

                      {/* ID del supplier */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="h-4 w-4 mr-1" />
                        ID del Supplier: {supplier.id}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
