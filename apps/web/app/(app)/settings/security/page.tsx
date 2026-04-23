"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Key,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  LogOut,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react"
import {
  SettingsShell,
  SettingsCard,
  SettingsRow,
} from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const sessions = [
  {
    id: "1",
    device: "MacBook Pro 14",
    icon: Laptop,
    browser: "Chrome 120",
    location: "Hà Nội, Việt Nam",
    ip: "113.161.xx.xx",
    lastActive: "Đang hoạt động",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 14 Pro",
    icon: Smartphone,
    browser: "OmniLingo iOS",
    location: "Hà Nội, Việt Nam",
    ip: "118.68.xx.xx",
    lastActive: "3 giờ trước",
    current: false,
  },
  {
    id: "3",
    device: "iPad Air",
    icon: Tablet,
    browser: "Safari 17",
    location: "Đà Nẵng, Việt Nam",
    ip: "42.118.xx.xx",
    lastActive: "2 ngày trước",
    current: false,
  },
]

export default function SecuritySettingsPage() {
  const [twoFA, setTwoFA] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [old, setOld] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")

  const hasPasswordForm = old || next || confirm

  return (
    <SettingsShell
      title="Bảo mật"
      description="Bảo vệ tài khoản của bạn với mật khẩu mạnh và xác thực 2 lớp."
      dirty={dirty}
      onSave={() => setDirty(false)}
      onCancel={() => setDirty(false)}
    >
      {/* Change password */}
      <SettingsCard title="Đổi mật khẩu" description="Nên dùng ít nhất 12 ký tự với chữ hoa, số và ký tự đặc biệt">
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mật khẩu hiện tại</label>
            <Input
              type="password"
              value={old}
              onChange={(e) => {
                setOld(e.target.value)
                setDirty(true)
              }}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mật khẩu mới</label>
              <Input
                type="password"
                value={next}
                onChange={(e) => {
                  setNext(e.target.value)
                  setDirty(true)
                }}
                placeholder="Mật khẩu mới"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Xác nhận mật khẩu</label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setDirty(true)
                }}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>
          {next && (
            <div className="rounded-xl bg-surface-low p-3">
              <div className="text-xs font-medium text-muted-foreground">Độ mạnh</div>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4].map((i) => {
                  const strength = Math.min(4, Math.floor(next.length / 3))
                  return (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= strength
                          ? strength >= 3
                            ? "bg-emerald-500"
                            : strength === 2
                              ? "bg-amber-500"
                              : "bg-destructive"
                          : "bg-border"
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          )}
          {hasPasswordForm && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => { setOld(""); setNext(""); setConfirm(""); setDirty(false) }}>
                Huỷ
              </Button>
              <Button
                disabled={!next || next !== confirm}
                onClick={() => { setOld(""); setNext(""); setConfirm(""); setDirty(false) }}
              >
                Đổi mật khẩu
              </Button>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* 2FA */}
      <SettingsCard title="Xác thực 2 lớp (2FA)" description="Lớp bảo vệ bổ sung cho tài khoản của bạn">
        <SettingsRow
          icon={ShieldCheck}
          title="Xác thực qua ứng dụng"
          description={twoFA ? "Đã bật - Google Authenticator" : "Chưa bật - nên bật để tăng bảo mật"}
        >
          <div className="flex items-center gap-3">
            <Switch
              checked={twoFA}
              onCheckedChange={(v) => {
                setTwoFA(v)
                setDirty(true)
              }}
            />
            {twoFA && (
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href="/settings/security/2fa">
                  Cấu hình <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </SettingsRow>

        <SettingsRow
          icon={Key}
          title="Backup codes"
          description={twoFA ? "Có 8/10 mã còn hiệu lực" : "Bật 2FA để tạo backup codes"}
        >
          <Button asChild variant="outline" size="sm" className="rounded-xl" disabled={!twoFA}>
            <Link href="/settings/security/2fa">Xem</Link>
          </Button>
        </SettingsRow>
      </SettingsCard>

      {/* Active sessions */}
      <SettingsCard
        title="Phiên đăng nhập đang hoạt động"
        description="Các thiết bị đang đăng nhập vào tài khoản của bạn"
      >
        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-4 rounded-2xl bg-surface-low p-4"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{s.device}</span>
                  {s.current && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Thiết bị này
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{s.browser}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {s.lastActive}
                  </span>
                </div>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" className="rounded-xl text-destructive">
                  <LogOut className="mr-1 h-3.5 w-3.5" />
                  Đăng xuất
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <Button variant="outline" className="w-full rounded-xl text-destructive hover:bg-destructive/5">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất khỏi tất cả thiết bị khác
          </Button>
        </div>
      </SettingsCard>
    </SettingsShell>
  )
}
