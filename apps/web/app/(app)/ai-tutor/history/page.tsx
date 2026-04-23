/**
 * AI Tutor History RSC Page — fetches real conversations from BFF, renders client UI.
 */
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { CONVERSATIONS_QUERY } from "@/lib/api/queries";
import type { ConversationSummary } from "@/lib/api/types";
import AITutorHistoryClient from "./history-client";

export default async function AITutorHistoryPage() {
  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  let conversations: ConversationSummary[] = [];

  try {
    const res = await gql<{ conversations: ConversationSummary[] }>(
      CONVERSATIONS_QUERY,
      {},
      token,
    );
    if (res?.conversations?.length) conversations = res.conversations;
  } catch {
    // AI tutor unavailable — show mock data
  }

  return (
    <AITutorHistoryClient
      initialConversations={conversations.map((c) => ({
        id: c.id,
        lastMessage: c.lastMessage,
        messageCount: c.messageCount,
      }))}
    />
  );
}
