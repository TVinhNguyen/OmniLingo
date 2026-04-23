"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Plane,
  GraduationCap,
  Award,
  Heart,
  Check,
} from "lucide-react"
import { LogoMark } from "@/components/public/public-navbar"
import { Button } from "@/components/ui/button"
import { FlagIcon, flagMap, type LangCode } from "@/components/flag-icon"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { completeOnboardingAction } from "./actions"

const TOTAL_STEPS = 8

const languages: LangCode[] = ["en", "ja", "zh", "ko", "fr", "de", "es", "vi"]

const goals = [
  { id: "travel", icon: Plane, label: "Du lịch", desc: "Giao tiếp cơ bản" },
  { id: "work", icon: Briefcase, label: "Công việc", desc: "Business English" },
  { id: "study", icon: GraduationCap, label: "Du học", desc: "Academic skills" },
  { id: "cert", icon: Award, label: "Chứng chỉ", desc: "IELTS, JLPT, HSK..." },
  { id: "hobby", icon: Heart, label: "Sở thích", desc: "Văn hoá, phim, nhạc" },
]

const levels = [
  { id: "beginner", label: "Người mới", desc: "Mới bắt đầu từ số 0" },
  { id: "intermediate", label: "Trung cấp", desc: "Giao tiếp cơ bản" },
  { id: "advanced", label: "Nâng cao", desc: "Trôi chảy, muốn hoàn thiện" },
  { id: "unknown", label: "Không biết", desc: "Làm test xếp lớp" },
]

const dailyGoals = [
  { minutes: 5, label: "Thoải mái", desc: "5 phút/ngày" },
  { minutes: 10, label: "Thông thường", desc: "10 phút/ngày" },
  { minutes: 15, label: "Nghiêm túc", desc: "15 phút/ngày" },
  { minutes: 20, label: "Tham vọng", desc: "20+ phút/ngày" },
]

