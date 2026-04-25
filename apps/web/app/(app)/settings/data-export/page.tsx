"use client"

import { useState } from "react"
import { Download, FileJson, FileText, Clock, CheckCircle2 } from "lucide-react"
import { SettingsShell } from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const dataCategories = [
  { id: "profile", label: "Hồ sơ & tài khoản", size: "2 KB" },
  { id: "progress", label: "Tiến độ học tập", size: "1.2 MB" },
  { id: "vocabulary", label: "Bộ thẻ từ vựng", size: "340 KB" },
  { id: "writing", label: "Bài viết & bản nháp", size: "820 KB" },
  { id: "messages", label: "Tin nhắn & bình luận", size: "150 KB" },
  { id: "audio", label: "Bản ghi âm phát âm", size: "12.4 MB" },
  { id: "certificates", label: "Chứng chỉ & huy hiệu", size: "80 KB" },
]

const previousExports = [
  { id: 1, date: "15 Th10 2026", format: "JSON", size: "14.2 MB", status: "ready" },
  { id: 2, date: "02 Th09 2026", format: "PDF", size: "8.1 MB", status: "ready" },
]

export default function DataExportPage() {
  const [selected, setSelected] = useState<string[]>(dataCategories.map((c) => c.id))
  const [format, setFormat] = useState<"json" | "pdf">("json")
  const [processing, setProcessing] = useState(false)

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const handleExport = () => {
    setProcessing(true)
    setTimeout(() => setProcessing(false), 3000)
  }

  return (
    <SettingsShell
      title="Xuất dữ liệu"
      description="Tải toàn bộ dữ liệu của bạn theo đúng quyền GDPR."
    >
      {/* Format */}
      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h3 className="text-lg font-bold">Định dạng xuất</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { id: "json", label: "JSON", icon: FileJson, desc: "Máy đọc, đầy đủ dữ liệu" },
            { id: "pdf", label: "PDF", icon: FileText, desc: "Người đọc, định dạng đẹp" },
          ].map((f) => {
            const Icon = f.icon
            const active = format === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as "json" | "pdf")}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-hover"
                    : "border-border bg-surface-lowest hover:border-primary/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    active ? "bg-gradient-primary text-white" : "bg-surface-low text-foreground-soft"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{f.label}</div>
                  <div className="text-xs text-foreground-soft">{f.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h3 className="text-lg font-bold">Chọn dữ liệu xuất</h3>
        <div className="mt-4 space-y-2">
          {dataCategories.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-low p-3 transition-colors hover:bg-surface"
            >
              <Checkbox
                checked={selected.includes(c.id)}
                onCheckedChange={() => toggle(c.id)}
              />
              <span className="flex-1 font-medium">{c.label}</span>
              <span className="text-sm text-foreground-muted">{c.size}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleExport}
        disabled={processing || selected.length === 0}
        className="w-full gap-2 bg-gradient-primary"
      >
        {processing ? (
          <>
            <Clock className="h-5 w-5 animate-spin" />
            Đang chuẩn bị dữ liệu...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Xuất {selected.length} mục
          </>
        )}
      </Button>

      {/* Previous exports */}
      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h3 className="text-lg font-bold">Lần xuất trước</h3>
        <div className="mt-4 space-y-2">
          {previousExports.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-2xl bg-surface-low p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Xuất {e.format} · {e.size}</div>
                  <div className="text-xs text-foreground-muted">{e.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success/15 text-success hover:bg-success/20">Sẵn sàng</Badge>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Tải
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsShell>
  )
}
