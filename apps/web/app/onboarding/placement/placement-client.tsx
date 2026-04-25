"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, CheckCircle2, Headphones, MessageSquare, PenTool } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { OnboardingShell } from "../_shell"
import {
  submitPlacementAction,
  updateOnboardingStepAction,
} from "../actions"
import type { PlacementTest } from "@/lib/api/types"

const SKILL_ICON: Record<string, typeof BookOpen> = {
  reading:    BookOpen,
  vocabulary: PenTool,
  grammar:    PenTool,
  listening:  Headphones,
  speaking:   MessageSquare,
}

const SKILL_LABEL: Record<string, string> = {
  reading:    "Đọc",
  vocabulary: "Từ vựng",
  grammar:    "Ngữ pháp",
  listening:  "Nghe",
  speaking:   "Nói",
}

export default function PlacementClient({
  test,
  loadError,
}: {
  test: PlacementTest | null
  loadError: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(loadError)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  if (!test || test.questions.length === 0) {
    return (
      <OnboardingShell slug="placement" title="Bài kiểm tra xếp lớp">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error ?? "Hiện chưa có bài test cho cặp ngôn ngữ này."}
          </p>
          <Button
            onClick={() => {
              startTransition(async () => {
                setError(null)
                const res = await updateOnboardingStepAction("placement", {
                  skipped: true,
                })
                if (res.error) {
                  setError(res.error)
                  return
                }
                router.push("/onboarding/done")
              })
            }}
            disabled={pending}
          >
            Bỏ qua bước này
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </OnboardingShell>
    )
  }

  const q = test.questions[idx]
  const total = test.questions.length
  const Icon = SKILL_ICON[q.skill] ?? BookOpen
  const skillLabel = SKILL_LABEL[q.skill] ?? q.skill

  const choose = (choice: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: choice }))
  }

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1)
      return
    }
    // Last question — submit
    startTransition(async () => {
      setError(null)
      const payload = test.questions.map((qq) => ({
        questionId: qq.id,
        choice:     answers[qq.id] ?? -1,
      }))
      const submission = await submitPlacementAction(test.testId, payload)
      if (submission.error || !submission.result) {
        setError(submission.error ?? "Nộp bài thất bại")
        return
      }
      const update = await updateOnboardingStepAction("placement", {
        cefr:               submission.result.cefr,
        score:              submission.result.score,
        recommendedTrackId: submission.result.recommendedTrackId,
      })
      if (update.error) {
        setError(update.error)
        return
      }
      router.push("/onboarding/done")
    })
  }

  const selected = answers[q.id]
  const canProceed = selected !== undefined

  return (
    <OnboardingShell
      slug="placement"
      title="Bài kiểm tra xếp lớp"
      subtitle={`Câu ${idx + 1} / ${total}`}
    >
      <div className="space-y-6">
        <Progress value={((idx + 1) / total) * 100} />

        <div className="rounded-xl border border-border bg-surface-low p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Icon className="h-3 w-3" />
              {skillLabel}
            </Badge>
          </div>
          <p className="text-base font-medium">{q.prompt}</p>

          <div className="mt-4 space-y-2">
            {q.choices.map((choice, i) => {
              const active = selected === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-all ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface-base hover:border-primary/40"
                  }`}
                >
                  <span>{choice}</span>
                  {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={next} disabled={pending || !canProceed}>
            {idx === total - 1 ? "Nộp bài" : "Câu tiếp theo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
