"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { SettingsShell, SettingsCard } from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { FlagIcon } from "@/components/flag-icon"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { updateLearningPreferencesAction } from "../learning/actions"

const allLangs = [
  { code: "en", name: "English", native: "English" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "th", name: "Thai", native: "ไทย" },
]

export interface LanguagesClientProps {
  initial: {
    learningLanguages: string[]
  }
}

export function LanguagesClient({ initial }: LanguagesClientProps) {
  const [learning, setLearning] = useState<string[]>(initial.learningLanguages)
  const [ui, setUi] = useState("vi")
  const [native, setNative] = useState("vi")
  const [dirty, setDirty] = useState(false)
  const [feedback, setFeedback] = useState<{ ok?: boolean; msg: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 2500)
    return () => clearTimeout(t)
  }, [feedback])

  const remaining = useMemo(
    () => allLangs.filter((l) => !learning.includes(l.code)),
    [learning],
  )

  const remove = (code: string) => {
    setLearning(learning.filter((c) => c !== code))
    setDirty(true)
  }

  const add = (code: string) => {
    if (!code || learning.includes(code)) return
    setLearning([...learning, code])
    setDirty(true)
  }

  const onSave = () => {
    startTransition(async () => {
      const res = await updateLearningPreferencesAction({ learningLanguages: learning })
      if (res.error) {
        setFeedback({ ok: false, msg: res.error })
      } else {
        setFeedback({ ok: true, msg: "Đã lưu ngôn ngữ đang học" })
        setDirty(false)
      }
    })
  }

  const onCancel = () => {
    setLearning(initial.learningLanguages)
    setDirty(false)
  }

  return (
    <SettingsShell
      title="Ngôn ngữ"
      description="Quản lý ngôn ngữ đang học và giao diện"
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
        title="Ngôn ngữ đang học"
        description="Thêm hoặc xóa ngôn ngữ bạn đang theo học"
      >
        <div className="space-y-2">
          {learning.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Bạn chưa thêm ngôn ngữ nào. Thêm bên dưới để bắt đầu.
            </div>
          ) : (
            learning.map((code) => {
              const lang = allLangs.find((a) => a.code === code)
              return (
                <div
                  key={code}
                  className="flex items-center gap-4 rounded-2xl bg-surface-low p-4"
                >
                  <FlagIcon code={code} className="h-7 w-10 shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{lang?.name ?? code}</span>
                      {lang?.native && (
                        <span className="text-sm text-muted-foreground">{lang.native}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(code)}
                    className="rounded-xl text-muted-foreground hover:text-destructive"
                    aria-label={`Xóa ${lang?.name ?? code}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })
          )}
        </div>
        {remaining.length > 0 && (
          <div className="mt-4">
            <Select onValueChange={add} value="">
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Thêm ngôn ngữ…" />
              </SelectTrigger>
              <SelectContent>
                {remaining.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    <span className="flex items-center gap-2">
                      <FlagIcon code={l.code} className="h-3.5 w-5" />
                      {l.name} ({l.native})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              <Plus className="-mt-0.5 mr-1 inline h-3 w-3" />
              Chọn để thêm — nhấn “Lưu thay đổi” để cập nhật.
            </p>
          </div>
        )}
      </SettingsCard>

      <SettingsCard title="Ngôn ngữ giao diện" description="Ngôn ngữ hiển thị trong app">
        <Select
          value={ui}
          onValueChange={(v) => {
            setUi(v)
          }}
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allLangs.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                <span className="flex items-center gap-2">
                  <FlagIcon code={l.code} className="h-3.5 w-5" />
                  {l.name} ({l.native})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-2 text-xs text-muted-foreground">
          BE chưa expose `uiLanguage` qua `me`; lựa chọn này hiện chỉ áp dụng cho phiên này.
        </p>
      </SettingsCard>

      <SettingsCard title="Tiếng mẹ đẻ" description="Ngôn ngữ được dùng để dịch và giải thích">
        <Select
          value={native}
          onValueChange={(v) => {
            setNative(v)
          }}
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allLangs.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                <span className="flex items-center gap-2">
                  <FlagIcon code={l.code} className="h-3.5 w-5" />
                  {l.name} ({l.native})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsCard>
    </SettingsShell>
  )
}
