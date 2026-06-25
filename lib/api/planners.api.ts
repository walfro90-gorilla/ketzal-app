// Planners sobre Supabase (schema `ketzal`). El argumento `token` se mantiene
// por compat con callers viejos pero se ignora — Supabase usa la sesión via
// cookies/local storage. RLS gatea por user_id = auth.uid().
import { createClient } from "@/lib/supabase/client"
import type {
  CreatePlannerRequest,
  TravelPlanner,
  UpdatePlannerRequest,
} from "@/types/travel-planner"

const PLANNER_SELECT =
  "id, userId:user_id, name, destination, startDate:start_date, endDate:end_date," +
  " status, totalMxn:total_mxn, totalAxo:total_axo, isPublic:is_public," +
  " shareCode:share_code, createdAt:created_at, updatedAt:updated_at"

type Row = {
  id: string
  userId: string
  name: string
  destination: string | null
  startDate: string | null
  endDate: string | null
  status: string
  totalMxn: number
  totalAxo: number
  isPublic: boolean
  shareCode: string | null
  createdAt: string
  updatedAt: string
}

function toPlanner(r: Row): TravelPlanner {
  return {
    id: r.id,
    name: r.name,
    description: undefined,
    destination: r.destination ?? "",
    userId: r.userId,
    isPrivate: !r.isPublic,
    startDate: r.startDate ? new Date(r.startDate) : undefined,
    endDate: r.endDate ? new Date(r.endDate) : undefined,
    // ponytail: cart/timeline derivados aún no se traen — vacíos hasta que
    // se haga join con planner_items. Los consumers manejan ambos vacíos.
    cart: {
      id: `${r.id}-cart`,
      plannerId: r.id,
      items: [],
      subtotal: 0,
      taxes: 0,
      discount: 0,
      total: Number(r.totalMxn),
      currency: "MXN",
      updatedAt: new Date(r.updatedAt),
    },
    timeline: {
      id: `${r.id}-timeline`,
      plannerId: r.id,
      services: [],
      totalCost: 0,
      updatedAt: new Date(r.updatedAt),
    },
    totalEstimated: Number(r.totalMxn),
    totalPaid: 0,
    status: (r.status === "PLANNING" ? "planning" : r.status.toLowerCase()) as TravelPlanner["status"],
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  } as unknown as TravelPlanner
}

export async function fetchPlanners(_token: string): Promise<TravelPlanner[]> {
  void _token
  const sb = createClient()
  const { data, error } = await sb
    .from("travel_planners")
    .select(PLANNER_SELECT)
    .order("created_at", { ascending: false })
    .returns<Row[]>()
  if (error) throw new Error(`fetchPlanners: ${error.message}`)
  return data?.map(toPlanner) ?? []
}

export async function createPlannerAPI(
  _token: string,
  planner: CreatePlannerRequest
): Promise<TravelPlanner> {
  void _token
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error("createPlannerAPI: sesión requerida")
  const { data, error } = await sb
    .from("travel_planners")
    .insert({
      user_id: user.id,
      name: planner.name,
      destination: planner.destination,
      start_date: planner.startDate ? new Date(planner.startDate).toISOString() : null,
      end_date: planner.endDate ? new Date(planner.endDate).toISOString() : null,
    })
    .select(PLANNER_SELECT)
    .single()
    .returns<Row>()
  if (error) throw new Error(`createPlannerAPI: ${error.message}`)
  return toPlanner(data as Row)
}

export async function updatePlannerAPI(
  _token: string,
  plannerId: string,
  updates: UpdatePlannerRequest
): Promise<TravelPlanner> {
  void _token
  const patch: Record<string, unknown> = {}
  if (updates.name !== undefined) patch.name = updates.name
  if (updates.destination !== undefined) patch.destination = updates.destination
  if (updates.startDate !== undefined)
    patch.start_date = updates.startDate ? new Date(updates.startDate).toISOString() : null
  if (updates.endDate !== undefined)
    patch.end_date = updates.endDate ? new Date(updates.endDate).toISOString() : null
  if (updates.status !== undefined) patch.status = updates.status.toUpperCase()
  const sb = createClient()
  const { data, error } = await sb
    .from("travel_planners")
    .update(patch as never)
    .eq("id", plannerId)
    .select(PLANNER_SELECT)
    .single()
    .returns<Row>()
  if (error) throw new Error(`updatePlannerAPI: ${error.message}`)
  return toPlanner(data as Row)
}

export async function deletePlannerAPI(_token: string, plannerId: string): Promise<void> {
  void _token
  const sb = createClient()
  const { error } = await sb.from("travel_planners").delete().eq("id", plannerId)
  if (error) throw new Error(`deletePlannerAPI: ${error.message}`)
}
