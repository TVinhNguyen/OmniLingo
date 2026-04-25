"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import confetti from "canvas-confetti"
import {
  Bot,
  Check,
  CheckCircle2,
  Download,
  GraduationCap,
  HelpCircle,
  Users,
  XCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CheckoutStatus } from "@/lib/api/types"

interface SuccessClientProps {
  sessionId: string
  status: CheckoutStatus | null
}

export default function SuccessClient({ sessionId, status }: SuccessClientProps) {
  const succeeded = !status || status.state === "succeeded"
  const failed    = status?.state === "failed"

  useEffect(() => {
    if (!succeeded || failed) return
    const duration = 2500
    const end = Date.now() + duration
    const colors = ["#5352a5", "#a19ff9", "#702ae1", "#d56ba6"]
    ;(function frame() {
      confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0, y: 0.5 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.5 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [succeeded, failed])

  if (failed) {
    return (
      <div className="min-h-screen bg-gradient-soft py-16 px-4">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-16 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold">Thanh toán thất bại</h1>
          <p className="text-muted-foreground">{status?.errorMessage ?? "Đã xảy ra lỗi trong quá trình thanh toán."}</p>
          <div className="flex justify-center gap-3">
            <Button asChild><Link href="/checkout">Thử lại</Link></Button>
            <Button asChild variant="outline"><Link href="/contact"><HelpCircle className="mr-2 size-4" />Hỗ trợ</Link></Button>
          </div>
          <p className="font-mono text-xs text-muted-foreground">Session: {sessionId}</p>
        </div>
      </div>
    )
  }

  if (status?.state === "pending") {
    return (
      <div className="min-h-screen bg-gradient-soft py-16 px-4">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-primary" />
          <h1 className="text-xl font-semibold">Đang xử lý thanh toán…</h1>
          <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát. Trang sẽ cập nhật tự động.</p>
          <p className="font-mono text-xs text-muted-foreground">Session: {sessionId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-16 px-4">
      <div className="mx-auto max-w-xl space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="mx-auto flex size-24 items-center justify-center rounded-full bg-success/10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex size-20 items-center justify-center rounded-full bg-success text-white shadow-hover"
          >
            <CheckCircle2 className="size-12" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight">Thanh toán thành công!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Chào mừng bạn đến với OmniLingo{" "}
            <span className="font-semibold text-foreground capitalize">
              {status?.planId?.replace(/_monthly|_yearly/, "") ?? "Plus"}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-ambient">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Chi tiết đơn hàng</h2>
              <dl className="space-y-3 text-sm">
                {status?.planId && <Row label="Gói" value={status.planId} />}
                {status?.activatedAt && (
                  <Row label="Kích hoạt lúc" value={new Date(status.activatedAt).toLocaleString("vi-VN")} />
                )}
                <Row label="Mã phiên" value={sessionId} valueClassName="font-mono text-xs" />
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-ambient">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Bước tiếp theo</h2>
              <div className="space-y-2">
                {[
                  { icon: Bot, title: "Khám phá AI Tutor", desc: "Trò chuyện không giới hạn", href: "/ai-tutor" },
                  { icon: GraduationCap, title: "Bắt đầu học", desc: "Tiếp tục lộ trình học tập của bạn", href: "/learn" },
                  { icon: Users, title: "Tham gia cộng đồng", desc: "Kết nối với học viên toàn cầu", href: "/community" },
                ].map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-surface-low"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <Check className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="space-y-3">
          <Button asChild size="lg" className="w-full h-12 bg-gradient-primary">
            <Link href="/dashboard">Về Dashboard</Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 h-11">
              <Download className="mr-2 size-4" /> Tải hoá đơn PDF
            </Button>
            <Button variant="ghost" size="lg" className="flex-1 h-11" asChild>
              <Link href="/contact">
                <HelpCircle className="mr-2 size-4" /> Cần giúp?
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={valueClassName ?? "font-medium"}>{value}</dd>
    </div>
  )
}
