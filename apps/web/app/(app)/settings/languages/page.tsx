"use client"

import { useState } from "react"
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
import { Plus, Trash2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function LanguagesSettingsPage() {
  const [learning, setLearning] = useState([
    { code: "en", level: "B2", primary: true },
    { code: "ja", level: "A2", primary: false },
  ])
  const [ui, setUi] = useState("vi")
  const [native, setNative] = useState("vi")
  const [dirty, setDirty] = useState(false)

  return (
    <SettingsShell
      title="Ngôn ngữ"
      description="Quản lý ngôn ngữ đang học và giao diện"
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
    >
      <SettingsCard
        title="Ngôn ngữ đang học"
        description="Thêm hoặc xóa ngôn ngữ bạn đang theo học"
      >
        <div className="space-y-2">
          {learning.map((l, i) => {
            const lang = allLangs.find((a) => a.code === l.code)
            if (!lang) return null
            return (
              <div
                key={l.code}
                className="flex items-center gap-4 rounded-2xl bg-surface-low p-4"
              >
                <FlagIcon code={l.code} className="h-7 w-10 shrink-0 rounded" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-sm text-muted-foreground">{lang.native}</span>
                    {l.primary && (
                      <Badge className="bg-warning/10 text-warning" variant="secondary">
                        <Star className="mr-1 h-3 w-3 fill-warning" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Level {l.level}</div>
                </div>
                {!l.primary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLearning(learning.map((x) => ({ ...x, primary: x.code === l.code })))
                      setDirty(true)
                    }}
                    className="rounded-xl"
                  >
                    Đặt primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setLearning(learning.filter((x) => x.code !== l.code))
                    setDirty(true)
                  }}
                  className="rounded-xl text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
        <Button variant="outline" className="mt-4 w-full gap-2 rounded-xl bg-transparent">
          <Plus className="h-4 w-4" />
          Thêm ngôn ngữ
        </Button>
      </SettingsCard>

      <SettingsCard title="Ngôn ngữ giao diện" description="Ngôn ngữ hiển thị trong app">
        <Select
          value={ui}
          onValueChange={(v) => {
            setUi(v)
            setDirty(true)
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

      <SettingsCard title="Tiếng mẹ đẻ" description="Ngôn ngữ được dùng để dịch và giải thích">
        <Select
          value={native}
          onValueChange={(v) => {
            setNative(v)
            setDirty(true)
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
                  {l.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsCard>
    </SettingsShell>
  )
}
