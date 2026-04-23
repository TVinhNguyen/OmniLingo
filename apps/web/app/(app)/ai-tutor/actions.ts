"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import {
  TUTOR_CHAT_MUTATION,
  EXPLAIN_MUTATION,
  RENAME_CONVERSATION_MUTATION,
  DELETE_CONVERSATION_MUTATION,
} from "@/lib/api/mutations"
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

/** Send a message within an existing conversation. Returns { reply } or { error }. */
export async function tutorChatAction(conversationId: string, message: string) {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    const res = await gql<{ tutorChat: ChatResult }>(
      TUTOR_CHAT_MUTATION,
      { conversationId, message, language: "en" },
      token,
    )
    return { reply: res?.tutorChat?.message?.content ?? "" }
  } catch (e: any) {
    return { error: e?.message ?? "Lỗi kết nối AI Tutor" }
  }
}

export async function renameConversationAction(id: string, title: string) {
  const token = await getAccessToken()
  if (!token) return
  await gql(RENAME_CONVERSATION_MUTATION, { id, title }, token).catch(() => {})
  revalidatePath("/ai-tutor/history")
}

export async function deleteConversationAction(id: string) {
  const token = await getAccessToken()
  if (!token) return
  await gql(DELETE_CONVERSATION_MUTATION, { id }, token).catch(() => {})
  redirect("/ai-tutor/history")
}
