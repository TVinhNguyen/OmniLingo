/**
 * Checkout success RSC — polls checkoutStatus until succeeded or failed.
 * Fallback: if BFF unavailable, shows optimistic success view.
 */
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { CHECKOUT_STATUS_QUERY } from "@/lib/api/queries"
import type { CheckoutStatus } from "@/lib/api/types"
import SuccessClient from "./success-client"

async function resolveStatus(sessionId: string, token: string): Promise<CheckoutStatus | null> {
  for (let i = 0; i < 5; i++) {
    const res = await gql<{ checkoutStatus: CheckoutStatus }>(
      CHECKOUT_STATUS_QUERY,
      { sessionId },
      token,
    ).catch(() => null)
    if (!res?.checkoutStatus) break
    const { state } = res.checkoutStatus
    if (state === "succeeded" || state === "failed") return res.checkoutStatus
    await new Promise((r) => setTimeout(r, 2000))
  }
  return null
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) redirect("/pricing")

  const token = await getAccessToken()
  let status: CheckoutStatus | null = null

  if (token) {
    status = await resolveStatus(session_id, token).catch(() => null)
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-soft" />}>
      <SuccessClient sessionId={session_id} status={status} />
    </Suspense>
  )
}
