// Script de prueba para TravelPlannerContext
// Ejecuta este archivo con ts-node o en un entorno de pruebas

import { CreatePlannerRequest } from '../types/travel-planner';

// Simulación de confirmación
async function fakeConfirm() {
  return true;
}

// Simulación de sesión
const fakeSession = {
  user: { id: 'user_test' },
  token: 'token_test',
};

// Simulación de funciones de estado
let planners: any[] = [];
let activePlanner: any = null;

function setPlanners(fn: (prev: any[]) => any[]) {
  planners = fn(planners);
}
function setActiveplannerState(p: any) {
  activePlanner = p;
}
function setError(msg: string) {
  console.error(msg);
}
function setIsLoading(val: boolean) {
  /* noop */
}
function savePlannersToStorage(p: any[]) {
  /* noop */
}
function saveActivePlannerToStorage(id: string) {
  /* noop */
}

// Simulación de API
async function createPlannerAPI(token: string, request: CreatePlannerRequest) {
  return {
    id: 'planner_test',
    ...request,
    userId: fakeSession.user.id,
    isPrivate: true,
    cart: {},
    timeline: {},
    items: [],
    totalEstimated: 0,
    totalPaid: 0,
    status: 'draft',
    isShared: false,
    shareCode: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: request.currency || 'MXN',
    travelers: request.travelers || 1,
    autoGenerateItinerary: false
  };
}

// Implementación de createPlanner para pruebas
async function createPlanner(request: CreatePlannerRequest, confirmFn: () => Promise<boolean>): Promise<string | null> {
  if (!fakeSession.user.id || !fakeSession.token) {
    setError('No hay sesión de usuario');
    return null;
  }
  const confirmed = await confirmFn();
  if (!confirmed) return null;
  setIsLoading(true);
  try {
    const planner = await createPlannerAPI(fakeSession.token, request);
    setPlanners(prev => [...prev, planner]);
    setActiveplannerState(planner);
    saveActivePlannerToStorage(planner.id);
    return planner.id;
  } catch (err: any) {
    setError('Error al crear planner: ' + err.message);
    return null;
  } finally {
    setIsLoading(false);
  }
}

// Prueba
(async () => {
  const req: CreatePlannerRequest = {
    name: 'Test Planner',
    destination: 'Cancún',
    currency: 'MXN',
    travelers: 2
  };
  const id = await createPlanner(req, fakeConfirm);
  console.log('Planner creado con ID:', id);
  console.log('Planners:', planners);
  console.log('Active planner:', activePlanner);
})();
