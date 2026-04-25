"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sun, Moon, Monitor, Type, Sparkles } from "lucide-react"
import {
  SettingsShell,
  SettingsCard,
  SettingsRow,
} from "@/components/app/settings-shell"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export default function AccessibilitySettingsPage() {
  const [fontSize, setFontSize] = useState(16)
  const [dyslexia, setDyslexia] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [captions, setCaptions] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dirty, setDirty] = useState(false)

  const mark = () => setDirty(true)

  const themes = [
    { id: "light", label: "Sáng", icon: Sun },
    { id: "dark", label: "Tối", icon: Moon },
    { id: "system", label: "Theo hệ thống", icon: Monitor },
  ] as const

  return (
    <SettingsShell
      title="Trợ năng & Giao diện"
      description="Tinh chỉnh để học tập thoải mái nhất cho đôi mắt của bạn."
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
    >
      {/* Theme */}
      <SettingsCard title="Giao diện" description="Chọn màu nền cho toàn bộ ứng dụng">
        <div className="grid gap-3 sm:grid-cols-3">
          {themes.map((t) => {
            const active = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  mark()
                }}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-ambient"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    t.id === "dark"
                      ? "bg-foreground text-background"
                      : t.id === "light"
                        ? "bg-surface-lowest shadow-ambient"
                        : "bg-gradient-to-br from-surface-lowest to-foreground text-foreground"
                  }`}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">{t.label}</span>
                {active && (
                  <motion.div
                    layoutId="theme-active"
                    className="h-1 w-8 rounded-full bg-primary"
                  />
                )}
              </button>
            )
          })}
        </div>
      </SettingsCard>

      {/* Font */}
      <SettingsCard title="Kiểu chữ & Kích thước" description="Xem trực tiếp bên dưới">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Kích thước chữ</span>
              <span className="text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(v) => {
                setFontSize(v[0])
                mark()
              }}
              min={12}
              max={24}
              step={1}
            />
            <div
              className={`mt-4 rounded-2xl bg-surface-low p-5 ${dyslexia ? "font-mono" : ""}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            >
              <strong>The quick brown fox</strong> jumps over the lazy dog. Cáo nâu
              nhanh nhảy qua con chó lười.
            </div>
          </div>

          <SettingsRow
            icon={Type}
            title="Font dành cho người khó đọc (Dyslexia)"
            description="Dùng font OpenDyslexic cho các đoạn văn dài"
          >
            <Switch
              checked={dyslexia}
              onCheckedChange={(v) => {
                setDyslexia(v)
                mark()
              }}
            />
          </SettingsRow>
        </div>
      </SettingsCard>

      {/* Motion & contrast */}
      <SettingsCard title="Chuyển động & Độ tương phản">
        <SettingsRow
          icon={Sparkles}
          title="Giảm chuyển động"
          description="Tắt hầu hết animation khi di chuyển giữa các trang"
        >
          <Switch
            checked={reduceMotion}
            onCheckedChange={(v) => {
              setReduceMotion(v)
              mark()
            }}
          />
        </SettingsRow>
        <SettingsRow
          title="Tăng độ tương phản"
          description="Chữ và viền đậm hơn để dễ nhìn"
        >
          <Switch
            checked={highContrast}
            onCheckedChange={(v) => {
              setHighContrast(v)
              mark()
            }}
          />
        </SettingsRow>
        <SettingsRow
          title="Luôn bật phụ đề"
          description="Tự động hiển thị transcript cho mọi audio/video"
        >
          <Switch
            checked={captions}
            onCheckedChange={(v) => {
              setCaptions(v)
              mark()
            }}
          />
        </SettingsRow>
      </SettingsCard>
    </SettingsShell>
  )
}
