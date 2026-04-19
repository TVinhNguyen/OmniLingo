"use client";

import { User, Bell, Lock, CreditCard, Globe2, Palette, LogOut, Trash2, Check, Loader2 } from "lucide-react";
import { useState, useActionState } from "react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/api/types";
import { logoutAction } from "@/lib/auth/actions";
import { updateProfileAction, type UpdateProfileState } from "./actions";

interface SettingsClientProps {
  user: UserType;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const [profileState, profileAction, isPending] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    {},
  );
  const [notifications, setNotifications] = useState({
    daily: true,
    streak: true,
    community: false,
    email: true,
    marketing: false,
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          Cài đặt
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Tùy chỉnh
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý tài khoản, thông báo và quyền riêng tư.
        </p>
      </div>

      <Tabs defaultValue="account" orientation="vertical">
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          <TabsList className="flex h-auto flex-row flex-wrap justify-start bg-transparent p-0 md:flex-col md:items-stretch">
            <TabsTrigger value="account" className="justify-start gap-2">
              <User className="size-4" /> Tài khoản
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start gap-2">
              <Bell className="size-4" /> Thông báo
            </TabsTrigger>
            <TabsTrigger value="appearance" className="justify-start gap-2">
              <Palette className="size-4" /> Giao diện
            </TabsTrigger>
            <TabsTrigger value="language" className="justify-start gap-2">
              <Globe2 className="size-4" /> Ngôn ngữ UI
            </TabsTrigger>
            <TabsTrigger value="billing" className="justify-start gap-2">
              <CreditCard className="size-4" /> Thanh toán
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start gap-2">
              <Lock className="size-4" /> Bảo mật
            </TabsTrigger>
          </TabsList>

          <div>
            {/* Account — pre-filled with real user data */}
            <TabsContent value="account" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Hồ sơ</h2>
                <form action={profileAction} className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="mb-1.5 block text-sm">Tên hiển thị</Label>
                    <Input id="displayName" name="displayName" defaultValue={user.username} />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="mb-1.5 block text-sm">Bio</Label>
                    <Input id="bio" name="bio" defaultValue={user.bio ?? ""} />
                  </div>
                  {profileState.error && (
                    <p className="text-sm text-destructive">{profileState.error}</p>
                  )}
                  {profileState.success && (
                    <p className="text-sm text-green-600 dark:text-green-400">Đã lưu thành công!</p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit" className="rounded-full" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Thông báo</h2>
                <div className="space-y-1">
                  <ToggleRow
                    label="Nhắc nhở học hàng ngày"
                    description="Nhắc bạn học lúc 7 giờ tối mỗi ngày."
                    checked={notifications.daily}
                    onChange={(v) => setNotifications({ ...notifications, daily: v })}
                  />
                  <ToggleRow
                    label="Cảnh báo mất chuỗi"
                    description="Báo trước khi mất streak."
                    checked={notifications.streak}
                    onChange={(v) => setNotifications({ ...notifications, streak: v })}
                  />
                  <ToggleRow
                    label="Trả lời cộng đồng"
                    description="Thông báo khi có người trả lời bài của bạn."
                    checked={notifications.community}
                    onChange={(v) => setNotifications({ ...notifications, community: v })}
                  />
                  <ToggleRow
                    label="Email Newsletter"
                    description="Bản tin hàng tuần với mẹo và câu chuyện."
                    checked={notifications.email}
                    onChange={(v) => setNotifications({ ...notifications, email: v })}
                  />
                  <ToggleRow
                    label="Marketing"
                    description="Khuyến mãi và tin tức sản phẩm."
                    checked={notifications.marketing}
                    onChange={(v) => setNotifications({ ...notifications, marketing: v })}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Appearance — real theme switching */}
            <TabsContent value="appearance" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Giao diện</h2>
                <div className="grid gap-3 sm:grid-cols-2 max-w-xs">
                  {[
                    { value: "light", label: "Sáng", preview: "bg-[oklch(0.985_0.005_85)] border border-border/60" },
                    { value: "dark",  label: "Tối",  preview: "bg-[oklch(0.12_0.02_250)]" },
                  ].map((t) => {
                    const active = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                          "rounded-2xl border-2 p-3 text-left transition hover:border-primary",
                          active ? "border-primary" : "border-border",
                        )}
                      >
                        <div className={`mb-2 h-16 rounded-lg ${t.preview}`} />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t.label}</span>
                          {active && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* UI Language */}
            <TabsContent value="language" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Ngôn ngữ giao diện</h2>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  Thay đổi menu và nhãn UI — không ảnh hưởng ngôn ngữ bạn đang học.
                </p>
              </Card>
            </TabsContent>

            {/* Billing — mock (billing-service integration Phase 1.5) */}
            <TabsContent value="billing" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-1 font-serif text-xl font-semibold">Gói hiện tại</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Tích hợp thanh toán — Phase 1.5
                </p>
                <div className="rounded-xl border border-border/60 p-4 text-sm text-muted-foreground">
                  Thông tin thanh toán sẽ được hiển thị sau khi billing-service được tích hợp.
                </div>
              </Card>
            </TabsContent>

            {/* Security — logout wired to real Server Action */}
            <TabsContent value="security" className="m-0 space-y-4">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Bảo mật</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between rounded-full bg-transparent">
                    Đổi mật khẩu
                    <span>→</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-between rounded-full bg-transparent">
                    Bật xác thực 2 bước
                    <Badge variant="secondary" className="rounded-full">
                      Tắt
                    </Badge>
                  </Button>
                </div>
              </Card>

              <Card className="border-destructive/30 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold text-destructive">
                  Vùng nguy hiểm
                </h2>
                <div className="space-y-3">
                  {/* Real logout — calls Server Action → clearSession → redirect "/" */}
                  <form action={logoutAction}>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full justify-start rounded-full bg-transparent"
                    >
                      <LogOut className="mr-2 size-4" />
                      Đăng xuất khỏi tất cả thiết bị
                    </Button>
                  </form>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-full border-destructive/50 bg-transparent text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Xóa tài khoản
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <Input type={type} defaultValue={defaultValue} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-4 last:border-0">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
