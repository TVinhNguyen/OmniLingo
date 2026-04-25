/**
 * Review RSC Page — fetches deck cards + due SRS items from BFF,
 * filters cards to only those that are due, renders ReviewClient.
 *
 * Strategy:
 *   1. GET deckCards(deckId)  — all cards in deck (card id + lemma/meaning/ipa)
 *   2. GET dueCards(50)       — SRS item_ids due for this user
 *   3. Intersect: only cards whose id is in dueCard item_ids
 *   4. If no due cards → pass all cards (allow free review session)
 */
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { DECK_QUERY, DECK_CARDS_QUERY, DUE_CARDS_QUERY } from "@/lib/api/queries";
import type { DeckCard, DeckDetail, DueCard } from "@/lib/api/types";
import ReviewClient from "./review-client";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  let cards: DeckCard[] = [];
  let deckName = "Ôn tập";

  try {
    const [deckRes, cardsRes, dueRes] = await Promise.all([
      gql<{ deck: DeckDetail }>(DECK_QUERY, { id }, token),
      gql<{ deckCards: DeckCard[] }>(DECK_CARDS_QUERY, { deckId: id }, token),
      gql<{ dueCards: DueCard[] }>(DUE_CARDS_QUERY, { limit: 50 }, token),
    ]);

    if (deckRes?.deck?.name) deckName = deckRes.deck.name;

    const allCards = cardsRes?.deckCards ?? [];
    const dueIds   = new Set((dueRes?.dueCards ?? []).map((d) => d.itemId));

    // Use due-only cards if SRS data available; otherwise all cards for free review
    cards = dueIds.size > 0
      ? allCards.filter((c) => dueIds.has(c.id))
      : allCards;
  } catch {
    // BFF unavailable — ReviewClient will show empty state
  }

  return <ReviewClient deckId={id} deckName={deckName} cards={cards} />;
}
