/**
 * Deck Detail RSC Page — fetches deck metadata + cards from BFF, renders DeckClient.
 * Falls back to empty mock if BFF is unavailable.
 */
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { DECK_QUERY, DECK_CARDS_QUERY } from "@/lib/api/queries";
import type { DeckDetail, DeckCard } from "@/lib/api/types";
import DeckClient from "./deck-client";

const MOCK_DECK: DeckDetail = {
  id: "__mock__",
  name: "Deck (offline)",
  cardCount: 0,
  dueCount: 0,
  masteredCount: 0,
};

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  let deck = { ...MOCK_DECK, id };
  let cards: DeckCard[] = [];

  try {
    const [deckRes, cardsRes] = await Promise.all([
      gql<{ deck: DeckDetail }>(DECK_QUERY, { id }, token),
      gql<{ deckCards: DeckCard[] }>(DECK_CARDS_QUERY, { deckId: id }, token),
    ]);
    if (deckRes?.deck) deck = deckRes.deck;
    if (cardsRes?.deckCards?.length) cards = cardsRes.deckCards;
  } catch {
    // BFF unavailable — show skeleton data
  }

  return <DeckClient deck={deck} cards={cards} />;
}
