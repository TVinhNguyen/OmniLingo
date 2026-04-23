"use client"

import { useState } from "react"
import { SettingsShell, SettingsCard } from "@/components/app/settings-shell"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Bell, Mail, Smartphone } from "lucide-react"

const rows = [
  { id: "srs", label: "Nhắc ôn tập (SRS)", desc: "Từ và bài sắp đến hạn" },
  { id: "streak", label: "Streak", desc: "Nhắc duy trì streak hàng ngày" },
  { id: "social", label: "Cộng đồng", desc: "Reply, mention, like" },
  { id: "promotions", label: "Khuyến mãi", desc: "Sale, ưu đãi, sự kiện" },
  { id: "system", label: "Hệ thống", desc: "Bảo mật, cập nhật tài khoản" },
]

const channels = [
  { id: "push", label: "Push", icon: Smartphone },
  { id: "email", label: "Email", icon: Mail },
  { id: "inapp", label: "In-app", icon: Bell },
]

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, Record<string, boolean>>>({
    srs: { push: true, email: false, inapp: true },
    streak: { push: true, email: true, inapp: true },
    social: { push: false, email: false, inapp: true },
    promotions: { push: false, email: true, inapp: false },
    system: { push: true, email: true, inapp: true },
  })
  const [frequency, setFrequency] = useState("daily")
  const [dirty, setDirty] = useState(false)

  const toggle = (rowId: string, chanId: string) => {
    setPrefs({
      ...prefs,
      [rowId]: { ...prefs[rowId], [chanId]: !prefs[rowId][chanId] },
    })
    setDirty(true)
  }

  return (
    <SettingsShell
      title="Thông báo"
      description="Điều chỉnh cách bạn nhận thông báo"
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
    >
      <SettingsCard
        title="Tần suất tổng"
        description="Áp dụng cho tất cả email và push nhóm"
      >
        <Select
          value={frequency}
          onValueChange={(v) => {
            setFrequency(v)
            setDirty(true)
          }}
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Realtime - ngay khi có</SelectItem>
            <SelectItem value="daily">Daily digest - 1 lần/ngày</SelectItem>
            <SelectItem value="weekly">Weekly digest - 1 lần/tuần</SelectItem>
            <SelectItem value="off">Tắt hoàn toàn</SelectItem>
          </SelectContent>
        </Select>
      </SettingsCard>

      <SettingsCard
        title="Kênh thông báo chi tiết"
        description="Điều chỉnh theo loại thông báo và kênh"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Loại thông báo
                </th>
                {channels.map((c) => (
                  <th
                    key={c.id}
                    className="pb-3 text-center text-xs font-medium uppercase text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <c.icon className="h-3.5 w-3.5" />
                      {c.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </td>
                  {channels.map((c) => (
                    <td key={c.id} className="py-3 text-center">
                      <Switch
                        checked={prefs[r.id][c.id]}
                        onCheckedChange={() => toggle(r.id, c.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </SettingsShell>
  )
}
