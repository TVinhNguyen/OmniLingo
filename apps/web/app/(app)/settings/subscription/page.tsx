"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Crown,
  Check,
  Download,
  CreditCard,
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
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { id: "INV-2026-004", date: "15/04/2026", amount: "199.000đ", plan: "Plus - Tháng", status: "paid" },
  { id: "INV-2026-003", date: "15/03/2026", amount: "199.000đ", plan: "Plus - Tháng", status: "paid" },
  { id: "INV-2026-002", date: "15/02/2026", amount: "199.000đ", plan: "Plus - Tháng", status: "paid" },
  { id: "INV-2026-001", date: "15/01/2026", amount: "199.000đ", plan: "Plus - Tháng", status: "paid" },
]

export default function SubscriptionPage() {
  const used = 42
  const limit = 100

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

      {/* Current plan card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden p-6 shadow-ambient">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <Badge className="bg-primary">OmniLingo Plus</Badge>
                <Badge variant="outline" className="border-success text-success">
                  Đang hoạt động
                </Badge>
              </div>
              <h2 className="mt-3 text-3xl font-bold">
                199.000đ<span className="text-lg font-normal text-muted-foreground">/tháng</span>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gia hạn tự động vào <strong>15/05/2026</strong>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  "Không giới hạn lesson",
                  "AI Tutor không giới hạn",
                  "Phân tích chi tiết",
                  "Tải offline",
                  "5 ngôn ngữ cùng lúc",
                  "Hỗ trợ ưu tiên",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/pricing">Nâng lên Pro</Link>
                </Button>
                <Button variant="outline">Thay đổi chu kỳ</Button>
                <Button variant="ghost" className="text-muted-foreground">
                  Huỷ gói
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-surface-low p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Tutor tháng này</span>
                  <span className="font-medium">
                    {used}/{limit}
                  </span>
                </div>
                <Progress value={(used / limit) * 100} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground">Reset vào ngày 15 hàng tháng</p>
              </div>
              <div className="rounded-xl bg-surface-low p-4">
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Kỳ hạn hiện tại</span>
                </div>
                <div className="text-sm font-medium">15/04/2026 - 15/05/2026</div>
              </div>
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
        {/* Invoices */}
        <Card className="p-6 shadow-ambient">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Lịch sử hoá đơn</h3>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="mr-2 h-3.5 w-3.5" />
              Xuất tất cả
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.plan}</TableCell>
                  <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" aria-label="Tải hoá đơn">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Payment method */}
        <div className="space-y-4">
          <Card className="p-5 shadow-ambient">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Phương thức thanh toán</h3>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-accent/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">VISA</span>
                <Badge variant="outline" className="text-[10px]">
                  Mặc định
                </Badge>
              </div>
              <div className="mt-6 font-mono text-lg tracking-widest">•••• •••• •••• 4242</div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>NGUYEN VAN A</span>
                <span>12/27</span>
              </div>
            </div>
            <Button variant="outline" className="mt-3 w-full bg-transparent">
              Thêm phương thức
            </Button>
          </Card>

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
