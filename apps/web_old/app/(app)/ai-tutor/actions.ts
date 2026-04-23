"use server";

/**
 * AI Tutor Server Actions.
 * sendMessageAction: gọi TUTOR_CHAT_MUTATION → web-bff → ai-tutor-service.
 * explainAction: gọi EXPLAIN_MUTATION cho quick word explanations.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { TUTOR_CHAT_MUTATION, EXPLAIN_MUTATION } from "@/lib/api/mutations";
import type { ChatResult, ExplainResult } from "@/lib/api/types";

export interface SendMessageState {
  conversationId?: string;
  reply?: string;
  quotaRemaining?: number;
  error?: string;
}

export async function sendMessageAction(
  prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const message = formData.get("message") as string;
  const conversationId = (formData.get("conversationId") as string) || undefined;
  const language = (formData.get("language") as string) || "en";

  if (!message?.trim()) return { error: "Tin nhắn không được để trống." };

  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return { error: "Vui lòng đăng nhập để dùng AI Tutor." };

    const data = await gql<{ tutorChat: ChatResult }>(
      TUTOR_CHAT_MUTATION,
      { message: message.trim(), conversationId: conversationId ?? null, language },
      token,
    );

    return {
      conversationId: data.tutorChat.conversationId,
      reply: data.tutorChat.message.content,
      quotaRemaining: data.tutorChat.quotaRemaining,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gửi tin nhắn thất bại.";
    if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate")) {
      return { error: "Bạn đã dùng hết lượt chat hôm nay. Nâng cấp gói để tiếp tục." };
    }
    return { error: msg };
  }
}

export interface ExplainState {
  explanation?: string;
  examples?: string[];
  error?: string;
}

export async function explainAction(
  _prev: ExplainState,
  formData: FormData,
): Promise<ExplainState> {
  const text = formData.get("text") as string;
  const context = (formData.get("context") as string) || undefined;
  const language = (formData.get("language") as string) || "en";

  if (!text?.trim()) return { error: "Vui lòng nhập từ cần giải thích." };

  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return { error: "Vui lòng đăng nhập." };

    const data = await gql<{ explain: ExplainResult }>(
      EXPLAIN_MUTATION,
      { text: text.trim(), context: context ?? null, language },
      token,
    );

    return {
      explanation: data.explain.explanation,
      examples: data.explain.examples,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Không thể giải thích từ này." };
  }
}
