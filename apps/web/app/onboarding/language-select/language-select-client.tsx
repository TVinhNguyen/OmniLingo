"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagIcon, flagMap, type LangCode } from "@/components/flag-icon"
import { OnboardingShell } from "../_shell"
import { updateOnboardingStepAction } from "../actions"

const LANGS: LangCode[] = ["en", "ja", "zh", "ko", "fr", "de", "es", "vi"]

export default function LanguageSelectClient({
  defaultNativeLang,
  defaultTargetLangs,
}: {
  defaultNativeLang: string
  defaultTargetLangs: string[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [nativeLang, setNativeLang] = useState<LangCode>(defaultNativeLang as LangCode)
  const [targets, setTargets] = useState<LangCode[]>(defaultTargetLangs as LangCode[])

  const toggle = (code: LangCode) => {
    setTargets((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  const next = () => {
    if (targets.length === 0) {
      setError("Chọn ít nhất 1 ngôn ngữ bạn muốn học.")
      return
    }
    startTransition(async () => {
      setError(null)
      const res = await updateOnboardingStepAction("language_select", {
        nativeLang,
        targetLangs: targets,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      router.push("/onboarding/goal-select")
    })
  }

  return (
    <OnboardingShell
      slug="language-select"
      title="Bạn muốn học ngôn ngữ nào?"
      subtitle="Chọn ngôn ngữ mẹ đẻ và 1+ ngôn ngữ bạn muốn học."
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Ngôn ngữ mẹ đẻ</label>
          <div className="grid grid-cols-4 gap-2">
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setNativeLang(code)}
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                  nativeLang === code
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface-low hover:border-primary/40"
                }`}
              >
                <FlagIcon code={code} size={20} />
                <span>{flagMap[code].native}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Ngôn ngữ muốn học</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LANGS.filter((c) => c !== nativeLang).map((code) => {
              const active = targets.includes(code)
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggle(code)}
                  className={`relative flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40"
                  }`}
                >
                  <FlagIcon code={code} size={20} />
                  <span>{flagMap[code].native}</span>
                  {active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
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
