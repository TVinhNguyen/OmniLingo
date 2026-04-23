"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { gql } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { ADD_CARD_MUTATION, REVIEW_CARD_MUTATION } from "@/lib/api/mutations";

export async function addCardAction(formData: FormData): Promise<void> {
  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  const deckId  = String(formData.get("deckId")  ?? "").trim();
  const lemma   = String(formData.get("lemma")   ?? "").trim();
  const meaning = String(formData.get("meaning") ?? "").trim();
  const ipa     = String(formData.get("ipa")     ?? "").trim() || undefined;
  const pos     = String(formData.get("pos")     ?? "").trim() || undefined;

  if (!deckId || !lemma || !meaning) {
    redirect(`/practice/vocabulary/decks/${deckId}?error=Thiếu thông tin thẻ`);
  }

  await gql(ADD_CARD_MUTATION, { deckId, lemma, meaning, ipa, pos }, token);
  revalidatePath(`/practice/vocabulary/decks/${deckId}`);
  redirect(`/practice/vocabulary/decks/${deckId}?added=1`);
}

/**
 * reviewCardAction — submits an SRS review rating for a card.
 * rating: 1=again 2=hard 3=good 4=easy (matches FSRS spec)
 * Returns { error? } on failure, void on success.
 */
export async function reviewCardAction(
  itemId: string,
  rating: 1 | 2 | 3 | 4,
): Promise<{ error: string } | undefined> {
  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập" };

  try {
    await gql(REVIEW_CARD_MUTATION, { itemId, rating }, token);
    return undefined; // success
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ghi nhận đánh giá thất bại";
    return { error: msg };
  }
}