const certs = ["IELTS", "TOEIC", "TOEFL", "HSK", "JLPT", "TOPIK"]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedLangs, setSelectedLangs] = useState<LangCode[]>(["en"])
  const [nativeLang, setNativeLang] = useState<LangCode>("vi")
  const [goal, setGoal] = useState<string>("")
  const [cert, setCert] = useState<string>("")
  const [targetScore, setTargetScore] = useState("")
  const [level, setLevel] = useState<string>("")
  const [dailyMins, setDailyMins] = useState<number>(10)
  const [reminderTime, setReminderTime] = useState("20:00")
  const [, startTransition] = useTransition()

  const progress = (step / TOTAL_STEPS) * 100

  const next = () => {
    if (step === TOTAL_STEPS) {
      startTransition(async () => {
        await completeOnboardingAction({
          nativeLang,
          targetLangs: selectedLangs,
          goal,
          level,
          dailyMins,
          reminderTime,
        })
        router.push("/dashboard")
      })
    } else {
      // Skip cert step if goal is not cert
      if (step === 3 && goal !== "cert") {
        setStep(5)
      } else {
        setStep(step + 1)
      }
    }
  }
  const back = () => {
    if (step === 5 && goal !== "cert") setStep(3)
    else setStep(Math.max(1, step - 1))
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-bold">OmniLingo</span>
            </Link>
            <span className="text-xs font-medium text-muted-foreground">
              Bước {step}/{TOTAL_STEPS}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-low">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <StepShell
                eyebrow="Hành trình bắt đầu"
                title="Bạn muốn học ngôn ngữ nào?"
                subtitle="Chọn một hoặc nhiều. Bạn có thể thêm sau."
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {languages.map((code) => {
                    const active = selectedLangs.includes(code)
                    return (
                      <button
                        key={code}
                        onClick={() =>
                          setSelectedLangs((prev) =>
                            active
                              ? prev.filter((l) => l !== code)
                              : [...prev, code]
                          )
                        }
                        className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        {active && (
                          <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        )}
                        <FlagIcon code={code} size={40} />
                        <span className="text-xs font-semibold">
                          {flagMap[code].name}
                        </span>
                        <span
                          className={`text-[11px] ${
                            active ? "text-white/80" : "text-muted-foreground"
                          }`}
                        >
                          {flagMap[code].native}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                eyebrow="Để AI giải thích phù hợp"
                title="Tiếng mẹ đẻ của bạn?"
                subtitle="Chúng tôi sẽ giải thích ngữ pháp bằng ngôn ngữ này."
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {languages.map((code) => {
                    const active = nativeLang === code
                    return (
                      <button
                        key={code}
                        onClick={() => setNativeLang(code)}
                        className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        <FlagIcon code={code} size={40} />
                        <span className="text-xs font-semibold">
                          {flagMap[code].native}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                eyebrow="Cá nhân hoá lộ trình"
                title="Mục tiêu chính của bạn?"
                subtitle="Chúng tôi sẽ ưu tiên nội dung phù hợp."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map((g) => {
                    const active = goal === g.id
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`flex items-center gap-4 rounded-3xl p-5 text-left transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        <span
                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                            active ? "bg-white/20" : "bg-surface-low"
                          }`}
                        >
                          <g.icon
                            className={`h-6 w-6 ${
                              active ? "text-white" : "text-accent"
                            }`}
                          />
                        </span>
                        <div>
                          <p className="font-bold">{g.label}</p>
                          <p
                            className={`text-sm ${
                              active ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {g.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </StepShell>
            )}

            {step === 4 && goal === "cert" && (
              <StepShell
                eyebrow="Chi tiết chứng chỉ"
                title="Chứng chỉ mục tiêu?"
                subtitle="Chúng tôi sẽ tạo lộ trình luyện thi cá nhân."
              >
                <div className="grid grid-cols-3 gap-3">
                  {certs.map((c) => {
                    const active = cert === c
                    return (
                      <button
                        key={c}
                        onClick={() => setCert(c)}
                        className={`rounded-2xl p-4 text-center transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        <span className="text-lg font-extrabold">{c}</span>
                      </button>
                    )
                  })}
                </div>
                {cert && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="score">Điểm mục tiêu</Label>
                      <Input
                        id="score"
                        className="mt-1.5 bg-surface-lowest shadow-ambient"
                        placeholder="VD: 7.0"
                        value={targetScore}
                        onChange={(e) => setTargetScore(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Ngày thi dự kiến</Label>
                      <Input
                        id="deadline"
                        type="date"
                        className="mt-1.5 bg-surface-lowest shadow-ambient"
                      />
                    </div>
                  </div>
                )}
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                eyebrow="Điểm xuất phát"
                title="Trình độ hiện tại của bạn?"
                subtitle="Không chắc? Làm bài test xếp lớp 15 câu."
              >
                <div className="grid gap-3">
                  {levels.map((l) => {
                    const active = level === l.id
                    return (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={`flex items-center justify-between rounded-2xl p-5 text-left transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        <div>
                          <p className="font-bold">{l.label}</p>
                          <p
                            className={`text-sm ${
                              active ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {l.desc}
                          </p>
                        </div>
                        {active && <Check className="h-5 w-5" strokeWidth={3} />}
                      </button>
                    )
                  })}
                </div>
              </StepShell>
            )}

            {step === 6 && (
              <StepShell
                eyebrow="Bài test xếp lớp"
                title="Sẵn sàng làm test?"
                subtitle="15 câu, khoảng 8 phút. Giúp chúng tôi biết chính xác trình độ bạn."
              >
                <div className="flex flex-col items-center justify-center rounded-3xl bg-surface-lowest p-8 text-center shadow-ambient">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fluency text-4xl">
                    🎯
                  </span>
                  <p className="mt-4 font-bold">Placement Test</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Kết hợp nghe, đọc, chọn đáp án. Sau đó bạn sẽ có kết quả
                    CEFR + gợi ý level phù hợp.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-medium">
                      15 câu
                    </span>
                    <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-medium">
                      ~8 phút
                    </span>
                    <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-medium">
                      Có thể bỏ qua
                    </span>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 7 && (
              <StepShell
                eyebrow="Kỷ luật quan trọng hơn tài năng"
                title="Mục tiêu hàng ngày của bạn?"
                subtitle="Học đều đặn quan trọng hơn học nhiều."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {dailyGoals.map((g) => {
                    const active = dailyMins === g.minutes
                    return (
                      <button
                        key={g.minutes}
                        onClick={() => setDailyMins(g.minutes)}
                        className={`flex items-center justify-between rounded-2xl p-5 text-left transition-all ${
                          active
                            ? "bg-gradient-primary text-primary-foreground shadow-hover"
                            : "bg-surface-lowest shadow-ambient hover:-translate-y-1"
                        }`}
                      >
                        <div>
                          <p className="font-bold">{g.label}</p>
                          <p
                            className={`text-sm ${
                              active ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {g.desc}
                          </p>
                        </div>
                        <span className="text-2xl font-extrabold">
                          {g.minutes}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepShell>
            )}

            {step === 8 && (
              <StepShell
                eyebrow="Cuối cùng"
                title="Nhắc bạn mỗi ngày lúc nào?"
                subtitle="Chúng tôi sẽ gửi thông báo giữ streak."
              >
                <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
                  <Label>Giờ nhắc</Label>
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="mt-2 bg-surface-low"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <button
                        key={d}
                        className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover">
                  <p className="text-sm opacity-85">Tóm tắt</p>
                  <p className="mt-1 text-xl font-bold">
                    Học {selectedLangs.map((l) => flagMap[l].name).join(", ")}{" "}
                    {dailyMins} phút/ngày
                  </p>
                  <p className="mt-2 text-sm opacity-90">
                    Mỗi ngày lúc {reminderTime} · Mục tiêu:{" "}
                    {goals.find((g) => g.id === goal)?.label || "Sở thích"}
                    {cert ? ` · ${cert} ${targetScore || ""}` : ""}
                  </p>
                </div>
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="sticky bottom-0 mt-10 flex items-center justify-between gap-3 bg-background/80 py-4 backdrop-blur">
          <Button
            variant="ghost"
            size="lg"
            onClick={back}
            disabled={step === 1}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            size="lg"
            onClick={next}
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover"
          >
            {step === TOTAL_STEPS ? "Vào Dashboard" : "Tiếp tục"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}

function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h1 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  )
}
