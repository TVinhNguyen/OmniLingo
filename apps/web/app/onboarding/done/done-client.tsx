"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "../_shell"
import { completeOnboardingAction } from "../actions"

export default function DoneClient({
  placementCefr,
  recommendedTrackId,
  answers,
}: {
  placementCefr: string | null
  recommendedTrackId: string | null
  answers: Record<string, unknown>
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const targetLangs = (answers.targetLangs as string[] | undefined) ?? []
  const goal = answers.goal as string | undefined
  const dailyMins = answers.dailyMins as number | undefined

  const start = () => {
    startTransition(async () => {
      setError(null)
      const res = await completeOnboardingAction(placementCefr, recommendedTrackId)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <OnboardingShell
      slug="done"
      title="Sẵn sàng bắt đầu!"
      subtitle="Chúng tôi đã chuẩn bị lộ trình phù hợp cho bạn."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-soft p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Tóm tắt</h2>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {targetLangs.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ngôn ngữ học</dt>
                <dd className="font-medium">{targetLangs.join(", ")}</dd>
              </div>
            )}
            {goal && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mục tiêu</dt>
                <dd className="font-medium">{goal}</dd>
              </div>
            )}
            {dailyMins != null && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mỗi ngày</dt>
                <dd className="font-medium">{dailyMins} phút</dd>
              </div>
            )}
            {placementCefr && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Trình độ xếp lớp</dt>
                <dd>
                  <Badge>{placementCefr}</Badge>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={start} disabled={pending}>
            Bắt đầu học
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
