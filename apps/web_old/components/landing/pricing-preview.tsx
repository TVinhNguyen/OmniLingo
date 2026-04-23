"use client"

import Link from "next/link"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "mãi mãi",
    features: ["5 lesson/ngày", "SRS cơ bản", "1 ngôn ngữ"],
    cta: "Bắt đầu",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Plus",
    price: "159k",
    period: "/tháng",
    features: [
      "Không giới hạn lesson",
      "Tất cả 8 ngôn ngữ",
      "AI Tutor chat",
      "Offline mode",
    ],
    cta: "Chọn Plus",
    href: "/pricing",
    highlight: false,
  },
  {
    name: "Pro",
    price: "299k",
    period: "/tháng",
    features: [
      "Mọi thứ của Plus",
      "AI Voice Tutor",
      "Test Prep đầy đủ",
      "AI Writing Grader",
      "2 buổi 1-1 / tháng",
    ],
    cta: "Chọn Pro",
    href: "/pricing",
    highlight: true,
  },
  {
    name: "Ultimate",
    price: "599k",
    period: "/tháng",
    features: [
      "Mọi thứ của Pro",
      "8 buổi 1-1 / tháng",
      "Live classes",
      "Proctored mock test",
      "Priority support",
    ],
    cta: "Chọn Ultimate",
    href: "/pricing",
    highlight: false,
  },
]

export function PricingPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Gói đơn giản, minh bạch
          </p>
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
            Chọn gói phù hợp với{" "}
            <span className="text-gradient-primary">mục tiêu</span> của bạn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Đổi hoặc huỷ bất kỳ lúc nào. Đảm bảo hoàn tiền 14 ngày.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className={`relative flex flex-col rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-gradient-primary text-primary-foreground shadow-hover"
                  : "bg-surface-lowest shadow-ambient hover:shadow-hover"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-fluency px-3 py-1 text-xs font-bold text-white shadow-ambient">
                  <Sparkles className="h-3 w-3" /> Phổ biến nhất
                </span>
              )}
              <h3
                className={`text-lg font-bold ${
                  plan.highlight ? "text-white" : ""
                }`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlight
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.name === "Free" ? "" : "₫"} {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        plan.highlight
                          ? "text-white"
                          : "text-accent"
                      }`}
                      strokeWidth={3}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-6 w-full rounded-full ${
                  plan.highlight
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-gradient-primary text-primary-foreground"
                }`}
                size="lg"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center" data-aos="fade-up">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Xem so sánh đầy đủ & gói Family →
          </Link>
        </div>
      </div>
    </section>
  )
}
