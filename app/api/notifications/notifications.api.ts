// Notifications sobre Supabase (schema `ketzal`).
// RLS: el dueno lee/marca/borra; INSERT solo via RPC notification_create_self
// (anti self-spam masivo desde cliente).
import { createClient } from "@/lib/supabase/client"

export const BACKEND_URL = "" // legacy export; no se usa

// Tipos para las notificaciones
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  priority: NotificationPriority
  metadata?: unknown
  actionUrl?: string
  createdAt: string
  readAt?: string
  user?: { id: string; name: string; email: string }
}

export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUPPLIER_APPROVAL = "SUPPLIER_APPROVAL",
  USER_REGISTRATION = "USER_REGISTRATION",
  WELCOME_BONUS = "WELCOME_BONUS",
  WELCOME_MESSAGE = "WELCOME_MESSAGE",
  BOOKING_UPDATE = "BOOKING_UPDATE",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
}

export enum NotificationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface CreateNotificationData {
  userId: string
  title: string
  message: string
  type?: NotificationType
  priority?: NotificationPriority
  metadata?: unknown
  actionUrl?: string
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
}

const SELECT =
  "id, userId:user_id, title, message, type, isRead:is_read, priority, metadata," +
  " actionUrl:action_url, createdAt:created_at, readAt:read_at"

// ----------------------------------------------------------------------------
// CREATE — solo via RPC (auto-spam protection: userId siempre = auth.uid()).
// ----------------------------------------------------------------------------
export async function createNotification(data: CreateNotificationData): Promise<Notification> {
  const sb = createClient()
  const { data: row, error } = await sb.rpc("notification_create_self" as never, {
    p_title: data.title,
    p_message: data.message,
    p_type: data.type ?? NotificationType.INFO,
    p_priority: data.priority ?? NotificationPriority.NORMAL,
    p_metadata: (data.metadata ?? null) as unknown,
    p_action_url: data.actionUrl ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  if (error) throw new Error(`createNotification: ${error.message}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = row as any
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    message: r.message,
    type: r.type,
    isRead: r.is_read,
    priority: r.priority,
    metadata: r.metadata,
    actionUrl: r.action_url,
    createdAt: r.created_at,
    readAt: r.read_at,
  }
}

export async function createQuickNotification(
  _userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.INFO
): Promise<Notification> {
  void _userId
  return createNotification({ userId: "", title, message, type })
}

// ----------------------------------------------------------------------------
// READ
// ----------------------------------------------------------------------------
export async function getNotifications(): Promise<Notification[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from("notifications")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .returns<Notification[]>()
  if (error) throw new Error(`getNotifications: ${error.message}`)
  return data ?? []
}

export async function getNotification(id: string): Promise<Notification | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from("notifications")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<Notification>()
  if (error) throw new Error(`getNotification: ${error.message}`)
  return data
}

export async function getUserNotifications(
  _userId: string,
  includeRead: boolean = true
): Promise<Notification[]> {
  void _userId // RLS gatea por auth.uid()
  const sb = createClient()
  let q = sb.from("notifications").select(SELECT).order("created_at", { ascending: false })
  if (!includeRead) q = q.eq("is_read", false)
  const { data, error } = await q.returns<Notification[]>()
  if (error) throw new Error(`getUserNotifications: ${error.message}`)
  return data ?? []
}

export async function getNotificationStats(_userId: string): Promise<NotificationStats> {
  void _userId
  const sb = createClient()
  const [total, unread] = await Promise.all([
    sb.from("notifications").select("id", { head: true, count: "exact" }),
    sb.from("notifications").select("id", { head: true, count: "exact" }).eq("is_read", false),
  ])
  const t = total.count ?? 0
  const u = unread.count ?? 0
  return { total: t, unread: u, read: t - u }
}

// ----------------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------------
export async function markNotificationAsRead(id: string): Promise<Notification> {
  const sb = createClient()
  const { data, error } = await sb
    .from("notifications")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ is_read: true, read_at: new Date().toISOString() } as any)
    .eq("id", id)
    .select(SELECT)
    .single()
    .returns<Notification>()
  if (error) throw new Error(`markNotificationAsRead: ${error.message}`)
  return data
}

export async function markAllNotificationsAsRead(_userId: string): Promise<{ count: number }> {
  void _userId
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error("markAllNotificationsAsRead: no autenticado")
  const { data, error } = await sb
    .from("notifications")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ is_read: true, read_at: new Date().toISOString() } as any)
    .eq("user_id", user.id)
    .eq("is_read", false)
    .select("id")
  if (error) throw new Error(`markAllNotificationsAsRead: ${error.message}`)
  return { count: data?.length ?? 0 }
}

export async function updateNotification(
  id: string,
  data: Partial<CreateNotificationData>
): Promise<Notification> {
  const sb = createClient()
  const patch: Record<string, unknown> = {}
  if (data.title !== undefined) patch.title = data.title
  if (data.message !== undefined) patch.message = data.message
  if (data.type !== undefined) patch.type = data.type
  if (data.priority !== undefined) patch.priority = data.priority
  if (data.metadata !== undefined) patch.metadata = data.metadata
  if (data.actionUrl !== undefined) patch.action_url = data.actionUrl
  const { data: row, error } = await sb
    .from("notifications")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(patch as any)
    .eq("id", id)
    .select(SELECT)
    .single()
    .returns<Notification>()
  if (error) throw new Error(`updateNotification: ${error.message}`)
  return row
}

// ----------------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------------
export async function deleteNotification(id: string): Promise<{ message: string }> {
  const sb = createClient()
  const { error } = await sb.from("notifications").delete().eq("id", id)
  if (error) throw new Error(`deleteNotification: ${error.message}`)
  return { message: "ok" }
}

export async function deleteReadNotifications(_userId: string): Promise<{ count: number }> {
  void _userId
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error("deleteReadNotifications: no autenticado")
  const { data, error } = await sb
    .from("notifications")
    .delete()
    .eq("user_id", user.id)
    .eq("is_read", true)
    .select("id")
  if (error) throw new Error(`deleteReadNotifications: ${error.message}`)
  return { count: data?.length ?? 0 }
}
