export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Tipos para las notificaciones
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  priority: NotificationPriority;
  metadata?: any;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUPPLIER_APPROVAL = 'SUPPLIER_APPROVAL',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  metadata?: any;
  actionUrl?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

// CREATE notification
export async function createNotification(data: CreateNotificationData): Promise<Notification> {
  const response = await fetch(`${BACKEND_URL}/api/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error creating notification: ${response.status}`);
  }

  return await response.json();
}

// READ - Get all notifications
export async function getNotifications(): Promise<Notification[]> {
  const response = await fetch(`${BACKEND_URL}/api/notifications`);
  
  if (!response.ok) {
    throw new Error(`Error fetching notifications: ${response.status}`);
  }

  return await response.json();
}

// READ - Get notification by ID
export async function getNotification(id: string): Promise<Notification> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching notification: ${response.status}`);
  }

  return await response.json();
}

// READ - Get notifications by user
export async function getUserNotifications(userId: string, includeRead: boolean = true): Promise<Notification[]> {
  const url = `${BACKEND_URL}/api/notifications/user/${userId}${includeRead ? '' : '?includeRead=false'}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching user notifications: ${response.status}`);
  }

  return await response.json();
}

// READ - Get notification stats
export async function getNotificationStats(userId: string): Promise<NotificationStats> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/user/${userId}/stats`);
  
  if (!response.ok) {
    throw new Error(`Error fetching notification stats: ${response.status}`);
  }

  return await response.json();
}

// UPDATE - Mark as read
export async function markNotificationAsRead(id: string): Promise<Notification> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/${id}/mark-read`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Error marking notification as read: ${response.status}`);
  }

  return await response.json();
}

// UPDATE - Mark all as read for user
export async function markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/user/${userId}/mark-all-read`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Error marking all notifications as read: ${response.status}`);
  }

  return await response.json();
}

// UPDATE notification
export async function updateNotification(id: string, data: Partial<CreateNotificationData>): Promise<Notification> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error updating notification: ${response.status}`);
  }

  return await response.json();
}

// DELETE notification
export async function deleteNotification(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting notification: ${response.status}`);
  }

  return await response.json();
}

// DELETE all read notifications for user
export async function deleteReadNotifications(userId: string): Promise<{ count: number }> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/user/${userId}/read`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting read notifications: ${response.status}`);
  }

  return await response.json();
}

// UTILITY - Create quick notification
export async function createQuickNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.INFO
): Promise<Notification> {
  const response = await fetch(`${BACKEND_URL}/api/notifications/quick`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, title, message, type }),
  });

  if (!response.ok) {
    throw new Error(`Error creating quick notification: ${response.status}`);
  }

  return await response.json();
}
