"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Plan } from "@/lib/api/types"

interface DisplayPlan {
  name: string
  price: number
  currency: string
  period: string
  tagline: string
  features: string[]
  cta: string
  popular?: boolean
}

const MOCK_PLANS: DisplayPlan[] = [
  {
    name: "Miễn phí",
    price: 0,
    currency: "đ",
    period: "",
    tagline: "Khởi đầu với những điều cơ bản.",
    features: [
      "3 bài học mỗi ngày",
      "Truy cập 1 ngôn ngữ",
      "Diễn đàn cộng đồng",
      "Phản hồi phát âm cơ bản",
    ],
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Premium",
    price: 189000,
    currency: "đ",
    period: "/tháng",
    tagline: "Trải nghiệm đầy đủ cho người học nghiêm túc.",
    features: [
      "Bài học & tim không giới hạn",
      "Tất cả 20+ ngôn ngữ",
      "AI Tutor Lumi không giới hạn",
      "Phân tích phát âm nâng cao",
      "Bài học offline",
      "Không quảng cáo",
    ],
    cta: "Dùng thử 7 ngày",
    popular: true,
  },
  {
    name: "Gia đình",
    price: 299000,
    currency: "đ",
    period: "/tháng",
    tagline: "Chia sẻ Premium cho đến 6 người.",
    features: [
      "Mọi tính năng Premium",
      "Tối đa 6 tài khoản riêng biệt",
      "Bảng điều khiển phụ huynh",
      "Bảng xếp hạng chung gia đình",
      "Hỗ trợ ưu tiên",
    ],
    cta: "Chọn gói gia đình",
  },
]

const compare = [
  { label: "Bài học/ngày", free: "3", premium: "Không giới hạn", family: "Không giới hạn" },
  { label: "Số ngôn ngữ", free: "1", premium: "20+", family: "20+" },
  { label: "AI Tutor Lumi", free: "5 phút/ngày", premium: "Không giới hạn", family: "Không giới hạn" },
  { label: "Offline mode", free: "—", premium: "Có", family: "Có" },
  { label: "Số tài khoản", free: "1", premium: "1", family: "6" },
  { label: "Hỗ trợ", free: "Cộng đồng", premium: "Chat 24/7", family: "Ưu tiên" },
]

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN")
}

function mapPlan(p: Plan): DisplayPlan {
  const tier = p.tier.toLowerCase()
  const isFree = tier === "free" || p.price === 0
  const currency = p.currency === "VND" ? "đ" : p.currency
  const period = isFree ? "" : p.period === "year" ? "/năm" : "/tháng"
  const tagline =
    tier === "plus" || tier === "premium"
      ? "Trải nghiệm đầy đủ cho người học nghiêm túc."
      : tier === "family"
      ? "Chia sẻ Premium cho đến 6 người."
      : "Khởi đầu với những điều cơ bản."
  const cta = isFree
    ? "Bắt đầu miễn phí"
    : tier === "plus" || tier === "premium"
    ? "Dùng thử 7 ngày"
    : tier === "family"
    ? "Chọn gói gia đình"
    : "Chọn gói"
  return {
    name: p.name,
    price: p.price,
    currency,
    period,
    tagline,
    features: p.features,
    cta,
    popular: p.popular,
  }
}

interface PricingClientProps {
  plans?: Plan[]
}

export default function PricingClient({ plans: bffPlans }: PricingClientProps) {
  const plans: DisplayPlan[] =
    bffPlans && bffPlans.length > 0 ? bffPlans.map(mapPlan) : MOCK_PLANS

  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Giá đơn giản, minh bạch
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Chọn gói phù hợp <span className="text-gradient-primary">hành trình của bạn</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
            Dùng thử Premium miễn phí 7 ngày. Huỷ bất kỳ lúc nào.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card
                className={`relative flex h-full flex-col rounded-3xl border bg-surface-lowest p-8 shadow-ambient transition-all ${
                  p.popular
                    ? "border-primary ring-2 ring-primary/20 scale-[1.02] shadow-raise"
                    : "border-border hover:shadow-hover"
                }`}
              >
                {p.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary text-primary-foreground shadow-ambient">
                    Phổ biến nhất
                  </Badge>
                )}
                <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    {p.price === 0 ? "0" : formatPrice(p.price)}
                  </span>
                  <span className="text-lg text-muted-foreground">{p.currency}</span>
                  {p.period && <span className="ml-1 text-sm text-muted-foreground">{p.period}</span>}
                </div>
                <ul className="my-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  className={`mt-auto w-full rounded-full ${
                    p.popular
                      ? "bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover"
                      : ""
                  }`}
                  variant={p.popular ? "default" : "outline"}
                >
                  <Link href="/sign-up">{p.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">So sánh các gói</h2>
        <Card className="overflow-hidden rounded-3xl border border-border bg-surface-lowest shadow-ambient">
          <div className="grid grid-cols-4 bg-surface-low p-4 text-sm font-semibold">
            <div>Tính năng</div>
            <div className="text-center">Miễn phí</div>
            <div className="text-center text-primary">Premium</div>
            <div className="text-center">Gia đình</div>
          </div>
          {compare.map((c, i) => (
            <div
              key={c.label}
              className={`grid grid-cols-4 border-t border-border p-4 text-sm ${
                i % 2 === 1 ? "bg-surface-low/40" : ""
              }`}
            >
              <div className="font-medium">{c.label}</div>
              <div className="text-center text-muted-foreground">{c.free}</div>
              <div className="text-center font-semibold text-primary">{c.premium}</div>
              <div className="text-center text-muted-foreground">{c.family}</div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  )
}
