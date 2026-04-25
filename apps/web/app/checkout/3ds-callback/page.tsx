/**
 * 3DS callback RSC — entry point for PSP redirects (Stripe/VNPay) during
 * the 3-D Secure challenge. Polls checkoutStatus server-side, then routes
 * the user to the final success/failure page.
 */
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { CHECKOUT_STATUS_QUERY } from "@/lib/api/queries"
import type { CheckoutStatus } from "@/lib/api/types"
import ThreeDSPendingClient from "./pending-client"
import ThreeDSFailedClient from "./failed-client"

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

export default async function ThreeDSCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; status?: string }>
}) {
  const { session_id, status: legacyStatus } = await searchParams

  // Legacy/test path: PSP redirected here with ?status=failed and no session_id
  if (!session_id) {
    if (legacyStatus === "failed") {
      return <ThreeDSFailedClient errorMessage={null} />
    }
    redirect("/pricing")
  }

  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  const status = await resolveStatus(session_id, token).catch(() => null)

  if (status?.state === "succeeded") {
    redirect(`/checkout/success?session_id=${session_id}`)
  }

  if (status?.state === "failed") {
    return <ThreeDSFailedClient errorMessage={status.errorMessage ?? null} />
  }

  // Still pending after 5 polls — show waiting UI; client will redirect when settled.
  return <ThreeDSPendingClient sessionId={session_id} />
}
