/**
 * AI Tutor conversation detail RSC — fetches real message history from BFF.
 * Falls back to empty history if service unavailable.
 */
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { CONVERSATION_QUERY } from "@/lib/api/queries"
import type { Conversation } from "@/lib/api/types"
import ConversationClient from "./conversation-client"

export default async function AITutorConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  let messages: Conversation["messages"] = []

  try {
    const res = await gql<{ conversation: Conversation }>(
      CONVERSATION_QUERY,
      { id: conversationId },
      token,
    )
    messages = res?.conversation?.messages ?? []
  } catch {
    // Service unavailable — start with empty history
  }

  return (
    <ConversationClient
      conversationId={conversationId}
      initialMessages={messages}
    />
  )
}
