"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const INTENSITIES = [
  { id: "light", name: "Nhẹ nhàng", hours: 5, color: "from-success/60 to-success" },
  { id: "balanced", name: "Cân bằng", hours: 10, color: "from-primary/60 to-primary" },
  { id: "intensive", name: "Tập trung", hours: 15, color: "from-accent/60 to-accent" },
  { id: "hardcore", name: "Cường độ cao", hours: 25, color: "from-[#983772] to-[#d56ba6]" },
]

const WEEKS_DATA = [
  { week: 1, focus: "Listening Part 1-2 + Grammar Review", hours: 10 },
  { week: 2, focus: "Reading Academic Passages + Vocab 200 từ", hours: 12 },
  { week: 3, focus: "Writing Task 1 - Charts & Graphs", hours: 11 },
  { week: 4, focus: "Speaking Part 1 - Personal Topics", hours: 9 },
  { week: 5, focus: "Mock Test 1 + Weak Points Review", hours: 10 },
  { week: 6, focus: "Writing Task 2 - Essay Structures", hours: 12 },
  { week: 7, focus: "Listening Part 3-4 + Speaking Part 2", hours: 11 },
  { week: 8, focus: "Final Mock Test + Last Polish", hours: 10 },
]

export default function PlanBuilderPage() {
  const params = useParams()
  const examType = (params?.examType as string) ?? "ielts"

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [intensity, setIntensity] = useState("balanced")
  const [targetBand, setTargetBand] = useState([7.5])
  const [weeks, setWeeks] = useState([8])
  const [testDate, setTestDate] = useState("2025-03-15")

  const intensityData = INTENSITIES.find((i) => i.id === intensity) ?? INTENSITIES[1]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-5xl px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/test-prep/${examType}`}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại {examType.toUpperCase()}
          </Link>
        </Button>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/70">
                AI Study Plan Builder
              </div>
              <h1 className="text-3xl font-bold">Tạo lộ trình học cá nhân hóa</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-white/90">
            Trả lời 3 câu hỏi đơn giản để AI xây dựng lộ trình {weeks[0]} tuần phù hợp với mục tiêu
            và thời gian của bạn.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-8 flex items-center justify-between rounded-3xl bg-surface-lowest p-4 shadow-ambient">
          {[1, 2, 3].map((s, idx) => (
            <div key={s} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-low text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              <div className="ml-3 hidden flex-1 sm:block">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Bước {s}
                </div>
                <div className="text-sm font-semibold">
                  {s === 1 ? "Mục tiêu" : s === 2 ? "Cường độ" : "Xác nhận"}
                </div>
              </div>
              {idx < 2 && (
                <div
                  className={`mx-3 hidden h-0.5 flex-1 transition-colors sm:block ${
                    step > s ? "bg-primary" : "bg-surface-low"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mt-8 rounded-3xl bg-surface-lowest p-8 shadow-ambient">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold">Mục tiêu của bạn là gì?</h2>
                <p className="mt-1 text-muted-foreground">
                  Xác định band điểm mong muốn và ngày thi
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Band điểm mục tiêu</Label>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-primary">
                    {targetBand[0].toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 9.0</span>
                </div>
                <Slider
                  value={targetBand}
                  onValueChange={setTargetBand}
                  min={4}
                  max={9}
                  step={0.5}
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </div>

              <div>
                <Label htmlFor="test-date" className="text-sm font-semibold">
                  Ngày dự kiến thi
                </Label>
                <Input
                  id="test-date"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold">Số tuần chuẩn bị</Label>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-primary">{weeks[0]}</span>
                  <span className="text-muted-foreground">tuần</span>
                </div>
                <Slider
                  value={weeks}
                  onValueChange={setWeeks}
                  min={4}
                  max={16}
                  step={1}
                  className="mt-4"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold">Cường độ học tập</h2>
                <p className="mt-1 text-muted-foreground">
                  Bạn có thể dành bao nhiêu giờ mỗi tuần?
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {INTENSITIES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIntensity(item.id)}
                    className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all ${
                      intensity === item.id
                        ? "border-primary shadow-hover"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br opacity-10 ${item.color}`}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        {intensity === item.id && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{item.hours}</span>
                        <span className="text-sm text-muted-foreground">
                          giờ/tuần
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Khoảng {Math.round((item.hours * 60) / 7)} phút/ngày
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold">Xác nhận lộ trình</h2>
                <p className="mt-1 text-muted-foreground">
                  AI đã tạo lộ trình {weeks[0]} tuần cho bạn
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Target, label: "Mục tiêu", value: `${targetBand[0]} band` },
                  { icon: Calendar, label: "Thời gian", value: `${weeks[0]} tuần` },
                  {
                    icon: Clock,
                    label: "Cường độ",
                    value: `${intensityData.hours}h/tuần`,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-surface-low p-4">
                    <item.icon className="h-5 w-5 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-lg font-bold">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Lộ trình theo tuần
                </h3>
                <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto">
                  {WEEKS_DATA.slice(0, weeks[0]).map((w) => (
                    <div
                      key={w.week}
                      className="flex items-center gap-3 rounded-xl bg-surface-lowest p-3"
                    >
                      <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                        Tuần {w.week}
                      </Badge>
                      <span className="flex-1 text-sm">{w.focus}</span>
                      <span className="text-xs text-muted-foreground">{w.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
              className="h-12 gap-2 rounded-2xl bg-gradient-primary px-8 font-semibold shadow-hover"
            >
              Tiếp theo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              asChild
              className="h-12 gap-2 rounded-2xl bg-gradient-primary px-8 font-semibold shadow-hover"
            >
              <Link href={`/test-prep/${examType}`}>
                Bắt đầu học
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
