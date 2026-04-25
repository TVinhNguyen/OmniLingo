"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { CheckCircle2, HelpCircle, RefreshCw, Tags, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const reasons = [
  { v: "expensive", label: "Quá đắt" },
  { v: "features", label: "Tính năng không đủ" },
  { v: "considering", label: "Đang cân nhắc" },
  { v: "other", label: "Khác" },
]

function CancelInner() {
  const params = useSearchParams()
  const planId = params.get("planId")
  const retryHref = planId ? `/checkout?planId=${encodeURIComponent(planId)}` : "/checkout"

  const [reason, setReason] = useState<string | null>(null)
  const [detail, setDetail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-soft py-16 px-4">
      <div className="mx-auto max-w-lg space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <XCircle className="size-12 text-muted-foreground" strokeWidth={2} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance">
            Thanh toán đã huỷ
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Bạn chưa bị tính phí. Có thể quay lại bất cứ lúc nào.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-ambient">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-2">Có vấn đề?</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="card">
                  <AccordionTrigger className="text-sm">Lỗi thẻ tín dụng?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Hãy kiểm tra lại thông tin thẻ, số dư, hoặc liên hệ ngân hàng để đảm bảo giao dịch quốc tế được cho phép.
                    Bạn cũng có thể{" "}
                    <Link href={retryHref} className="text-primary underline">thử lại</Link> với thẻ khác.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="plan">
                  <AccordionTrigger className="text-sm">Muốn đổi plan?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Xem{" "}
                    <Link href="/pricing" className="text-primary underline">trang Pricing</Link>{" "}
                    để so sánh các gói. Mỗi gói có thời hạn và tính năng riêng phù hợp với nhu cầu khác nhau.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cheaper">
                  <AccordionTrigger className="text-sm">Muốn thử plan rẻ hơn?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Gói <span className="font-semibold text-foreground">Plus</span> chỉ $9/tháng với đầy đủ luyện tập & AI Tutor cơ bản. Gói{" "}
                    <span className="font-semibold text-foreground">Free</span> đủ cho người mới bắt đầu.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2">
          <Button asChild size="lg" className="w-full h-12 bg-gradient-primary">
            <Link href={retryHref}>
              <RefreshCw className="mr-2 size-4" /> Thử lại
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 h-11" asChild>
              <Link href="/pricing">
                <Tags className="mr-2 size-4" /> Xem các gói khác
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="flex-1 h-11" asChild>
              <Link href="/contact">
                <HelpCircle className="mr-2 size-4" /> Hỗ trợ
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Feedback poll */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-ambient">
            <CardContent className="p-5">
              {submitted ? (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-success" />
                  <span>Cảm ơn phản hồi của bạn. Chúng tôi sẽ cải thiện.</span>
                </div>
              ) : (
                <>
                  <h2 className="font-semibold text-sm mb-3">Lý do bạn huỷ?</h2>
                  <RadioGroup value={reason ?? ""} onValueChange={setReason}>
                    <div className="space-y-1.5">
                      {reasons.map((r) => (
                        <label
                          key={r.v}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition",
                            reason === r.v ? "bg-primary/10 text-primary" : "hover:bg-surface-low",
                          )}
                        >
                          <RadioGroupItem value={r.v} /> {r.label}
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                  <Textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Chia sẻ chi tiết (tuỳ chọn)…"
                    rows={3}
                    className="mt-3 rounded-xl bg-surface-lowest"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!reason}
                    onClick={() => setSubmitted(true)}
                    className="mt-3 w-full"
                  >
                    Gửi phản hồi
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-soft" />}>
      <CancelInner />
    </Suspense>
  )
}
