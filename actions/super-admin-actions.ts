"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Verificar si el usuario es super-admin
export async function verifySuperAdmin() {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("No autenticado")
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== 'superadmin') {
    throw new Error("Acceso denegado - Se requiere rol de super-admin")
  }

  return true
}

// Obtener todas las solicitudes pendientes de administradores
export async function getPendingAdminRequests() {
  await verifySuperAdmin()

  const suppliers = await db.supplier.findMany({
    select: {
      id: true,
      name: true,
      contactEmail: true,
      phoneNumber: true,
      address: true,
      description: true,
      supplierType: true,
      extras: true,
      createdAt: true,
      UserSuppliers: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Filtrar solo los que están pendientes
  const pendingRequests = suppliers.filter(supplier => {
    const extras = supplier.extras as any
    return extras?.isPending === true && extras?.isApproved !== true
  })

  return pendingRequests.map(supplier => ({
    supplierId: supplier.id,
    supplierName: supplier.name,
    contactEmail: supplier.contactEmail,
    phoneNumber: supplier.phoneNumber,
    address: supplier.address,
    description: supplier.description,
    supplierType: supplier.supplierType,
    createdAt: supplier.createdAt,
    user: supplier.UserSuppliers[0] || null,
    extras: supplier.extras,
    status: 'pending'
  }))
}

// Aprobar solicitud de administrador
export async function approveAdminRequest(supplierId: number) {
  await verifySuperAdmin()

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Obtener el supplier y el usuario asociado
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId },
        include: {
          UserSuppliers: true
        }
      })

      if (!supplier) {
        throw new Error("Supplier no encontrado")
      }

      const user = supplier.UserSuppliers[0]
      if (!user) {
        throw new Error("Usuario asociado no encontrado")
      }

      // 2. Actualizar el supplier (marcar como aprobado)
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          extras: {
            ...(supplier.extras as any),
            isApproved: true,
            isPending: false,
            approvedAt: new Date().toISOString(),
            approvedBy: 'superadmin'
          }
        }
      })

      // 3. Promocionar usuario a admin
      await tx.user.update({
        where: { id: user.id },
        data: {
          role: 'admin'
        }
      })

      return { supplier, user }
    })

    revalidatePath('/super-admin')
    
    return {
      success: true,
      message: `Solicitud aprobada. ${result.user.name} ahora es administrador.`,
      user: result.user,
      supplier: result.supplier
    }

  } catch (error) {
    console.error('Error al aprobar solicitud:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

// Rechazar solicitud de administrador
export async function rejectAdminRequest(supplierId: number, reason?: string) {
  await verifySuperAdmin()

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Obtener el supplier
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId },
        include: {
          UserSuppliers: true
        }
      })

      if (!supplier) {
        throw new Error("Supplier no encontrado")
      }

      // 2. Actualizar el supplier (marcar como rechazado)
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          extras: {
            ...(supplier.extras as any),
            isApproved: false,
            isPending: false,
            rejectedAt: new Date().toISOString(),
            rejectedBy: 'superadmin',
            rejectionReason: reason || 'No especificada'
          }
        }
      })

      return { supplier }
    })

    revalidatePath('/super-admin')
    
    return {
      success: true,
      message: `Solicitud rechazada.`,
      supplier: result.supplier
    }

  } catch (error) {
    console.error('Error al rechazar solicitud:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

// Obtener estadísticas del sistema
export async function getSystemStats() {
  await verifySuperAdmin()

  const [
    totalUsers,
    totalAdmins,
    totalSuppliers,
    pendingRequests,
    approvedSuppliers,
    rejectedSuppliers
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: 'admin' } }),
    db.supplier.count(),
    db.supplier.count({
      where: {
        extras: {
          path: ['isPending'],
          equals: true
        }
      }
    }),
    db.supplier.count({
      where: {
        extras: {
          path: ['isApproved'],
          equals: true
        }
      }
    }),
    db.supplier.count({
      where: {
        AND: [
          {
            extras: {
              path: ['isApproved'],
              equals: false
            }
          },
          {
            extras: {
              path: ['isPending'],
              equals: false
            }
          }
        ]
      }
    })
  ])

  return {
    totalUsers,
    totalAdmins,
    totalSuppliers,
    pendingRequests,
    approvedSuppliers,
    rejectedSuppliers,
    superAdmins: 1 // Solo tú por ahora
  }
}

// Obtener todos los suppliers con su estado de aprobación
export async function getAllSuppliers() {
  await verifySuperAdmin()

  const suppliers = await db.supplier.findMany({
    select: {
      id: true,
      name: true,
      contactEmail: true,
      phoneNumber: true,
      address: true,
      description: true,
      supplierType: true,
      extras: true,
      createdAt: true,
      UserSuppliers: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Procesar suppliers para determinar su estado
  const processedSuppliers = suppliers.map(supplier => {
    const extras = supplier.extras as any
    const isPending = extras?.isPending === true
    const isApproved = extras?.isApproved === true
    const isRejected = extras?.isApproved === false && extras?.isPending === false

    let status = 'unknown'
    let statusText = 'Desconocido'
    let statusColor = 'gray'

    if (isPending) {
      status = 'pending'
      statusText = 'Pendiente'
      statusColor = 'yellow'
    } else if (isApproved) {
      status = 'approved'
      statusText = 'Aprobado'
      statusColor = 'green'
    } else if (isRejected) {
      status = 'rejected'
      statusText = 'Rechazado'
      statusColor = 'red'
    }

    return {
      ...supplier,
      status,
      statusText,
      statusColor,
      approvedAt: extras?.approvedAt,
      rejectedAt: extras?.rejectedAt,
      rejectionReason: extras?.rejectionReason
    }
  })

  return processedSuppliers
}
