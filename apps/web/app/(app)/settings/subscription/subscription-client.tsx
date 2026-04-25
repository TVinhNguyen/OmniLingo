"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  Crown,
  Check,
  AlertTriangle,
  Sparkles,
  Calendar,
  Receipt,
  Gift,
  Users,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
} from "../../../checkout/actions"
import type { BillingSubscription } from "@/lib/api/types"

interface SubscriptionClientProps {
  subscription: BillingSubscription | null
}

const FEATURES = [
  "Không giới hạn lesson",
  "AI Tutor không giới hạn",
  "Phân tích chi tiết",
  "Tải offline",
  "5 ngôn ngữ cùng lúc",
  "Hỗ trợ ưu tiên",
]

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export default function SubscriptionClient({
  subscription,
}: SubscriptionClientProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleCancel = () => {
    if (!confirm("Bạn chắc chắn muốn huỷ gia hạn? Gói tiếp tục hoạt động đến hết kỳ hiện tại.")) return
    startTransition(async () => {
      setError(null)
      const res = await cancelSubscriptionAction("user_requested")
      if (res && "error" in res && res.error) setError(res.error)
      else router.refresh()
    })
  }

  const handleReactivate = () => {
    startTransition(async () => {
      setError(null)
      const res = await reactivateSubscriptionAction()
      if (res && "error" in res && res.error) setError(res.error)
      else router.refresh()
    })
  }

  const planName = subscription?.planName ?? "OmniLingo Plus"
  const isTrialing = subscription?.state === "trialing"
  const isPastDue = subscription?.state === "past_due"
  const willCancel = subscription?.cancelAtPeriodEnd === true
  const periodEnd = subscription?.currentPeriodEnd ?? null
  const periodStart = subscription?.currentPeriodStart ?? null

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/settings" className="hover:text-foreground">
            Cài đặt
          </Link>
          <span>/</span>
          <span>Gói & Thanh toán</span>
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Gói & Thanh toán</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Current plan card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden p-6 shadow-ambient">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <Badge className="bg-primary">{planName}</Badge>
                {subscription ? (
                  isTrialing ? (
                    <Badge variant="outline" className="border-accent text-accent">
                      Đang dùng thử
                    </Badge>
                  ) : isPastDue ? (
                    <Badge variant="destructive">Quá hạn</Badge>
                  ) : willCancel ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      Sẽ huỷ
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-success text-success">
                      Đang hoạt động
                    </Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Free
                  </Badge>
                )}
              </div>
              {!subscription && (
                <h2 className="mt-3 text-3xl font-bold">
                  Miễn phí
                </h2>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {subscription
                  ? willCancel
                    ? <>Gói sẽ hết hạn vào <strong>{fmtDate(periodEnd)}</strong></>
                    : <>Gia hạn tự động vào <strong>{fmtDate(periodEnd)}</strong></>
                  : <>Bạn đang dùng gói Free.</>}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/pricing">
                    {subscription ? "Nâng lên Pro" : "Xem các gói"}
                  </Link>
                </Button>
                {subscription && !willCancel && (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    disabled={pending}
                    onClick={handleCancel}
                  >
                    Huỷ gói
                  </Button>
                )}
                {subscription && willCancel && (
                  <Button variant="outline" disabled={pending} onClick={handleReactivate}>
                    Kích hoạt lại
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {subscription && (
                <div className="rounded-xl bg-surface-low p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kỳ hạn hiện tại</span>
                  </div>
                  <div className="text-sm font-medium">
                    {fmtDate(periodStart)} - {fmtDate(periodEnd)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/billing/gift"
          className="group rounded-2xl border border-border bg-card/50 p-4 shadow-ambient transition-all hover:shadow-hover hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Tặng gói</div>
                <p className="text-xs text-muted-foreground">Cho bạn bè</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>
        <Link
          href="/billing/referral"
          className="group rounded-2xl border border-border bg-card/50 p-4 shadow-ambient transition-all hover:shadow-hover hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Giới thiệu</div>
                <p className="text-xs text-muted-foreground">Nhận thưởng</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Invoice history pointer (full table lives in /settings/billing) */}
        <Card className="p-6 shadow-ambient">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Lịch sử hoá đơn</h3>
                <p className="text-sm text-muted-foreground">
                  Hoá đơn, phương thức thanh toán và hoá đơn VAT được quản lý tại trang Thanh toán.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings/billing">
                Xem hoá đơn
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-warning/30 bg-warning/5 p-5 shadow-ambient">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div className="text-xs text-foreground">
                <strong>Chính sách hoàn tiền:</strong> Hoàn 100% trong 7 ngày đầu. Huỷ bất cứ
                lúc nào. Quyền lợi tiếp tục đến hết kỳ đã thanh toán.
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-primary/30 p-5 shadow-ambient">
            <Sparkles className="absolute right-3 top-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 text-sm font-semibold">Nâng lên Pro</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              +Live class 1-1, Writing review bởi giáo viên, Certificate
            </p>
            <Button size="sm" className="w-full" asChild>
              <Link href="/pricing">Xem chi tiết Pro</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
