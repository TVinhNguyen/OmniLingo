/**
 * Learn Mode RSC — fetches deck cards from BFF and passes to client state machine.
 * Cards are ordered: new → learning → mastered (BFF returns in insertion order).
 */
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { DECK_QUERY, DECK_CARDS_QUERY } from "@/lib/api/queries"
import type { DeckCard, DeckDetail } from "@/lib/api/types"
import LearnClient from "./learn-client"

export default async function LearnModePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  let cards: DeckCard[] = []
  let deckName = "Learn Mode"

  try {
    const [deckRes, cardsRes] = await Promise.all([
      gql<{ deck: DeckDetail }>(DECK_QUERY, { id }, token),
      gql<{ deckCards: DeckCard[] }>(DECK_CARDS_QUERY, { deckId: id }, token),
    ])
    if (deckRes?.deck?.name) deckName = deckRes.deck.name
    // Prioritise new cards for learn sessions
    const all = cardsRes?.deckCards ?? []
    cards = [
      ...all.filter((c) => c.status === "new"),
      ...all.filter((c) => c.status !== "new"),
    ]
  } catch {
    // BFF unavailable — LearnClient shows empty state with add-card CTA
  }

  return <LearnClient deckId={id} deckName={deckName} cards={cards} />
}
