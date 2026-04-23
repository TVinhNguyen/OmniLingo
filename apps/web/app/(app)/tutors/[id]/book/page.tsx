"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const TIMES = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00", "19:00", "20:00", "21:00"]

export default function BookTutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [date, setDate] = useState(0)
  const [time, setTime] = useState<string | null>(null)
  const [duration, setDuration] = useState(60)
  const [note, setNote] = useState("")

  const basePrice = 25
  const price = duration === 30 ? basePrice / 2 : duration === 60 ? basePrice : basePrice * 2

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/tutors/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại hồ sơ
        </Link>
      </Button>

      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm">
        {["Chọn giờ", "Chi tiết buổi học", "Thanh toán"].map((s, i) => {
          const idx = (i + 1) as 1 | 2 | 3
          const active = step === idx
          const done = step > idx
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full font-semibold",
                  active && "bg-primary text-primary-foreground",
                  done && "bg-success text-success-foreground",
                  !active && !done && "bg-surface-low text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : idx}
              </div>
              <span className={cn(active && "font-semibold", !active && "text-muted-foreground")}>
                {s}
              </span>
              {idx < 3 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient sm:p-8"
        >
          {step === 1 && (
            <>
              <h2 className="font-serif text-2xl font-semibold">Chọn ngày và giờ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lịch được hiển thị theo múi giờ của bạn (GMT+7)
              </p>

              <div className="mt-6">
                <div className="mb-3 text-sm font-semibold">Tuần này</div>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((d, i) => (
                    <button
                      key={d}
                      onClick={() => setDate(i)}
                      className={cn(
                        "rounded-xl border-2 p-3 text-center transition",
                        date === i
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface-low hover:border-primary/40",
                      )}
                    >
                      <div className="text-xs text-muted-foreground">{d}</div>
                      <div className="mt-1 font-semibold tabular-nums">{15 + i}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 text-sm font-semibold">Khung giờ trống</div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-lg border-2 px-3 py-2.5 font-mono text-sm font-semibold transition",
                        time === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface-low hover:border-primary/40",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 text-sm font-semibold">Thời lượng</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 30, label: "30 phút", p: 12.5 },
                    { v: 60, label: "60 phút", p: 25 },
                    { v: 90, label: "90 phút", p: 50 },
                  ].map((d) => (
                    <button
                      key={d.v}
                      onClick={() => setDuration(d.v)}
                      className={cn(
                        "rounded-xl border-2 p-4 text-center transition",
                        duration === d.v
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface-low hover:border-primary/40",
                      )}
                    >
                      <div className="font-semibold">{d.label}</div>
                      <div className="mt-1 text-sm text-muted-foreground">${d.p}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="mt-8 h-11 w-full rounded-xl"
                disabled={!time}
                onClick={() => setStep(2)}
              >
                Tiếp theo
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-serif text-2xl font-semibold">Chi tiết buổi học</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cho giáo viên biết bạn muốn học gì để chuẩn bị
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold">Chủ đề</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      "Giao tiếp",
                      "IELTS",
                      "TOEIC",
                      "Business",
                      "Pronunciation",
                      "Grammar",
                    ].map((topic, i) => (
                      <button
                        key={topic}
                        className={cn(
                          "rounded-lg border-2 px-3 py-2 text-sm font-medium transition",
                          i === 0
                            ? "border-primary bg-primary/10"
                            : "border-border bg-surface-low hover:border-primary/40",
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Ghi chú cho giáo viên</label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="VD: Mình muốn luyện phần Speaking Part 2, chủ đề du lịch..."
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Trình độ của bạn</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["A2", "B1", "B2", "C1"].map((lvl) => (
                      <button
                        key={lvl}
                        className={cn(
                          "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
                          lvl === "B2"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface-low hover:border-primary/40",
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Quay lại
                </Button>
                <Button className="flex-1" onClick={() => setStep(3)}>
                  Tiếp theo
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-serif text-2xl font-semibold">Thanh toán</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn phương thức thanh toán để hoàn tất đặt lịch
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { id: "card", label: "Thẻ tín dụng/ghi nợ", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
                  { id: "wallet", label: "Ví điện tử", icon: CreditCard, desc: "Momo, ZaloPay, VNPay" },
                ].map((m, i) => (
                  <button
                    key={m.id}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition",
                      i === 0
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface-low hover:border-primary/40",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-lowest">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-sm text-muted-foreground">{m.desc}</div>
                    </div>
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2",
                        i === 0 ? "border-primary bg-primary" : "border-border",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-surface-low p-5">
                <div className="mb-3 font-semibold">Chính sách huỷ</div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    Hoàn 100% nếu huỷ trước 24 giờ
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    Đổi lịch miễn phí 1 lần
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Quay lại
                </Button>
                <Button className="flex-1">Xác nhận & thanh toán</Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Summary */}
        <aside className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src="/tutor-emma.jpg" alt="" />
              <AvatarFallback>ET</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Emma Thompson</div>
              <div className="text-sm text-muted-foreground">UK · Tiếng Anh</div>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Ngày
              </span>
              <span className="font-medium">
                Thứ {date + 2}, {15 + date}/3
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Giờ
              </span>
              <span className="font-medium">{time || "--:--"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Video className="h-4 w-4" />
                Thời lượng
              </span>
              <span className="font-medium">{duration} phút</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Chủ đề
              </span>
              <span className="font-medium">Giao tiếp</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phí buổi học</span>
              <span>${price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phí dịch vụ</span>
              <span>$1.5</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-semibold">
              <span>Tổng</span>
              <span className="tabular-nums">${(price + 1.5).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
