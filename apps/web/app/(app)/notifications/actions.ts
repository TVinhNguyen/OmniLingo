"use server"

import { revalidatePath } from "next/cache"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { UNREAD_NOTIFICATION_COUNT_QUERY } from "@/lib/api/queries"
import {
  MARK_NOTIFICATIONS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  UPDATE_NOTIFICATION_PREFS_MUTATION,
} from "@/lib/api/mutations"

/**
 * Polled from the topbar bell every 30s. Returns 0 on any error
 * (unauthenticated, service down) so the badge simply hides.
 */
export async function getUnreadNotificationCountAction(): Promise<number> {
  const token = await getAccessToken()
  if (!token) return 0
  try {
    const res = await gql<{ unreadNotificationCount: number }>(
      UNREAD_NOTIFICATION_COUNT_QUERY,
      {},
      token,
    )
    return res?.unreadNotificationCount ?? 0
  } catch {
    return 0
  }
}

export async function markReadAction(ids: string[]) {
  const token = await getAccessToken()
  if (!token || ids.length === 0) return
  await gql(MARK_NOTIFICATIONS_READ_MUTATION, { ids }, token).catch(() => {})
  revalidatePath("/notifications")
}

export async function markAllReadAction() {
  const token = await getAccessToken()
  if (!token) return
  await gql(MARK_ALL_NOTIFICATIONS_READ_MUTATION, {}, token).catch(() => {})
  revalidatePath("/notifications")
}

export async function updateNotificationPrefsAction(prefs: Record<string, unknown>) {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    await gql(UPDATE_NOTIFICATION_PREFS_MUTATION, { prefs }, token)
    return { ok: true }
  } catch {
    return { error: "Không thể lưu cài đặt" }
  }
}
