"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Shield,
  Check,
  Crown,
  Lock,
  ChevronLeft,
  Sparkles,
  Tag,
  CreditCard,
  Smartphone,
  Landmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Step = "plan" | "payment" | "confirm" | "success"

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("plan")
  const [cycle, setCycle] = useState<"month" | "year">("year")
  const [method, setMethod] = useState<"card" | "momo" | "banking">("card")
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const pricing = cycle === "month" ? 199000 : 1990000
  const original = cycle === "year" ? 199000 * 12 : null
  const discount = couponApplied ? Math.round(pricing * 0.2) : 0
  const total = pricing - discount

  const steps: { id: Step; label: string }[] = [
    { id: "plan", label: "Gói" },
    { id: "payment", label: "Thanh toán" },
    { id: "confirm", label: "Xác nhận" },
  ]
  const currentIdx = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-surface-low">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Thanh toán được mã hoá SSL
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {step !== "success" && (
          <div className="mb-8 mx-auto flex max-w-xl items-center justify-between">
            {steps.map((s, idx) => {
              const done = idx < currentIdx
              const active = idx === currentIdx
              return (
                <div key={s.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition ${
                        done
                          ? "border-success bg-success text-success-foreground"
                          : active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs ${active ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full ${
                        done ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-lg"
            >
              <Card className="p-8 text-center shadow-ambient">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold">Thanh toán thành công!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Chào mừng đến với OmniLingo Plus. Hoá đơn đã được gửi tới email của bạn.
                </p>
                <div className="mt-6 rounded-xl bg-surface-low p-4 text-left text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Gói</span>
                    <span className="font-medium">
                      Plus - {cycle === "year" ? "Năm" : "Tháng"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Số tiền</span>
                    <span className="font-medium">{total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Mã giao dịch</span>
                    <span className="font-mono text-xs">TXN-{Date.now().toString().slice(-10)}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/dashboard">Về Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/settings/subscription">Xem gói</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6 lg:grid-cols-[1fr_380px]"
            >
              <div className="space-y-4">
                {step === "plan" && (
                  <Card className="p-6 shadow-ambient">
                    <h2 className="mb-4 text-lg font-semibold">Chọn chu kỳ</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        {
                          v: "month" as const,
                          label: "Hàng tháng",
                          price: "199.000đ",
                          desc: "Tính linh hoạt",
                        },
                        {
                          v: "year" as const,
                          label: "Hàng năm",
                          price: "1.990.000đ",
                          desc: "Tiết kiệm 17%",
                          badge: "Phổ biến",
                        },
                      ].map((opt) => {
                        const active = cycle === opt.v
                        return (
                          <button
                            key={opt.v}
                            onClick={() => setCycle(opt.v)}
                            className={`relative rounded-xl border-2 p-4 text-left transition ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-surface-low"
                            }`}
                          >
                            {opt.badge && (
                              <Badge className="absolute -right-2 -top-2 bg-accent text-accent-foreground">
                                {opt.badge}
                              </Badge>
                            )}
                            <div className="mb-1 font-medium">{opt.label}</div>
                            <div className="text-2xl font-bold">{opt.price}</div>
                            <div className="text-xs text-muted-foreground">{opt.desc}</div>
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => setStep("payment")}>Tiếp tục</Button>
                    </div>
                  </Card>
                )}

                {step === "payment" && (
                  <Card className="p-6 shadow-ambient">
                    <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>
                    <div className="grid gap-2 md:grid-cols-3">
                      {[
                        { v: "card" as const, icon: CreditCard, label: "Thẻ" },
                        { v: "momo" as const, icon: Smartphone, label: "MoMo/ZaloPay" },
                        { v: "banking" as const, icon: Landmark, label: "Chuyển khoản" },
                      ].map((m) => {
                        const Icon = m.icon
                        const active = method === m.v
                        return (
                          <button
                            key={m.v}
                            onClick={() => setMethod(m.v)}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-sm transition ${
                              active
                                ? "border-primary bg-primary/5"
                                : "hover:bg-surface-low"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span className={active ? "font-medium" : ""}>{m.label}</span>
                          </button>
                        )
                      })}
                    </div>

                    {method === "card" && (
                      <div className="mt-5 space-y-3">
                        <div>
                          <Label htmlFor="num">Số thẻ</Label>
                          <Input
                            id="num"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1.5 font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <Label>Hết hạn</Label>
                            <Input placeholder="MM/YY" className="mt-1.5 font-mono" />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input placeholder="•••" className="mt-1.5 font-mono" />
                          </div>
                        </div>
                        <div>
                          <Label>Tên chủ thẻ</Label>
                          <Input placeholder="NGUYEN VAN A" className="mt-1.5 uppercase" />
                        </div>
                      </div>
                    )}

                    {method === "momo" && (
                      <div className="mt-5 rounded-xl bg-surface-low p-4 text-sm text-muted-foreground">
                        Bạn sẽ được chuyển đến ứng dụng MoMo/ZaloPay để xác nhận.
                      </div>
                    )}

                    {method === "banking" && (
                      <div className="mt-5 rounded-xl bg-surface-low p-4 text-sm text-muted-foreground">
                        Thông tin chuyển khoản sẽ hiển thị sau khi xác nhận đơn.
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <Button variant="ghost" onClick={() => setStep("plan")}>
                        Quay lại
                      </Button>
                      <Button onClick={() => setStep("confirm")}>Tiếp tục</Button>
                    </div>
                  </Card>
                )}

                {step === "confirm" && (
                  <Card className="p-6 shadow-ambient">
                    <h2 className="mb-4 text-lg font-semibold">Xác nhận đơn hàng</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between rounded-lg bg-surface-low p-3">
                        <span className="text-muted-foreground">Gói</span>
                        <span className="font-medium">
                          OmniLingo Plus - {cycle === "year" ? "Năm" : "Tháng"}
                        </span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-surface-low p-3">
                        <span className="text-muted-foreground">Phương thức</span>
                        <span className="font-medium">
                          {method === "card"
                            ? "Thẻ Visa •••• 4242"
                            : method === "momo"
                              ? "MoMo"
                              : "Chuyển khoản"}
                        </span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-surface-low p-3">
                        <span className="text-muted-foreground">Email hoá đơn</span>
                        <span className="font-medium">hoa.nguyen@example.com</span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Button variant="ghost" onClick={() => setStep("payment")}>
                        Quay lại
                      </Button>
                      <Button onClick={() => setStep("success")} className="min-w-[180px]">
                        Thanh toán {total.toLocaleString("vi-VN")}đ
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar summary */}
              <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                <Card className="overflow-hidden shadow-ambient">
                  <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-5">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <span className="font-semibold">OmniLingo Plus</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {pricing.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{cycle === "year" ? "năm" : "tháng"}
                      </span>
                    </div>
                    {original && (
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground line-through">
                          {original.toLocaleString("vi-VN")}đ
                        </span>
                        <Badge className="ml-2 bg-accent text-accent-foreground">-17%</Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-5 text-sm">
                    {[
                      "Lesson không giới hạn",
                      "AI Tutor 100 lượt/tháng",
                      "Phân tích tiến độ",
                      "Tải offline",
                      "5 ngôn ngữ cùng lúc",
                    ].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 shadow-ambient">
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mã giảm giá</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="OMNI20"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={couponApplied}
                    />
                    <Button
                      variant={couponApplied ? "outline" : "default"}
                      onClick={() => setCouponApplied(!!coupon)}
                      className="shrink-0"
                    >
                      {couponApplied ? "Đã áp dụng" : "Áp dụng"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="mt-2 text-xs text-success">
                      <Sparkles className="mr-1 inline h-3 w-3" />
                      Giảm 20% đã áp dụng
                    </p>
                  )}
                  <Separator className="my-4" />
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{pricing.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-success">
                        <span>Giảm giá</span>
                        <span>-{discount.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT</span>
                      <span>0đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-1 text-base font-semibold">
                      <span>Tổng</span>
                      <span>{total.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                </Card>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Hoàn tiền 100% trong 7 ngày đầu
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
