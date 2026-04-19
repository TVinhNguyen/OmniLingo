import Link from "next/link";
import { redirect } from "next/navigation";
import { gql } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { DECK_QUERY, DECK_CARDS_QUERY } from "@/lib/api/queries";
import type { Deck, DeckCard } from "@/lib/api/types";
import { addWordToDeckAction } from "./actions";

export default async function DeckDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ added?: string; missing?: string; error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const token = await getAccessToken();
  if (!token) redirect(`/sign-in?next=/practice/vocabulary/decks/${id}`);

  const [{ deck }, { deckCards }] = await Promise.all([
    gql<{ deck: Deck }>(DECK_QUERY, { id }, token),
    gql<{ deckCards: DeckCard[] }>(DECK_CARDS_QUERY, { deckId: id }, token),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck</p>
          <h1 className="text-3xl font-bold">{deck.name}</h1>
          <p className="text-sm text-muted-foreground">
            {deck.language || "en"} · {deck.cardCount} cards
          </p>
        </div>
        <Link href="/practice/vocabulary" className="text-sm text-accent hover:underline">
          ← Quay lại danh sách deck
        </Link>
      </div>

      {(sp.added || sp.missing) && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          Đã thêm: {sp.added ?? "0"} từ · Không tìm thấy: {sp.missing ?? "0"} từ
        </div>
      )}
      {sp.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {sp.error}
        </div>
      )}

      <form action={addWordToDeckAction} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-end">
        <input type="hidden" name="deckId" value={id} />
        <input type="hidden" name="language" value={deck.language ?? "en"} />
        <div className="flex-1">
          <label htmlFor="lemma" className="mb-1 block text-sm font-medium">
            Thêm từ vào deck
          </label>
          <input
            id="lemma"
            name="lemma"
            required
            placeholder="Nhập từ (vd: afraid)"
            className="w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Thêm từ
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3">Từ</th>
              <th className="px-4 py-3">Nghĩa</th>
              <th className="px-4 py-3">IPA</th>
              <th className="px-4 py-3">POS</th>
            </tr>
          </thead>
          <tbody>
            {deckCards.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Deck chưa có từ nào.
                </td>
              </tr>
            ) : (
              deckCards.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{c.lemma}</td>
                  <td className="px-4 py-3">{c.meaning || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.ipa || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.pos || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
