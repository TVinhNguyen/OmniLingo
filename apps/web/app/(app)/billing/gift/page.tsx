"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Gift, Check, Calendar, Sparkles, Heart, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const plans = [
  {
    id: "plus",
    name: "Plus",
    desc: "Cho người học nghiêm túc",
    monthly: 9.99,
    yearly: 83.88,
    color: "from-primary to-accent",
    features: ["Ad-free", "Offline downloads", "Progress tracking"],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Tính năng Pro đầy đủ",
    monthly: 14.99,
    yearly: 119.88,
    color: "from-accent to-primary",
    popular: true,
    features: ["Tất cả Plus", "AI Tutor không giới hạn", "Live classes"],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    desc: "Toàn bộ OmniLingo",
    monthly: 29.99,
    yearly: 239.88,
    color: "from-warning to-accent",
    features: ["Tất cả Pro", "1-1 tutoring sessions", "Priority support"],
  },
]

const durations = [
  { months: 1, label: "1 tháng", discount: 0 },
  { months: 3, label: "3 tháng", discount: 5 },
  { months: 6, label: "6 tháng", discount: 10 },
  { months: 12, label: "12 tháng", discount: 20 },
]

export default function GiftPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [duration, setDuration] = useState(3)
  const [recipient, setRecipient] = useState({ email: "", name: "" })
  const [message, setMessage] = useState("")
  const [sendDate, setSendDate] = useState("today")

  const plan = plans.find((p) => p.id === selectedPlan)!
  const dur = durations.find((d) => d.months === duration)!
  const basePrice = plan.monthly * duration
  const discount = basePrice * (dur.discount / 100)
  const total = basePrice - discount

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/billing"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Về billing
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-center text-white shadow-hover"
      >
        <div className="absolute -top-16 -right-16 opacity-20">
          <Gift className="h-56 w-56" />
        </div>
        <div className="relative">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Gift className="h-7 w-7" />
          </div>
          <h1 className="font-sans text-3xl font-bold text-balance">
            Tặng OmniLingo cho người thân
          </h1>
          <p className="mt-2 text-white/90">
            Món quà ý nghĩa cho người bạn yêu thương - mở ra thế giới ngôn ngữ mới
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Step 1: Plan */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <h2 className="text-lg font-semibold">Chọn gói</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                  selectedPlan === p.id
                    ? "bg-surface-lowest shadow-hover ring-2 ring-primary"
                    : "bg-surface-lowest shadow-ambient hover:shadow-hover"
                }`}
              >
                {p.popular && (
                  <Badge className="absolute top-2 right-2 bg-warning text-white">Phổ biến</Badge>
                )}
                <div
                  className={`mb-3 h-8 w-8 rounded-lg bg-gradient-to-br ${p.color}`}
                />
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
                <div className="mt-3 text-xl font-bold">
                  ${p.monthly}
                  <span className="text-xs font-normal text-muted-foreground">/tháng</span>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Step 2: Duration */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <h2 className="text-lg font-semibold">Thời hạn</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {durations.map((d) => {
              const selected = duration === d.months
              const price = plan.monthly * d.months * (1 - d.discount / 100)
              return (
                <button
                  key={d.months}
                  onClick={() => setDuration(d.months)}
                  className={`relative rounded-2xl p-4 text-center transition-all ${
                    selected
                      ? "bg-primary text-primary-foreground shadow-hover"
                      : "bg-surface-lowest shadow-ambient hover:shadow-hover"
                  }`}
                >
                  {d.discount > 0 && (
                    <Badge
                      className={`absolute -top-2 right-2 ${
                        selected ? "bg-warning" : "bg-success text-white"
                      }`}
                    >
                      -{d.discount}%
                    </Badge>
                  )}
                  <div className="font-semibold">{d.label}</div>
                  <div
                    className={`mt-1 text-xs ${
                      selected ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    ${price.toFixed(0)} tổng
                  </div>
                </button>
              )
            })}
          </div>
        </motion.section>

        {/* Step 3: Recipient */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </div>
            <h2 className="text-lg font-semibold">Người nhận</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email người nhận</label>
              <Input
                type="email"
                value={recipient.email}
                onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                placeholder="email@example.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Tên người nhận</label>
              <Input
                value={recipient.name}
                onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                placeholder="Tên người thân"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Lời chúc <span className="text-xs text-muted-foreground">(tối đa 200)</span>
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc bạn hành trình học ngôn ngữ đầy hứng khởi..."
                maxLength={200}
                className="min-h-24 rounded-xl"
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {message.length}/200
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Ngày gửi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSendDate("today")}
                  className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm transition-colors ${
                    sendDate === "today"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface-low"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Gửi ngay
                </button>
                <button
                  onClick={() => setSendDate("schedule")}
                  className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm transition-colors ${
                    sendDate === "schedule"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface-low"
                  }`}
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  Hẹn gửi
                </button>
              </div>
              {sendDate === "schedule" && (
                <Input type="date" className="mt-2 h-11 rounded-xl" />
              )}
            </div>
          </div>
        </motion.section>

        {/* Step 4: Preview */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              4
            </div>
            <h2 className="text-lg font-semibold">Xem trước thiệp</h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-warning/5 p-8 shadow-ambient">
            <div className="mx-auto max-w-md rounded-2xl bg-surface-lowest p-6 shadow-hover">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-center text-xl font-bold">
                Bạn có một món quà!
              </h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Từ <span className="font-medium">Your Name</span> gửi tới{" "}
                <span className="font-medium">{recipient.name || "..."}</span>
              </p>
              <div className="my-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-5 text-center">
                <Heart className="mx-auto h-5 w-5 text-destructive" />
                <p className="mt-2 text-sm italic text-pretty">
                  &ldquo;{message || "Chúc bạn hành trình học thật vui..."}&rdquo;
                </p>
              </div>
              <div className="rounded-2xl bg-surface-low p-4 text-center">
                <div className="text-xs text-muted-foreground">Gói tặng</div>
                <div className="text-lg font-bold">
                  {plan.name} • {dur.label}
                </div>
              </div>
              <Button className="mt-4 w-full rounded-xl bg-primary shadow-ambient">
                Nhận quà ngay
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Checkout bar */}
        <div className="sticky bottom-4 rounded-3xl bg-surface-lowest p-5 shadow-hover">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Tổng thanh toán</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                {discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="lg"
              disabled={!recipient.email || !recipient.name}
              className="gap-2 rounded-xl bg-primary shadow-hover"
            >
              Tiếp tục thanh toán
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
