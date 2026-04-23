"use client"

import { useState } from "react"
import { Shield, Smartphone, Mail, Key, Copy, Download, CheckCircle2 } from "lucide-react"
import { SettingsShell, SettingsRow } from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TwoFactorSettingsPage() {
  const [authEnabled, setAuthEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  const backupCodes = [
    "XK4P-9M2N", "7TRZ-8QWL", "HB3G-YF5K", "92JV-NX6C",
    "WD8L-PM2R", "K5XQ-7BJF", "VN9T-3GHM", "R6CP-8YLD",
  ]

  return (
    <SettingsShell
      title="Xác thực 2 lớp (2FA)"
      description="Thêm lớp bảo mật bổ sung để bảo vệ tài khoản của bạn."
    >
      {/* Status banner */}
      <div className="flex items-center gap-4 rounded-3xl bg-gradient-primary p-6 text-white shadow-hover">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Shield className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold">2FA đang bật</div>
          <p className="text-sm text-white/90">
            Tài khoản của bạn được bảo vệ bằng xác thực 2 lớp. Tuyệt vời!
          </p>
        </div>
        <CheckCircle2 className="h-8 w-8 text-white" />
      </div>

      {/* Authenticator app */}
      <SettingsRow
        icon={Smartphone}
        title="Ứng dụng xác thực"
        description="Google Authenticator, Authy, 1Password..."
      >
        <div className="flex items-center justify-between">
          <div>
            {authEnabled ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-success/15 text-success hover:bg-success/20">Đang bật</Badge>
                <span className="text-sm text-foreground-soft">Đã cấu hình với Google Authenticator</span>
              </div>
            ) : (
              <span className="text-sm text-foreground-soft">Chưa bật</span>
            )}
          </div>
          <Switch checked={authEnabled} onCheckedChange={setAuthEnabled} />
        </div>
        {authEnabled && (
          <Button variant="outline" className="mt-4 gap-2">
            <Key className="h-4 w-4" />
            Cấu hình lại
          </Button>
        )}
      </SettingsRow>

      {/* SMS */}
      <SettingsRow
        icon={Smartphone}
        title="Tin nhắn SMS"
        description="Nhận mã qua tin nhắn điện thoại."
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground-soft">
            {smsEnabled ? "+84 *** *** 678" : "Chưa thêm số điện thoại"}
          </div>
          <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
        </div>
        {smsEnabled && (
          <div className="mt-4 flex gap-2">
            <Input placeholder="+84 ..." className="bg-surface-low" />
            <Button variant="outline">Cập nhật</Button>
          </div>
        )}
      </SettingsRow>

      {/* Email */}
      <SettingsRow
        icon={Mail}
        title="Email"
        description="Nhận mã xác thực qua email (ít an toàn hơn)."
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground-soft">vinhnguyen@example.com</div>
          <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
        </div>
      </SettingsRow>

      {/* Backup codes */}
      <SettingsRow
        icon={Key}
        title="Mã dự phòng"
        description="Sử dụng nếu bạn không truy cập được thiết bị xác thực."
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBackupCodes((v) => !v)}
          >
            {showBackupCodes ? "Ẩn" : "Hiện"} mã
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Tải xuống
          </Button>
          <Button variant="outline">Tạo lại</Button>
        </div>
        {showBackupCodes && (
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-surface-low p-4 font-mono text-sm md:grid-cols-4">
            {backupCodes.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-surface-lowest px-3 py-2"
              >
                <span>{c}</span>
                <Copy className="h-3.5 w-3.5 cursor-pointer text-foreground-muted hover:text-primary" />
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-foreground-muted">
          Mỗi mã chỉ dùng được một lần. Cất giữ ở nơi an toàn.
        </p>
      </SettingsRow>
    </SettingsShell>
  )
}
