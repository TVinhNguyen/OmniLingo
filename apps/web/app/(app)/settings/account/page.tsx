"use client"

import { useState, useActionState } from "react"
import { SettingsShell, SettingsCard } from "@/components/app/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Mail, Key, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { changePasswordAction, deleteAccountAction } from "@/lib/auth/actions"

export default function AccountSettingsPage() {
  // ─── Change password form ────────────────────────────────────────────────────
  const [pwState, pwAction, isPendingPw] = useActionState(changePasswordAction, undefined)

  // ─── Delete account confirmation ─────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteState, deleteAction, isPendingDelete] = useActionState(deleteAccountAction, undefined)

  return (
    <SettingsShell
      title="Tài khoản"
      description="Quản lý thông tin đăng nhập và bảo mật tài khoản"
    >
      {/* Email section — read-only for now (email change requires flow §01) */}
      <SettingsCard title="Email" description="Email dùng để đăng nhập và nhận thông báo">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              disabled
              defaultValue=""
              placeholder="Đang tải…"
              className="h-11 rounded-xl pl-10"
            />
          </div>
          <Button variant="outline" className="rounded-xl bg-transparent" disabled>
            Xác minh
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Email hiện đã xác minh. Thay đổi email sẽ cần xác minh lại.
        </p>
      </SettingsCard>

      {/* Change password */}
      <SettingsCard title="Đổi mật khẩu" description="Cập nhật mật khẩu để bảo mật tài khoản">
        <form action={pwAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mật khẩu hiện tại</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="oldPassword"
                type="password"
                required
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mật khẩu mới</label>
            <Input
              name="newPassword"
              type="password"
              required
              minLength={10}
              className="h-11 rounded-xl"
              placeholder="Tối thiểu 10 ký tự"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Xác nhận mật khẩu mới</label>
            <Input
              name="confirm"
              type="password"
              required
              className="h-11 rounded-xl"
            />
          </div>

          {pwState?.error && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {pwState.error}
            </p>
          )}
          {pwState?.success && (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="h-4 w-4 shrink-0" /> Mật khẩu đã được cập nhật.
            </p>
          )}

          <Button type="submit" disabled={isPendingPw} className="rounded-xl">
            {isPendingPw ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang cập nhật…</>
            ) : "Cập nhật mật khẩu"}
          </Button>
        </form>
      </SettingsCard>

      {/* Danger zone — delete account */}
      <SettingsCard danger title="Vùng nguy hiểm" description="Hành động không thể hoàn tác">
        {showDeleteConfirm ? (
          <form action={deleteAction} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nhập mật khẩu hiện tại để xác nhận xóa tài khoản. Tất cả dữ liệu sẽ bị xóa trong 30 ngày.
            </p>
            <Input
              name="password"
              type="password"
              required
              placeholder="Mật khẩu của bạn"
              className="h-11 rounded-xl"
            />
            {deleteState?.error && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" /> {deleteState.error}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPendingDelete}
                className="rounded-xl"
              >
                {isPendingDelete ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xóa…</>
                ) : (
                  <><Trash2 className="mr-2 h-4 w-4" />Xác nhận xóa tài khoản</>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <div className="font-medium">Xóa tài khoản</div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Mọi dữ liệu sẽ bị xóa vĩnh viễn trong 30 ngày
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa tài khoản
            </Button>
          </div>
        )}
      </SettingsCard>
    </SettingsShell>
  )
}
