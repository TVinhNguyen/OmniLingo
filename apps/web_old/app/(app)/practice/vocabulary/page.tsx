/**
 * Vocabulary page — Server Component wrapper.
 *
 * Fetches real deck list from web-bff and passes it down to the
 * fully-interactive client component. Falls back to mock data when
 * BFF is unavailable (dev / offline / new user with 0 decks).
 *
 * Pattern: RSC fetches → passes props → Client Component renders with real data.
 */

import { fetchMyDecks } from "./actions";
import VocabularyPage from "./vocabulary-client";
import type { Deck } from "./vocabulary-client";

// Map BFF Deck (simple shape) to the richer client Deck type
// BFF returns: { id, name, cardCount, dueCount, masteredCount }
// Client expects: { id, name, emoji, language, total, status, color, description }
function mapBffDeck(bffDeck: {
  id: string;
  name: string;
  cardCount: number;
  dueCount: number;
  masteredCount: number;
}): Deck {
  // Derive color deterministically from id (cycles through palette)
  const COLORS = [
    "from-[#5352a5] to-[#a19ff9]",
    "from-[#702ae1] to-[#983772]",
    "from-[#983772] to-[#a19ff9]",
    "from-[#a19ff9] to-[#5352a5]",
  ];
  const colorIdx =
    bffDeck.id
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;

  const newCards = Math.max(
    0,
    bffDeck.cardCount - bffDeck.masteredCount - bffDeck.dueCount,
  );

  return {
    id: bffDeck.id,
    name: bffDeck.name,
    emoji: "📚",
    language: "—",
    total: bffDeck.cardCount,
    status: {
      new: newCards,
      learning: 0,
      due: bffDeck.dueCount,
      mastered: bffDeck.masteredCount,
    },
    color: COLORS[colorIdx],
    description: `${bffDeck.cardCount} thẻ · ${bffDeck.dueCount} tới hạn · ${bffDeck.masteredCount} đã thuộc`,
  };
}

export default async function VocabularyServerPage() {
  // Fetch real decks from BFF (returns [] on error / not authenticated)
  const rawDecks = await fetchMyDecks();
  const decks: Deck[] = rawDecks.map(mapBffDeck);

  return <VocabularyPage initialDecks={decks} />;
}
