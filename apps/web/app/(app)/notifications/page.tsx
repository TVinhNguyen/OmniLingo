/**
 * Notifications RSC page — fetches in-app notifications from BFF.
 * Falls back to empty list when notification-service is unavailable.
 */
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { NOTIFICATIONS_QUERY } from "@/lib/api/queries"
import type { NotificationPage } from "@/lib/api/types"
import NotificationsClient from "./notifications-client"

export default async function NotificationsPage() {
  const token = await getAccessToken()

  let items: NotificationPage["items"] = []
  let unreadCount = 0

  if (token) {
    try {
      const res = await gql<{ notifications: NotificationPage }>(
        NOTIFICATIONS_QUERY,
        { limit: 50 },
        token,
      )
      items = res?.notifications?.items ?? []
      unreadCount = res?.notifications?.unreadCount ?? 0
    } catch {
      // notification-service unavailable
    }
  }

  return <NotificationsClient initialItems={items} initialUnread={unreadCount} />
}
