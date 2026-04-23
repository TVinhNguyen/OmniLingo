"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  MapPin,
  Globe,
  Bell,
  Lock,
  Shield,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  Clock,
  Moon,
  Sun,
  Target,
  Trophy,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const sidebarItems: {
  id: string
  label: string
  icon: LucideIcon
  desc: string
}[] = [
  { id: "profile", label: "Hồ sơ", icon: User, desc: "Ảnh đại diện, tên, bio" },
  { id: "learning", label: "Học tập", icon: Target, desc: "Ngôn ngữ, mục tiêu, level" },
  { id: "notifications", label: "Thông báo", icon: Bell, desc: "Email, push, reminder" },
  { id: "privacy", label: "Riêng tư", icon: Shield, desc: "Public profile, bạn bè" },
  { id: "account", label: "Tài khoản", icon: Lock, desc: "Mật khẩu, bảo mật" },
]

const nativeLanguages = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

const learningLanguages = [
  { code: "en", name: "English", flag: "🇬🇧", level: "B2", xp: 24860 },
  { code: "ja", name: "日本語", flag: "🇯🇵", level: "A2", xp: 8420 },
  { code: "fr", name: "Français", flag: "🇫🇷", level: "A1", xp: 1230 },
]

export default function ProfileEditPage() {
  const [section, setSection] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover sm:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -bottom-14 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                <Link href="/profile" className="hover:text-white">
                  Hồ sơ
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-white">Chỉnh sửa</span>
              </div>
              <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                Chỉnh sửa hồ sơ của bạn
              </h1>
              <p className="text-sm text-white/80">
                Cập nhật thông tin cá nhân, cài đặt học tập và bảo mật.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Link href="/profile">Huỷ</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-white text-primary shadow-ambient hover:bg-white/90"
            >
              <Check className="mr-2 h-4 w-4" /> Lưu thay đổi
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          data-aos="fade-up"
          className="h-fit rounded-3xl bg-surface-lowest p-3 shadow-ambient lg:sticky lg:top-6"
        >
          {sidebarItems.map((s) => {
            const Icon = s.icon
            const active = s.id === section
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition",
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-ambient"
                    : "hover:bg-surface-low",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    active ? "bg-white/20 backdrop-blur" : "bg-surface-low",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{s.label}</p>
                  <p
                    className={cn(
                      "truncate text-[11px]",
                      active ? "text-white/80" : "text-muted-foreground",
                    )}
                  >
                    {s.desc}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    active && "rotate-90",
                  )}
                />
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <div className="space-y-6">
          {section === "profile" && <ProfileSection />}
          {section === "learning" && <LearningSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "privacy" && <PrivacySection />}
          {section === "account" && (
            <AccountSection
              showPassword={showPassword}
              onToggle={() => setShowPassword((p) => !p)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------- Sections --------------------- */

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <section
      data-aos="fade-up"
      className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
    >
      <div className="mb-5">
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </section>
  )
}

function ProfileSection() {
  return (
    <>
      <SectionCard
        title="Ảnh & thông tin cá nhân"
        desc="Thông tin này sẽ hiển thị công khai trên hồ sơ của bạn."
      >
        {/* Avatar */}
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-surface-low p-5 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarFallback className="bg-gradient-primary text-3xl font-extrabold text-primary-foreground">
                L
              </AvatarFallback>
            </Avatar>
            <button
              aria-label="Đổi ảnh đại diện"
              className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-hover hover:opacity-95"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <p className="font-bold">Ảnh đại diện</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG hoặc GIF · tối đa 2MB
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:opacity-95"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Tải lên mới
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full bg-surface-lowest"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Xoá
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Tên hiển thị" icon={User}>
            <Input
              defaultValue="Linh Nguyen"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Field label="Username" icon={Sparkles}>
            <Input
              defaultValue="linh.learns"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Field label="Email" icon={Mail}>
            <Input
              type="email"
              defaultValue="linh@example.com"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Field label="Vị trí" icon={MapPin}>
            <Input
              defaultValue="Hà Nội, Việt Nam"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Giới thiệu" icon={Sparkles}>
            <Textarea
              defaultValue="Polyglot in the making. Đang học 3 thứ tiếng để đi khắp thế giới — luôn sẵn sàng tìm bạn luyện tập!"
              className="min-h-[92px] rounded-xl border-0 bg-surface-low"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Tối đa 160 ký tự · Hiển thị dưới tên trong mọi bài đăng và hồ sơ.
            </p>
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Múi giờ" icon={Clock}>
            <Select defaultValue="vn">
              <SelectTrigger className="h-11 rounded-xl border-0 bg-surface-low">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vn">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                <SelectItem value="jp">Asia/Tokyo (GMT+9)</SelectItem>
                <SelectItem value="uk">Europe/London (GMT+0)</SelectItem>
                <SelectItem value="us">America/New_York (GMT-5)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ngôn ngữ mẹ đẻ" icon={Globe}>
            <Select defaultValue="vi">
              <SelectTrigger className="h-11 rounded-xl border-0 bg-surface-low">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nativeLanguages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    <span className="mr-1.5">{l.flag}</span> {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </SectionCard>
    </>
  )
}

function LearningSection() {
  return (
    <>
      <SectionCard
        title="Ngôn ngữ đang học"
        desc="Thêm hoặc đổi level các ngôn ngữ bạn đang theo."
      >
        <div className="space-y-3">
          {learningLanguages.map((l, i) => (
            <div
              key={l.code}
              data-aos="fade-up"
              data-aos-delay={i * 40}
              className="flex items-center gap-4 rounded-2xl bg-surface-low p-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-lowest text-2xl shadow-ambient">
                {l.flag}
              </span>
              <div className="flex-1">
                <p className="font-bold">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.xp.toLocaleString()} XP · Level {l.level}
                </p>
              </div>
              <Select defaultValue={l.level.toLowerCase()}>
                <SelectTrigger className="h-10 w-28 rounded-full border-0 bg-surface-lowest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((lv) => (
                    <SelectItem key={lv} value={lv.toLowerCase()}>
                      {lv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="mt-4 w-full rounded-2xl border-2 border-dashed border-border bg-surface-low hover:bg-surface-lowest"
        >
          + Thêm ngôn ngữ mới
        </Button>
      </SectionCard>

      <SectionCard title="Mục tiêu hàng ngày" desc="XP mà bạn cam kết đạt được mỗi ngày.">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Thường", xp: 50, desc: "10 phút" },
            { label: "Đều đặn", xp: 100, desc: "20 phút", active: true },
            { label: "Nghiêm túc", xp: 200, desc: "40 phút" },
            { label: "Điên cuồng", xp: 400, desc: "80 phút" },
          ].map((g) => (
            <button
              key={g.xp}
              className={cn(
                "rounded-2xl border-2 p-4 text-left transition",
                g.active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface-low hover:border-primary/50",
              )}
            >
              <Trophy
                className={cn(
                  "h-5 w-5",
                  g.active ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="mt-2 font-bold">{g.label}</p>
              <p className="text-xs text-muted-foreground">
                {g.xp} XP · {g.desc}
              </p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Reminder" desc="Khi nào bạn muốn được nhắc học?">
        <Row label="Bật reminder hàng ngày" desc="Push + email lúc 20:00">
          <Switch defaultChecked />
        </Row>
        <Row label="Streak alert" desc="Nhắc nếu chưa học trước 22:00">
          <Switch defaultChecked />
        </Row>
        <Row label="Weekly recap" desc="Tóm tắt tiến độ tuần vào sáng Chủ Nhật">
          <Switch />
        </Row>
      </SectionCard>
    </>
  )
}

function NotificationsSection() {
  return (
    <>
      <SectionCard title="Thông báo email" desc="Chọn loại email bạn muốn nhận.">
        <Row label="Weekly progress report" desc="Mỗi sáng Chủ Nhật">
          <Switch defaultChecked />
        </Row>
        <Row label="Streak saver" desc="Nhắc giữ streak trong ngày">
          <Switch defaultChecked />
        </Row>
        <Row label="Community mentions" desc="Khi ai đó tag bạn">
          <Switch defaultChecked />
        </Row>
        <Row label="Khuyến mãi & ưu đãi" desc="Tối đa 1 email mỗi tháng">
          <Switch />
        </Row>
      </SectionCard>

      <SectionCard title="Push notification" desc="Thông báo trên trình duyệt và ứng dụng.">
        <Row label="Nhắc học hàng ngày" desc="20:00 mỗi ngày">
          <Switch defaultChecked />
        </Row>
        <Row label="Achievement unlocked" desc="Khi mở khoá thành tích mới">
          <Switch defaultChecked />
        </Row>
        <Row label="AI Tutor message" desc="Khi Lumi phản hồi">
          <Switch defaultChecked />
        </Row>
        <Row label="Live class bắt đầu" desc="15 phút trước giờ">
          <Switch />
        </Row>
      </SectionCard>

      <SectionCard title="Chế độ im lặng">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Từ" icon={Moon}>
            <Input
              type="time"
              defaultValue="22:00"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Field label="Đến" icon={Sun}>
            <Input
              type="time"
              defaultValue="07:00"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Không nhận push/email trong khung giờ này (trừ streak cuối ngày).
        </p>
      </SectionCard>
    </>
  )
}

function PrivacySection() {
  return (
    <>
      <SectionCard title="Quyền riêng tư hồ sơ">
        <Row label="Public profile" desc="Ai cũng xem được hồ sơ của bạn">
          <Switch defaultChecked />
        </Row>
        <Row label="Hiện trên leaderboard" desc="Hiện tên và avatar trên BXH tuần">
          <Switch defaultChecked />
        </Row>
        <Row label="Cho phép tìm qua username" desc="Người khác có thể tìm bạn bằng @linh.learns">
          <Switch defaultChecked />
        </Row>
        <Row label="Hiện email cho bạn bè" desc="Chỉ bạn bè đã kết nối">
          <Switch />
        </Row>
      </SectionCard>

      <SectionCard title="Dữ liệu học tập">
        <Row label="Chia sẻ dữ liệu ẩn danh" desc="Giúp cải thiện chất lượng AI">
          <Switch defaultChecked />
        </Row>
        <Row label="Hiện tiến độ cho bạn bè" desc="Họ thấy XP, streak của bạn">
          <Switch defaultChecked />
        </Row>
      </SectionCard>

      <SectionCard title="Quản lý dữ liệu">
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-2xl bg-surface-low p-4 text-left transition hover:bg-accent-container">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-bold">Xuất dữ liệu của tôi</p>
              <p className="text-xs text-muted-foreground">
                Tải về toàn bộ data học tập (JSON + CSV)
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SectionCard>
    </>
  )
}

function AccountSection({
  showPassword,
  onToggle,
}: {
  showPassword: boolean
  onToggle: () => void
}) {
  return (
    <>
      <SectionCard title="Đổi mật khẩu">
        <div className="space-y-4">
          <Field label="Mật khẩu hiện tại" icon={Lock}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                className="h-11 rounded-xl border-0 bg-surface-low pr-10"
              />
              <button
                onClick={onToggle}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>
          <Field label="Mật khẩu mới" icon={Lock}>
            <Input
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Field label="Nhập lại mật khẩu mới" icon={Lock}>
            <Input
              type="password"
              placeholder="Nhập lại"
              className="h-11 rounded-xl border-0 bg-surface-low"
            />
          </Field>
          <Button className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:opacity-95">
            Cập nhật mật khẩu
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Xác thực hai lớp (2FA)">
        <Row label="Bật 2FA" desc="Bảo vệ tài khoản bằng ứng dụng Authenticator">
          <Switch />
        </Row>
      </SectionCard>

      <SectionCard title="Thiết bị đã đăng nhập">
        <div className="space-y-2">
          {[
            { name: "MacBook Pro 14' · Chrome", where: "Hà Nội, VN", time: "Hiện tại", current: true },
            { name: "iPhone 15 · Lumi app", where: "Hà Nội, VN", time: "2 giờ trước" },
            { name: "Windows · Firefox", where: "Tokyo, JP", time: "3 ngày trước" },
          ].map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between rounded-2xl bg-surface-low p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{d.name}</p>
                  {d.current && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                      Hiện tại
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {d.where} · {d.time}
                </p>
              </div>
              {!d.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-destructive hover:bg-destructive/10"
                >
                  Đăng xuất
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Nguy hiểm">
        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left transition hover:bg-destructive/10">
            <div>
              <p className="flex items-center gap-2 font-bold text-destructive">
                <LogOut className="h-4 w-4" />
                Đăng xuất tất cả thiết bị
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Bạn sẽ phải đăng nhập lại trên mọi thiết bị
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive" />
          </button>
          <button className="flex w-full items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left transition hover:bg-destructive/10">
            <div>
              <p className="flex items-center gap-2 font-bold text-destructive">
                <Trash2 className="h-4 w-4" />
                Xoá tài khoản
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ bị xoá vĩnh viễn.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </SectionCard>
    </>
  )
}

/* --------------------- Primitives --------------------- */

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon?: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </Label>
      {children}
    </div>
  )
}

function Row({
  label,
  desc,
  children,
}: {
  label: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        {desc && (
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
