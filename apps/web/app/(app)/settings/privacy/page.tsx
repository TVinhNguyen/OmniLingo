"use client"

import { useState } from "react"
import { SettingsShell, SettingsCard } from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, Eye, Users, Lock, X } from "lucide-react"

const visibilityOptions = [
  {
    id: "public",
    label: "Công khai",
    desc: "Mọi người có thể xem profile",
    icon: Eye,
  },
  {
    id: "friends",
    label: "Bạn bè",
    desc: "Chỉ bạn bè xem được",
    icon: Users,
  },
  {
    id: "private",
    label: "Riêng tư",
    desc: "Chỉ mình bạn",
    icon: Lock,
  },
]

const blocked = [
  { name: "User 123", avatar: "U1", blocked: "5 ngày trước" },
  { name: "Spammer456", avatar: "SP", blocked: "2 tuần trước" },
]

export default function PrivacySettingsPage() {
  const [visibility, setVisibility] = useState("friends")
  const [dirty, setDirty] = useState(false)

  return (
    <SettingsShell
      title="Quyền riêng tư"
      description="Kiểm soát ai thấy gì và quản lý dữ liệu của bạn"
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
    >
      <SettingsCard title="Hiển thị profile" description="Ai có thể xem thông tin của bạn">
        <div className="grid gap-3 sm:grid-cols-3">
          {visibilityOptions.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setVisibility(o.id)
                setDirty(true)
              }}
              className={`rounded-2xl p-4 text-left transition-all ${
                visibility === o.id
                  ? "bg-primary text-primary-foreground shadow-hover"
                  : "bg-surface-low hover:bg-primary/5"
              }`}
            >
              <o.icon className="mb-2 h-5 w-5" />
              <div className="font-semibold">{o.label}</div>
              <div
                className={`text-xs ${
                  visibility === o.id ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {o.desc}
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Danh sách chặn"
        description={`${blocked.length} người đã bị chặn`}
      >
        <div className="space-y-2">
          {blocked.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-surface-low p-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-sm font-bold">
                {b.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{b.name}</div>
                <div className="text-xs text-muted-foreground">Chặn {b.blocked}</div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <X className="mr-1 h-3.5 w-3.5" />
                Bỏ chặn
              </Button>
            </div>
          ))}
          {blocked.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">Chưa chặn ai</p>
          )}
        </div>
      </SettingsCard>

      <SettingsCard title="Dữ liệu" description="Quản lý dữ liệu cá nhân của bạn (GDPR)">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-surface-low p-4">
            <div>
              <div className="font-medium">Tải xuống dữ liệu</div>
              <div className="text-xs text-muted-foreground">
                Nhận file JSON chứa toàn bộ dữ liệu của bạn
              </div>
            </div>
            <Button variant="outline" className="rounded-xl bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard danger title="Xóa dữ liệu" description="Hành động không thể hoàn tác">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <div className="font-medium">Xóa toàn bộ dữ liệu học tập</div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Xóa tất cả từ vựng, decks, lịch sử, progress. Tài khoản vẫn được giữ.
            </p>
            <Button variant="destructive" className="mt-3 rounded-xl">
              Xóa dữ liệu học tập
            </Button>
          </div>
        </div>
      </SettingsCard>
    </SettingsShell>
  )
}
