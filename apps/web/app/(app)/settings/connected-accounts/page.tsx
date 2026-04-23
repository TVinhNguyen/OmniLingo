"use client"

import { useState } from "react"
import { Check, Plus, Shield } from "lucide-react"
import {
  SettingsShell,
  SettingsCard,
} from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"

type Provider = {
  id: string
  name: string
  description: string
  connected: boolean
  email?: string
  color: string
  logo: string
}

const initial: Provider[] = [
  {
    id: "google",
    name: "Google",
    description: "Đăng nhập nhanh, đồng bộ lịch học với Google Calendar",
    connected: true,
    email: "minh@gmail.com",
    color: "from-[#ea4335] to-[#fbbc04]",
    logo: "G",
  },
  {
    id: "apple",
    name: "Apple",
    description: "Đăng nhập Sign in with Apple, bảo mật cao",
    connected: false,
    color: "from-foreground to-muted-foreground",
    logo: "",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Tìm bạn bè học cùng, chia sẻ thành tích",
    connected: true,
    email: "Minh Anh",
    color: "from-[#1877f2] to-[#42a5f5]",
    logo: "f",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Đăng nhập dành cho nhà phát triển",
    connected: false,
    color: "from-foreground to-[#333]",
    logo: "",
  },
  {
    id: "line",
    name: "LINE",
    description: "Phổ biến tại Nhật/Đài, đăng nhập và thông báo",
    connected: false,
    color: "from-[#06c755] to-[#4dd885]",
    logo: "L",
  },
  {
    id: "kakao",
    name: "Kakao",
    description: "Phổ biến tại Hàn Quốc",
    connected: false,
    color: "from-[#fee500] to-[#ffe924]",
    logo: "K",
  },
]

export default function ConnectedAccountsPage() {
  const [providers, setProviders] = useState<Provider[]>(initial)

  const toggle = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, connected: !p.connected } : p
      )
    )
  }

  const connectedCount = providers.filter((p) => p.connected).length

  return (
    <SettingsShell
      title="Tài khoản liên kết"
      description="Liên kết các tài khoản bên thứ ba để đăng nhập nhanh và chia sẻ dễ dàng."
    >
      <SettingsCard>
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Đã liên kết {connectedCount} tài khoản</div>
            <p className="text-sm text-muted-foreground">
              Đăng nhập 1 chạm và dùng dữ liệu từ các dịch vụ khác.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Nhà cung cấp đăng nhập">
        <div className="space-y-2">
          {providers.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-2xl bg-surface-low p-4 transition-colors hover:bg-surface-high"
            >
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white font-bold text-lg shadow-ambient`}
              >
                {p.logo || p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{p.name}</span>
                  {p.connected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <Check className="h-3 w-3" />
                      Đã liên kết
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {p.connected && p.email
                    ? p.email
                    : p.description}
                </p>
              </div>
              {p.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-destructive hover:bg-destructive/5"
                  onClick={() => toggle(p.id)}
                >
                  Huỷ liên kết
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={() => toggle(p.id)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Kết nối
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Khi huỷ liên kết, bạn sẽ không thể đăng nhập bằng dịch vụ đó nữa - hãy
          đặt mật khẩu OmniLingo trước khi huỷ.
        </p>
      </SettingsCard>
    </SettingsShell>
  )
}
