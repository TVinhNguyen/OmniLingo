"use client"

import { motion } from "motion/react"
import {
  Bell,
  Flame,
  Trophy,
  MessageSquare,
  Users,
  CheckCircle2,
  Sparkles,
  Calendar,
  Gift,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const notifications = [
  {
    id: 1,
    icon: Flame,
    iconColor: "from-amber-400 to-orange-500",
    title: "Chuỗi 12 ngày!",
    desc: "Tuyệt vời! Bạn đã duy trì streak 12 ngày liên tiếp. Tiếp tục phát huy!",
    time: "2 phút trước",
    unread: true,
    type: "streak",
  },
  {
    id: 2,
    icon: MessageSquare,
    iconColor: "from-primary to-accent",
    title: "Tin nhắn từ Emma H.",
    desc: "Xin chào Minh Anh! Sẵn sàng cho buổi học sáng mai không? Nhớ chuẩn bị câu hỏi nhé.",
    time: "34 phút trước",
    unread: true,
    type: "message",
  },
  {
    id: 3,
    icon: Trophy,
    iconColor: "from-yellow-400 to-amber-500",
    title: "Huy hiệu mới: Từ vựng cao thủ",
    desc: "Bạn vừa đạt 500 từ vựng đã thuộc. Nhận +50 XP và huy hiệu mới!",
    time: "3 giờ trước",
    unread: false,
    type: "achievement",
  },
  {
    id: 4,
    icon: Calendar,
    iconColor: "from-primary to-primary-container",
    title: "Nhắc lịch: Lớp học 1-1 ngày mai",
    desc: "Buổi học với Kenji T. lúc 8:00 sáng mai (25 phút). Nhấn để xem chi tiết.",
    time: "5 giờ trước",
    unread: false,
    type: "reminder",
  },
  {
    id: 5,
    icon: Sparkles,
    iconColor: "from-accent to-tertiary",
    title: "Lumi đã tạo flashcard mới",
    desc: "15 thẻ từ vựng được gợi ý dựa trên bài học hôm qua. Ôn tập ngay để nhớ lâu!",
    time: "8 giờ trước",
    unread: false,
    type: "ai",
  },
  {
    id: 6,
    icon: Users,
    iconColor: "from-success to-emerald-500",
    title: "Bạn bè đang vượt bạn!",
    desc: "Tuấn Nguyễn vừa hoàn thành 3 bài học hôm nay. Tiến lên nào!",
    time: "1 ngày trước",
    unread: false,
    type: "social",
  },
  {
    id: 7,
    icon: Gift,
    iconColor: "from-destructive to-tertiary",
    title: "Ưu đãi Premium -30%",
    desc: "Chỉ hôm nay: nâng cấp Premium với giá ưu đãi cho học viên trung thành.",
    time: "2 ngày trước",
    unread: false,
    type: "promo",
  },
]

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Bell className="h-7 w-7 text-primary" />
            Thông báo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bạn có <span className="font-semibold text-foreground">2 thông báo mới</span>
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Đánh dấu đã đọc
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="rounded-full bg-surface-low">
          <TabsTrigger value="all" className="rounded-full">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="unread" className="rounded-full">
            Chưa đọc
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-full">
            Xã hội
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-full">
            Hệ thống
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card
                  className={`group flex cursor-pointer items-start gap-4 rounded-3xl border border-border bg-surface-lowest p-5 shadow-ambient transition-all hover:shadow-hover ${
                    n.unread ? "bg-surface-low/40" : ""
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${n.iconColor} text-white shadow-ambient`}
                  >
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold tracking-tight">{n.title}</h3>
                      {n.unread && (
                        <Badge className="shrink-0 rounded-full bg-primary text-[10px] text-primary-foreground">
                          Mới
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <div className="space-y-3">
            {notifications
              .filter((n) => n.unread)
              .map((n) => (
                <Card
                  key={n.id}
                  className="flex items-start gap-4 rounded-3xl border border-border bg-surface-low/40 p-5 shadow-ambient"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${n.iconColor} text-white shadow-ambient`}
                  >
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold tracking-tight">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{n.desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card className="rounded-3xl border border-border bg-surface-lowest p-8 text-center shadow-ambient">
            <p className="text-sm text-muted-foreground">
              Chưa có thông báo xã hội mới. Theo dõi bạn bè để nhận cập nhật!
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="rounded-3xl border border-border bg-surface-lowest p-8 text-center shadow-ambient">
            <p className="text-sm text-muted-foreground">Không có thông báo hệ thống nào.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
