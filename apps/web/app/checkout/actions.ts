"use server"

import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import {
  CREATE_CHECKOUT_SESSION_MUTATION,
  CANCEL_SUBSCRIPTION_MUTATION,
  REACTIVATE_SUBSCRIPTION_MUTATION,
} from "@/lib/api/mutations"
import type { CheckoutSessionResult } from "@/lib/api/types"

/**
 * Initiates a checkout session and redirects to the provider page (Stripe/VNPay).
 * Called from the checkout confirm step.
 */
export async function createCheckoutSessionAction(
  planId: string,
  period: "month" | "year",
  provider: string,
): Promise<{ error: string } | never> {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  const successUrl = `${origin}/checkout/success`
  const cancelUrl  = `${origin}/checkout/cancel`

  try {
    const res = await gql<{ createCheckoutSession: CheckoutSessionResult }>(
      CREATE_CHECKOUT_SESSION_MUTATION,
      { planId, period, provider, successUrl, cancelUrl },
      token,
    )
    const checkoutUrl = res?.createCheckoutSession?.checkoutUrl
    if (!checkoutUrl) return { error: "Không nhận được URL thanh toán" }
    redirect(checkoutUrl)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Lỗi tạo phiên thanh toán"
    return { error: msg }
  }
}

export async function cancelSubscriptionAction(reason?: string) {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    await gql(CANCEL_SUBSCRIPTION_MUTATION, { reason: reason ?? null }, token)
    return { ok: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Huỷ thất bại" }
  }
}

export async function reactivateSubscriptionAction() {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }
  try {
    await gql(REACTIVATE_SUBSCRIPTION_MUTATION, {}, token)
    return { ok: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Kích hoạt lại thất bại" }
  }
}
