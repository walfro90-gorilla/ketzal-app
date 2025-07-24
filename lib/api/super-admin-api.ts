// API para el panel de superadmin usando el backend NestJS (ketzal-app_backend)

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function fetchSuppliers() {
  const res = await fetch(`${BACKEND_URL}/api/suppliers`);
  if (!res.ok) throw new Error('Error al obtener suppliers');
  return await res.json();
}

export async function fetchPendingAdminRequests() {
  // Suponiendo que hay un endpoint para solicitudes pendientes
  const res = await fetch(`${BACKEND_URL}/api/suppliers?pending=true`);
  if (!res.ok) throw new Error('Error al obtener solicitudes pendientes');
  return await res.json();
}

export async function approveSupplier(supplierId, userId) {
  const res = await fetch(`${BACKEND_URL}/api/suppliers/${supplierId}/approval`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'approve', userId }),
  });
  if (!res.ok) throw new Error('Error al aprobar supplier');
  return await res.json();
}

export async function rejectSupplier(supplierId, userId) {
  const res = await fetch(`${BACKEND_URL}/api/suppliers/${supplierId}/approval`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'decline', userId }),
  });
  if (!res.ok) throw new Error('Error al rechazar supplier');
  return await res.json();
}

export async function fetchSystemStats() {
  // Suponiendo que hay un endpoint para estadísticas
  const res = await fetch(`${BACKEND_URL}/api/suppliers/stats`);
  if (!res.ok) throw new Error('Error al obtener estadísticas');
  return await res.json();
}
