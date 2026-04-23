"use server"

import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { TUTOR_CHAT_MUTATION, EXPLAIN_MUTATION } from "@/lib/api/mutations"
import type { ChatResult, ExplainResult } from "@/lib/api/types"

export async function chatAction(conversationId: string | null, message: string, language: string) {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    const res = await gql<{ tutorChat: ChatResult }>(
      TUTOR_CHAT_MUTATION,
      { conversationId, message, language },
      token,
    )
    return { data: res?.tutorChat }
  } catch (e: any) {
    return { error: e?.message ?? "Lỗi kết nối AI Tutor" }
  }
}

export async function explainAction(text: string, context: string | null, language: string) {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    const res = await gql<{ explain: ExplainResult }>(
      EXPLAIN_MUTATION,
      { text, context, language },
      token,
    )
    return { data: res?.explain }
  } catch (e: any) {
    return { error: e?.message ?? "Lỗi giải thích từ" }
  }
}
