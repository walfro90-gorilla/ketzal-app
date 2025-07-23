import { UpdatePlannerRequest } from '@/types/travel-planner';
import { CreatePlannerRequest, TravelPlanner } from '@/types/travel-planner';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const PLANNERS_API_URL = `${BACKEND_URL}/api/planners`;

export async function fetchPlanners(token: string): Promise<TravelPlanner[]> {
  const res = await fetch(PLANNERS_API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener planners');
  const data = await res.json();
  return data.data;
}

export async function createPlannerAPI(token: string, planner: CreatePlannerRequest): Promise<TravelPlanner> {
  // Convertir fechas a string ISO si existen
  const payload = {
    ...planner,
    startDate: planner.startDate ? new Date(planner.startDate).toISOString() : undefined,
    endDate: planner.endDate ? new Date(planner.endDate).toISOString() : undefined,
  };
  const res = await fetch(PLANNERS_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear planner');
  const data = await res.json();
  return data.data;
}

export async function updatePlannerAPI(token: string, plannerId: string, updates: UpdatePlannerRequest): Promise<TravelPlanner> {
  const res = await fetch(`${PLANNERS_API_URL}/${plannerId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Error al actualizar planner');
  const data = await res.json();
  return data.data;
}

export async function deletePlannerAPI(token: string, plannerId: string): Promise<void> {
  const res = await fetch(`${PLANNERS_API_URL}/${plannerId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Error al eliminar planner');
}
