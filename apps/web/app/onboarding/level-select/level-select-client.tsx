"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingShell } from "../_shell"
import { updateOnboardingStepAction } from "../actions"

const LEVELS = [
  { id: "beginner",     label: "Người mới",  desc: "Mới bắt đầu từ số 0" },
  { id: "intermediate", label: "Trung cấp",  desc: "Giao tiếp cơ bản" },
  { id: "advanced",     label: "Nâng cao",   desc: "Trôi chảy, hoàn thiện" },
  { id: "unknown",      label: "Không biết", desc: "Sẽ làm test xếp lớp" },
]

const DAILY = [
  { mins: 5,  label: "5 phút",  desc: "Thoải mái" },
  { mins: 10, label: "10 phút", desc: "Thông thường" },
  { mins: 15, label: "15 phút", desc: "Nghiêm túc" },
  { mins: 20, label: "20+ phút", desc: "Tham vọng" },
]

export default function LevelSelectClient({
  defaultLevel,
  defaultDailyMins,
  defaultReminderTime,
}: {
  defaultLevel: string
  defaultDailyMins: number
  defaultReminderTime: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState(defaultLevel)
  const [dailyMins, setDailyMins] = useState(defaultDailyMins)
  const [reminderTime, setReminderTime] = useState(defaultReminderTime)

  const next = () => {
    if (!level) {
      setError("Chọn trình độ hiện tại của bạn.")
      return
    }
    startTransition(async () => {
      setError(null)
      const res = await updateOnboardingStepAction("level_select", {
        level,
        dailyMins,
        reminderTime,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      router.push("/onboarding/placement")
    })
  }

  return (
    <OnboardingShell
      slug="level-select"
      title="Trình độ và mục tiêu hằng ngày"
      subtitle="Tự đánh giá nhanh — bài test xếp lớp ở bước tiếp theo sẽ chính xác hơn."
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Trình độ hiện tại</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {LEVELS.map(({ id, label, desc }) => {
              const active = level === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLevel(id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40"
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Mục tiêu mỗi ngày</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAILY.map(({ mins, label, desc }) => {
              const active = dailyMins === mins
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyMins(mins)}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40"
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="reminderTime" className="text-sm">Giờ nhắc học (tuỳ chọn)</Label>
          <Input
            id="reminderTime"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="mt-2 max-w-[160px]"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={next} disabled={pending}>
            Tiếp tục
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
