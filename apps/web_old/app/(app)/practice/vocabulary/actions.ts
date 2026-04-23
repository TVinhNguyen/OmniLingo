"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { CREATE_DECK_MUTATION } from "@/lib/api/mutations";
import type { Deck } from "@/lib/api/types";
import { MY_DECKS_QUERY } from "@/lib/api/queries";

// ─── Fetch real decks from BFF ────────────────────────────────────────────────

export async function fetchMyDecks(): Promise<Deck[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const data = await gql<{ myDecks: Deck[] }>(MY_DECKS_QUERY, {}, token);
    return data.myDecks;
  } catch {
    return [];
  }
}

// ─── Create deck Server Action ────────────────────────────────────────────────

export interface CreateDeckState {
  error?: string;
  success?: boolean;
  deck?: Deck;
}

export async function createDeckAction(
  _prev: CreateDeckState,
  formData: FormData,
): Promise<CreateDeckState> {
  const name = (formData.get("name") as string)?.trim();
  const language = (formData.get("language") as string) || "ja";

  if (!name) return { error: "Vui lòng nhập tên deck." };

  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập." };

  try {
    const data = await gql<{ createDeck: Deck }>(
      CREATE_DECK_MUTATION,
      { name, language },
      token,
    );
    revalidatePath("/practice/vocabulary");
    return { success: true, deck: data.createDeck };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Tạo deck thất bại." };
  }
}
