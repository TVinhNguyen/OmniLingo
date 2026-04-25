"use client"

import { useEffect, useState, useTransition } from "react"
import { SettingsShell, SettingsCard } from "@/components/app/settings-shell"
import { Switch } from "@/components/ui/switch"
import { Target, Clock, Volume2, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { updateLearningPreferencesAction } from "./actions"

const goals = [
  { value: 5, label: "Thư giãn", desc: "5 phút/ngày" },
  { value: 10, label: "Thường xuyên", desc: "10 phút/ngày" },
  { value: 15, label: "Nghiêm túc", desc: "15 phút/ngày" },
  { value: 20, label: "Chuyên sâu", desc: "20 phút/ngày" },
  { value: 30, label: "Cao thủ", desc: "30 phút/ngày" },
  { value: 60, label: "Marathon", desc: "60 phút/ngày" },
]

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

export interface LearningClientProps {
  initial: {
    dailyGoalMinutes: number
    reminderTime: string | null
  }
}

export function LearningClient({ initial }: LearningClientProps) {
  const [goal, setGoal] = useState(initial.dailyGoalMinutes || 15)
  const [reminderEnabled, setReminderEnabled] = useState(initial.reminderTime != null)
  const [reminderTime, setReminderTime] = useState(initial.reminderTime ?? "19:00")
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4])
  const [motion, setMotion] = useState(true)
  const [sound, setSound] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [feedback, setFeedback] = useState<{ ok?: boolean; msg: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 2500)
    return () => clearTimeout(t)
  }, [feedback])

  const toggle = (i: number) => {
    setActiveDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
    setDirty(true)
  }

  const onSave = () => {
    startTransition(async () => {
      const res = await updateLearningPreferencesAction({
        dailyGoalMinutes: goal,
        reminderTime: reminderEnabled ? reminderTime : null,
      })
      if (res.error) {
        setFeedback({ ok: false, msg: res.error })
      } else {
        setFeedback({ ok: true, msg: "Đã lưu thiết lập học tập" })
        setDirty(false)
      }
    })
  }

  const onCancel = () => {
    setGoal(initial.dailyGoalMinutes || 15)
    setReminderEnabled(initial.reminderTime != null)
    setReminderTime(initial.reminderTime ?? "19:00")
    setDirty(false)
  }

  return (
    <SettingsShell
      title="Học tập"
      description="Thiết lập mục tiêu, nhắc nhở, và trải nghiệm học"
      dirty={dirty || isPending}
      onSave={onSave}
      onCancel={onCancel}
    >
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            feedback.ok
              ? "border-success/30 bg-success/5 text-success"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {feedback.ok ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {feedback.msg}
        </div>
      )}

      <SettingsCard
        title="Mục tiêu hàng ngày"
        description="Chọn lượng thời gian bạn muốn học mỗi ngày"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => {
                setGoal(g.value)
                setDirty(true)
              }}
              className={`rounded-2xl p-4 text-left transition-all ${
                goal === g.value
                  ? "bg-primary text-primary-foreground shadow-hover"
                  : "bg-surface-low hover:bg-primary/5"
              }`}
            >
              <Target
                className={`mb-2 h-5 w-5 ${
                  goal === g.value ? "" : "text-primary"
                }`}
              />
              <div className="font-semibold">{g.label}</div>
              <div
                className={`text-xs ${
                  goal === g.value ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {g.desc}
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Nhắc nhở"
        description="Bật và chọn giờ bạn muốn nhận nhắc nhở học"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl p-3 hover:bg-surface-low">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Bật nhắc nhở</div>
                <div className="text-xs text-muted-foreground">
                  Tắt để không nhận nhắc nhở học hàng ngày
                </div>
              </div>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={(v) => {
                setReminderEnabled(v)
                setDirty(true)
              }}
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              Giờ nhắc nhở
            </label>
            <input
              type="time"
              value={reminderTime}
              disabled={!reminderEnabled}
              onChange={(e) => {
                setReminderTime(e.target.value)
                setDirty(true)
              }}
              className="h-11 w-40 rounded-xl border border-border bg-surface-low px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Ngày nhắc nhở</label>
            <div className="flex gap-2">
              {days.map((d, i) => {
                const active = activeDays.includes(i)
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    disabled={!reminderEnabled}
                    className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-ambient"
                        : "bg-surface-low text-muted-foreground hover:bg-primary/10"
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Lưu ý: hiện tại BE chỉ lưu giờ; ngày nhắc nhở chỉ áp dụng cho phiên này.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Trải nghiệm" description="Điều chỉnh hiệu ứng và âm thanh">
        <div className="space-y-1">
          <div className="flex items-center justify-between rounded-xl p-3 hover:bg-surface-low">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Hiệu ứng chuyển động</div>
                <div className="text-xs text-muted-foreground">Animation, transitions</div>
              </div>
            </div>
            <Switch
              checked={motion}
              onCheckedChange={(v) => {
                setMotion(v)
                setDirty(true)
              }}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl p-3 hover:bg-surface-low">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Âm thanh hiệu ứng</div>
                <div className="text-xs text-muted-foreground">
                  Âm thanh khi click, correct/wrong
                </div>
              </div>
            </div>
            <Switch
              checked={sound}
              onCheckedChange={(v) => {
                setSound(v)
                setDirty(true)
              }}
            />
          </div>
        </div>
      </SettingsCard>
    </SettingsShell>
  )
}
