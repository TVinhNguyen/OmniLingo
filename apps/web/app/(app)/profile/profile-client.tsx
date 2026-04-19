"use client";

import { motion } from "motion/react";
import { Pencil, Flame, Trophy, Star, BookOpen, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FlagIcon } from "@/components/flag-icon";
import { Progress } from "@/components/ui/progress";
import type { User, LearningTrack } from "@/lib/api/types";

const MOCK_BADGES = [
  { name: "7-day streak", rarity: "Common", date: "Apr 2026" },
  { name: "First 1,000 XP", rarity: "Common", date: "Apr 2026" },
  { name: "Word master 100", rarity: "Rare", date: "Mar 2026" },
  { name: "OmniLingo", rarity: "Epic", date: "Mar 2026" },
  { name: "Night owl", rarity: "Rare", date: "Feb 2026" },
  { name: "Early bird", rarity: "Rare", date: "Feb 2026" },
];

interface ProfileClientProps {
  user: User;
  tracks: LearningTrack[];
}

export default function ProfileClient({ user, tracks }: ProfileClientProps) {
  const initials = user.username.slice(0, 2).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Profile header — real user data */}
      <Card className="mb-6 overflow-hidden border-border/60 bg-card/80">
        <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-accent" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 ring-4 ring-card">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.username} />}
                <AvatarFallback className="bg-primary text-2xl font-serif text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="font-serif text-2xl font-semibold tracking-tight">{user.username}</h1>
                <p className="text-sm text-muted-foreground">Thành viên từ {memberSince}</p>
                <div className="mt-1 flex items-center gap-2">
                  {tracks.length > 0 && (
                    <Badge variant="secondary" className="rounded-full">
                      <Globe2 className="mr-1 size-3" />
                      {tracks.length} ngôn ngữ
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent">
              <Pencil className="mr-2 size-4" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>

          {user.bio && (
            <p className="mt-4 text-sm leading-relaxed text-foreground">{user.bio}</p>
          )}
        </div>
      </Card>

      {/* Stats — from tracks */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Flame} label="Chuỗi ngày" value="—" color="text-destructive" />
        <StatCard icon={Trophy} label="Tổng XP" value="—" color="text-warning" />
        <StatCard icon={Star} label="Huy hiệu" value={MOCK_BADGES.length.toString()} color="text-primary" />
        <StatCard icon={BookOpen} label="Ngôn ngữ" value={tracks.length.toString()} color="text-success" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="languages">
        <TabsList>
          <TabsTrigger value="languages">Ngôn ngữ</TabsTrigger>
          <TabsTrigger value="badges">Huy hiệu</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động</TabsTrigger>
        </TabsList>

        {/* Real language tracks */}
        <TabsContent value="languages" className="mt-6 space-y-3">
          {tracks.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/60 bg-card/80 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                      <FlagIcon code={t.language} className="size-6" />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-semibold">{t.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Trình độ CEFR/JLPT: {t.level}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {t.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={t.progressPct} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground">{Math.round(t.progressPct)}%</span>
                </div>
              </Card>
            </motion.div>
          ))}
          <Card className="flex items-center justify-center border-2 border-dashed border-border bg-transparent p-6 text-center">
            <div>
              <Globe2 className="mx-auto mb-2 size-6 text-primary" />
              <p className="text-sm font-medium">Thêm ngôn ngữ mới</p>
              <p className="text-xs text-muted-foreground">Mở rộng hành trình đa ngôn ngữ</p>
            </div>
          </Card>
        </TabsContent>

        {/* Mock badges (Phase 1.5) */}
        <TabsContent value="badges" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {MOCK_BADGES.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-border/60 bg-card/80 p-5 text-center transition hover:-translate-y-1 hover:shadow-soft">
                  <div
                    className={`mx-auto mb-3 flex size-16 items-center justify-center rounded-full ${
                      b.rarity === "Epic"
                        ? "bg-gradient-to-br from-primary/30 to-primary/10"
                        : b.rarity === "Rare"
                          ? "bg-gradient-to-br from-success/30 to-success/10"
                          : "bg-accent"
                    }`}
                  >
                    <Trophy className="size-7 text-primary" />
                  </div>
                  <div className="font-semibold">{b.name}</div>
                  <Badge variant="outline" className="mt-2 rounded-full text-xs">
                    {b.rarity}
                  </Badge>
                  <div className="mt-1 text-xs text-muted-foreground">{b.date}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Mock activity (Phase 1.5) */}
        <TabsContent value="activity" className="mt-6">
          <Card className="border-border/60 bg-card/80 p-6">
            <div className="space-y-5">
              {[
                { time: "Hôm nay", text: "Bắt đầu hành trình học ngôn ngữ trên OmniLingo" },
                { time: "Gần đây", text: "Thêm track học vào lộ trình" },
              ].map((a, i) => (
                <div key={i} className="flex gap-4 border-l-2 border-primary/40 pl-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {a.time}
                    </div>
                    <div className="text-sm text-foreground">{a.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border-border/60 bg-card/80 p-4">
      <Icon className={`mb-2 size-5 ${color}`} />
      <div className="font-serif text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
