"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingShell } from "../_shell"
import { updateOnboardingStepAction } from "../actions"

const GOALS = [
  { id: "travel", icon: Plane,          label: "Du lịch",    desc: "Giao tiếp cơ bản" },
  { id: "work",   icon: Briefcase,      label: "Công việc",  desc: "Business context" },
  { id: "study",  icon: GraduationCap,  label: "Du học",     desc: "Academic skills" },
  { id: "cert",   icon: Award,          label: "Chứng chỉ",  desc: "IELTS, JLPT, HSK..." },
  { id: "hobby",  icon: Heart,          label: "Sở thích",   desc: "Văn hoá, phim, nhạc" },
]

const CERTS = ["IELTS", "TOEIC", "TOEFL", "HSK", "JLPT", "TOPIK"]

export default function GoalSelectClient({
  defaultGoal,
  defaultCert,
  defaultTargetScore,
}: {
  defaultGoal: string
  defaultCert: string
  defaultTargetScore: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [goal, setGoal] = useState(defaultGoal)
  const [cert, setCert] = useState(defaultCert)
  const [targetScore, setTargetScore] = useState(defaultTargetScore)

  const next = () => {
    if (!goal) {
      setError("Chọn một mục tiêu.")
      return
    }
    startTransition(async () => {
      setError(null)
      const payload: Record<string, unknown> = { goal }
      if (goal === "cert") {
        payload.cert = cert
        payload.targetScore = targetScore
      }
      const res = await updateOnboardingStepAction("goal_select", payload)
      if (res.error) {
        setError(res.error)
        return
      }
      router.push("/onboarding/level-select")
    })
  }

  return (
    <OnboardingShell
      slug="goal-select"
      title="Mục tiêu của bạn là gì?"
      subtitle="Chúng tôi sẽ điều chỉnh lộ trình theo mục tiêu bạn chọn."
    >
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {GOALS.map(({ id, icon: Icon, label, desc }) => {
            const active = goal === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setGoal(id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface-low hover:border-primary/40"
                }`}
              >
                <Icon className={`mt-0.5 h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {goal === "cert" && (
          <div className="space-y-3 rounded-xl border border-border bg-surface-low p-4">
            <div>
              <Label className="text-sm">Chứng chỉ</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CERTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCert(c)}
                    className={`rounded-full border px-3 py-1 text-xs transition-all ${
                      cert === c
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="targetScore" className="text-sm">Điểm mục tiêu (tuỳ chọn)</Label>
              <Input
                id="targetScore"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="Ví dụ: 7.0"
                className="mt-2"
              />
            </div>
          </div>
        )}

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
