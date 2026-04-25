/**
 * Subscription settings RSC — loads real subscription data from BFF.
 * Invoice history is rendered on /settings/billing (D3 split).
 */
import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { MY_SUBSCRIPTION_QUERY } from "@/lib/api/queries"
import type { BillingSubscription } from "@/lib/api/types"
import SubscriptionClient from "./subscription-client"

export default async function SubscriptionPage() {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  const subRes = await gql<{ mySubscription: BillingSubscription | null }>(
    MY_SUBSCRIPTION_QUERY,
    {},
    token,
  ).catch(() => null)
  const subscription = subRes?.mySubscription ?? null

  return <SubscriptionClient subscription={subscription} />
}
