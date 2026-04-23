"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { gql } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { ADD_CARD_MUTATION } from "@/lib/api/mutations";
import { SEARCH_WORDS_QUERY } from "@/lib/api/queries";
import type { VocabWord } from "@/lib/api/types";

export async function addWordToDeckAction(formData: FormData): Promise<void> {
  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  const deckId = String(formData.get("deckId") ?? "");
  const language = String(formData.get("language") ?? "en");
  const lemma = String(formData.get("lemma") ?? "").trim().toLowerCase();

  if (!deckId || !lemma) {
    redirect(`/practice/vocabulary/decks/${deckId}?error=Thi%E1%BA%BFu%20deck%20ho%E1%BA%B7c%20t%E1%BB%AB`);
  }

  const found = await gql<{ searchWords: VocabWord[] }>(
    SEARCH_WORDS_QUERY,
    { query: lemma, language, pageSize: 10 },
    token,
  );

  const exact = found.searchWords.find((w) => w.lemma.toLowerCase() === lemma);
  const picked = exact ?? found.searchWords[0];

  if (!picked) {
    redirect(`/practice/vocabulary/decks/${deckId}?error=Kh%C3%B4ng%20t%C3%ACm%20th%E1%BA%A5y%20t%E1%BB%AB%20${encodeURIComponent(lemma)}`);
  }

  await gql(ADD_CARD_MUTATION, { deckId, wordId: picked.id }, token);
  revalidatePath(`/practice/vocabulary/decks/${deckId}`);
  redirect(`/practice/vocabulary/decks/${deckId}?added=1`);
}
