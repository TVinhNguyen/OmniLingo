"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Download, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cancelSubscriptionAction } from "../../../checkout/actions"
import type { BillingSubscription, Invoice } from "@/lib/api/types"

interface BillingClientProps {
  subscription: BillingSubscription | null
  invoices: Invoice[]
}

export default function BillingClient({ subscription, invoices }: BillingClientProps) {
  const [cancelOpen, setCancelOpen] = useState(false)
  const [, startTransition] = useTransition()

  const handleCancel = () => {
    startTransition(async () => {
      await cancelSubscriptionAction("user_requested")
      setCancelOpen(false)
    })
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

  const fmtAmount = (amount: number, currency: string) => {
    if (currency === "VND") return `${amount.toLocaleString("vi-VN")}đ`
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100)
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/settings"><ArrowLeft className="mr-2 h-4 w-4" />Cài đặt</Link>
      </Button>

      <div>
        <h1 className="font-serif text-3xl font-semibold">Thanh toán & hoá đơn</h1>
        <p className="mt-1 text-muted-foreground">Quản lý gói đăng ký và xem lịch sử hoá đơn</p>
      </div>

      {/* Subscription card */}
      {subscription ? (
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <Badge className="capitalize">{subscription.planName}</Badge>
            {subscription.state === "trialing" && (
              <Badge variant="outline" className="text-accent">Trial</Badge>
            )}
            {subscription.state === "past_due" && (
              <Badge variant="destructive">Quá hạn</Badge>
            )}
            {subscription.cancelAtPeriodEnd && (
              <Badge variant="outline" className="text-muted-foreground">Sẽ huỷ</Badge>
            )}
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {subscription.cancelAtPeriodEnd
              ? `Gói Plus sẽ hết hạn vào ${fmtDate(subscription.currentPeriodEnd)}`
              : `Gia hạn tự động vào ${fmtDate(subscription.currentPeriodEnd)}`}
          </div>

          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link href="/settings/subscription">Quản lý gói</Link>
            </Button>
            {!subscription.cancelAtPeriodEnd && (
              <Button variant="outline" onClick={() => setCancelOpen(true)}>
                Huỷ gia hạn
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <p className="text-muted-foreground">Bạn đang dùng gói Free.</p>
          <Button asChild className="mt-4">
            <Link href="/checkout">Nâng cấp Plus</Link>
          </Button>
        </div>
      )}

      {/* Payment methods — managed by Stripe Portal */}
      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Phương thức thanh toán</h2>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-low p-4">
          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-surface-lowest">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-muted-foreground">
              Quản lý qua cổng thanh toán bảo mật
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings/subscription">Cập nhật</Link>
          </Button>
        </div>
      </div>

      {/* Invoice history */}
      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h2 className="mb-4 font-serif text-xl font-semibold">Lịch sử hoá đơn</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có hoá đơn nào.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-low">
                <tr>
                  <th className="p-3 text-left font-semibold">Mô tả</th>
                  <th className="p-3 text-left font-semibold">Ngày</th>
                  <th className="p-3 text-right font-semibold">Số tiền</th>
                  <th className="p-3 text-left font-semibold">Trạng thái</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs">{inv.description || inv.id}</td>
                    <td className="p-3 text-muted-foreground">
                      {inv.paidAt ? fmtDate(inv.paidAt) : "—"}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {fmtAmount(inv.amount, inv.currency)}
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="bg-success/15 text-success">
                        <Check className="mr-1 h-3 w-3" />
                        Đã thanh toán
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {inv.pdfUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={inv.pdfUrl} target="_blank" rel="noreferrer">
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel confirm dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Huỷ gói Plus?</DialogTitle>
            <DialogDescription>
              Bạn vẫn được dùng Plus đến hết kỳ đã trả. Sau đó tài khoản sẽ về Free.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Giữ lại</Button>
            <Button variant="destructive" onClick={handleCancel}>Xác nhận huỷ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
