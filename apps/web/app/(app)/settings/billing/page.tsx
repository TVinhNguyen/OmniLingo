/**
 * Billing settings RSC — real subscription + invoice data from BFF.
 * Falls back to empty state when billing-service unavailable.
 */
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { MY_SUBSCRIPTION_QUERY, BILLING_HISTORY_QUERY } from "@/lib/api/queries"
import type { BillingSubscription, InvoicePage } from "@/lib/api/types"
import BillingClient from "./billing-client"

export default async function BillingPage() {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  let subscription: BillingSubscription | null = null
  let invoicePage: InvoicePage = { items: [], nextCursor: null }

  try {
    const [subRes, invRes] = await Promise.all([
      gql<{ mySubscription: BillingSubscription | null }>(MY_SUBSCRIPTION_QUERY, {}, token),
      gql<{ billingHistory: InvoicePage }>(BILLING_HISTORY_QUERY, { limit: 10 }, token),
    ])
    subscription  = subRes?.mySubscription ?? null
    invoicePage   = invRes?.billingHistory ?? { items: [], nextCursor: null }
  } catch {
    // billing-service unavailable
  }

  return <BillingClient subscription={subscription} invoices={invoicePage.items} />
}
