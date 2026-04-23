"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import confetti from "canvas-confetti"
import {
  Bot,
  Check,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  HelpCircle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const order = {
  plan: "Pro",
  cycle: "yearly" as const,
  amount: "$199",
  nextBilling: "19 tháng 4, 2027",
  invoiceId: "INV-2026-0419-001",
  paymentMethod: "Visa ****4242",
}

function SuccessInner() {
  const params = useSearchParams()
  const sessionId = params.get("session_id") ?? "cs_test_a1b2c3d4e5f6"

  useEffect(() => {
    // Fire confetti
    const duration = 2500
    const end = Date.now() + duration
    const colors = ["#5352a5", "#a19ff9", "#702ae1", "#d56ba6"]
    ;(function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-soft py-16 px-4">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Icon */}
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
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
            Thanh toán thành công!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Chào mừng bạn đến với OmniLingo <span className="font-semibold text-foreground">{order.plan}</span>
          </p>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-ambient">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Chi tiết đơn hàng</h2>
              <dl className="space-y-3 text-sm">
                <Row label="Gói" value={order.plan} />
                <Row label="Chu kỳ" value={order.cycle === "yearly" ? "Hàng năm" : "Hàng tháng"} />
                <Row label="Số tiền" value={order.amount} valueClassName="font-mono font-bold text-lg" />
                <Row label="Phương thức" value={order.paymentMethod} valueClassName="font-mono" />
                <Row label="Mã hoá đơn" value={order.invoiceId} valueClassName="font-mono text-xs" />
                <Row label="Chu kỳ tiếp theo" value={order.nextBilling} />
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next steps */}
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
                  { icon: GraduationCap, title: "Bắt đầu test prep", desc: "IELTS, TOEIC, JLPT mock exams", href: "/test-prep" },
                  { icon: Users, title: "Tham gia community", desc: "Kết nối với học viên toàn cầu", href: "/community" },
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

        {/* Footer buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
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

        <p className="text-center text-xs text-muted-foreground font-mono">
          Session ID: {sessionId}
        </p>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-soft" />}>
      <SuccessInner />
    </Suspense>
  )
}
