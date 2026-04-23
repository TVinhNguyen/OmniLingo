"use server";

import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import {
  ENROLL_TRACK_MUTATION,
  RENAME_CONVERSATION_MUTATION,
  DELETE_CONVERSATION_MUTATION,
  DELETE_CARD_MUTATION,
  DELETE_DECK_MUTATION,
  ADD_CARD_FROM_CHAT_MUTATION,
} from "@/lib/api/mutations";

// ─── Enroll Track ──────────────────────────────────────────────────────────────

interface EnrollTrackResult {
  enrollTrack: { trackId: string; ok: boolean };
}

/**
 * enrollTrackAction — create a new learning path for a given language.
 * Called from onboarding and /learn when user manually enrolls.
 */
export async function enrollTrackAction(
  language: string,
  templateId?: string,
): Promise<{ trackId: string; ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { trackId: "", ok: false };
  try {
    const res = await gql<EnrollTrackResult>(
      ENROLL_TRACK_MUTATION,
      { language, templateId },
      token,
    );
    return res?.enrollTrack ?? { trackId: "", ok: false };
  } catch {
    return { trackId: "", ok: false };
  }
}

// ─── Conversation Management ───────────────────────────────────────────────────

/**
 * renameConversationAction — rename an AI tutor conversation.
 */
export async function renameConversationAction(
  id: string,
  title: string,
): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  await gql(RENAME_CONVERSATION_MUTATION, { id, title }, token).catch(() => {});
}

/**
 * deleteConversationAction — delete an AI tutor conversation.
 */
export async function deleteConversationAction(
  id: string,
): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  await gql(DELETE_CONVERSATION_MUTATION, { id }, token).catch(() => {});
}

// ─── Vocabulary Card Management ───────────────────────────────────────────────

/**
 * deleteCardAction — remove a card from a deck.
 */
export async function deleteCardAction(deckId: string, cardId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  await gql(DELETE_CARD_MUTATION, { deckId, cardId }, token).catch(() => {});
}

/**
 * deleteDeckAction — delete an entire deck and all its cards.
 */
export async function deleteDeckAction(deckId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  await gql(DELETE_DECK_MUTATION, { deckId }, token).catch(() => {});
}

/**
 * addCardFromChatAction — save a word/phrase from AI Tutor chat as a flashcard.
 */
export async function addCardFromChatAction(
  deckId: string,
  lemma: string,
  meaning: string,
  ipa?: string,
  pos?: string,
): Promise<{ id: string; lemma: string; meaning: string } | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await gql<{ addCardFromChat: { id: string; lemma: string; meaning: string } }>(
      ADD_CARD_FROM_CHAT_MUTATION,
      { deckId, lemma, meaning, ipa, pos },
      token,
    );
    return res?.addCardFromChat ?? null;
  } catch {
    return null;
  }
}
