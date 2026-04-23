"use client"

import Link from "next/link"
import { CreditCard, Download, Plus, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const INVOICES = [
  { id: "INV-2026-003", date: "01/03/2026", amount: 12.99, status: "paid" },
  { id: "INV-2026-002", date: "01/02/2026", amount: 12.99, status: "paid" },
  { id: "INV-2026-001", date: "01/01/2026", amount: 12.99, status: "paid" },
  { id: "INV-2025-012", date: "01/12/2025", amount: 12.99, status: "paid" },
]

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/settings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cài đặt
        </Link>
      </Button>

      <div>
        <h1 className="font-serif text-3xl font-semibold">Thanh toán & hóa đơn</h1>
        <p className="mt-1 text-muted-foreground">Quản lý phương thức thanh toán và xem hóa đơn</p>
      </div>

      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-6 shadow-ambient">
        <Badge>Premium</Badge>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl font-semibold">$12.99</span>
          <span className="text-muted-foreground">/tháng</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Gia hạn tự động vào <span className="font-semibold text-foreground">01/04/2026</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href="/settings/subscription">Quản lý gói</Link>
          </Button>
          <Button variant="outline">Huỷ gia hạn</Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Phương thức thanh toán</h2>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Thêm thẻ
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-2xl border-2 border-primary bg-primary/5 p-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-foreground text-primary-foreground">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Visa •••• 4242</div>
              <div className="text-sm text-muted-foreground">Hết hạn 12/2027</div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Mặc định
            </Badge>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-low p-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-surface-lowest">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Mastercard •••• 8888</div>
              <div className="text-sm text-muted-foreground">Hết hạn 08/2026</div>
            </div>
            <Button variant="ghost" size="sm">
              Đặt mặc định
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h2 className="mb-4 font-serif text-xl font-semibold">Lịch sử hóa đơn</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-low">
              <tr>
                <th className="p-3 text-left font-semibold">Mã</th>
                <th className="p-3 text-left font-semibold">Ngày</th>
                <th className="p-3 text-right font-semibold">Số tiền</th>
                <th className="p-3 text-left font-semibold">Trạng thái</th>
                <th className="p-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{inv.id}</td>
                  <td className="p-3 text-muted-foreground">{inv.date}</td>
                  <td className="p-3 text-right tabular-nums">${inv.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="bg-success/15 text-success">
                      Đã thanh toán
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
