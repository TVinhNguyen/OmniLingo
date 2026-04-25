import Link from "next/link"
import {
  ArrowRight,
  Play,
  Brain,
  Bot,
  Mic,
  Trophy,
  Snowflake,
  Flame,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SkillRadar } from "@/components/app/skill-radar"
import { StreakCalendar } from "@/components/app/streak-calendar"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { DASHBOARD_QUERY, SRS_DUE_COUNT_QUERY, TODAY_MISSION_QUERY } from "@/lib/api/queries"
import type { DashboardData, TodayMission } from "@/lib/api/types"

// Mock fallback when BFF is offline
const MOCK: DashboardData = {
  user: { id: "0", username: "Bạn", avatarUrl: null, bio: "", createdAt: "", dailyGoalMinutes: 10, reminderTime: null, learningLanguages: [] },
  progress: { streak: 0, totalXp: 0, minutesLearned: 0, wordsMastered: 0 },
  entitlement: { planTier: "free", validUntil: null, features: [] },
  myTracks: [],
  myDecks: [],
}

export default async function DashboardPage() {
  const token = await getAccessToken()
  let data: DashboardData = MOCK
  let srsDueCount: number | null = null
  let mission: TodayMission | null = null
  try {
    const [dashRes, srsRes, missionRes] = await Promise.allSettled([
      gql<{ dashboard: DashboardData }>(DASHBOARD_QUERY, {}, token ?? undefined),
      gql<{ srsDueCount: number }>(SRS_DUE_COUNT_QUERY, {}, token ?? undefined),
      gql<{ todayMission: TodayMission }>(TODAY_MISSION_QUERY, {}, token ?? undefined),
    ])
    if (dashRes.status === "fulfilled" && dashRes.value?.dashboard) data = dashRes.value.dashboard
    if (srsRes.status === "fulfilled") srsDueCount = srsRes.value.srsDueCount
    if (missionRes.status === "fulfilled" && missionRes.value?.todayMission) {
      mission = missionRes.value.todayMission
    }
  } catch {}

  const { user, progress, myDecks } = data
  const deckDue = myDecks.reduce((s, d) => s + (d.dueCount ?? 0), 0)
  const totalDue = mission?.dueCardCount ?? srsDueCount ?? deckDue
  const dailyGoal = user.dailyGoalMinutes || 10
  const minutesDone = mission ? Math.max(0, dailyGoal - mission.minutesToGoal) : progress.minutesLearned
  const missionTitle =
    mission?.lessonTitle ?? data.myTracks[0]?.title ?? "Bắt đầu học ngay"
  const missionHref = mission?.lessonId ? `/lesson/${mission.lessonId}` : "/learn"

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            Chào <span className="text-gradient-primary">{user.username}</span>, hôm
            nay học gì?
          </h1>
        </div>
        <Button
          asChild
          size="lg"
          variant="ghost"
          className="rounded-full bg-surface-lowest shadow-ambient hover:shadow-hover"
        >
          <Link href="/progress">
            Xem tiến độ <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Today's Mission */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-hover"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              Nhiệm vụ hôm nay · {minutesDone}/{dailyGoal} phút
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              {missionTitle}
            </h2>
            <p className="mt-2 max-w-md text-white/85">
              {mission && mission.minutesToGoal > 0
                ? `Còn ${mission.minutesToGoal} phút để đạt mục tiêu hôm nay${
                    mission.dueCardCount > 0 ? ` · ${mission.dueCardCount} thẻ cần ôn` : ""
                  } · +${mission.xpReward} XP`
                : data.myTracks.length > 0
                  ? `Tiếp tục lộ trình học của bạn. Tiến độ: ${Math.round(data.myTracks[0]?.progressPct ?? 0)}%`
                  : "Chọn một lộ trình học để bắt đầu hành trình."}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 shadow-ambient"
              >
                <Link href={missionHref}>
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  {mission?.lessonId ? "Tiếp tục học" : "Chọn bài học"}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <Link href="/learn">Xem lộ trình</Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-3xl bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Thống kê của bạn
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 p-2">
                <p className="text-xl font-extrabold">{progress.totalXp}</p>
                <p className="text-[10px] uppercase text-white/70">XP</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-2">
                <p className="text-xl font-extrabold">{progress.streak}</p>
                <p className="text-[10px] uppercase text-white/70">Streak</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-2">
                <p className="text-xl font-extrabold">{progress.wordsMastered}</p>
                <p className="text-[10px] uppercase text-white/70">Từ đã nhớ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick cards grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* SRS Due */}
        <Link
          href="/practice/vocabulary"
          data-aos="fade-up"
          data-aos-delay="50"
          className="group rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5352a5] to-[#a19ff9] text-white">
              <Brain className="h-6 w-6" />
            </span>
            {totalDue > 0 && (
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                {totalDue} due
              </span>
            )}
          </div>
          <h3 className="mt-4 text-lg font-bold">Ôn thẻ SRS</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalDue > 0
              ? `${totalDue} thẻ đã tới hạn. Review ngay để không mất nhớ.`
              : `Bạn có ${myDecks.length} deck từ vựng.`}
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
            {totalDue > 0 ? `Review ${totalDue} thẻ` : "Xem từ vựng"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* AI Tutor */}
        <Link
          href="/ai-tutor"
          data-aos="fade-up"
          data-aos-delay="100"
          className="group rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-fluency text-white">
              <Bot className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-accent-container px-2.5 py-1 text-xs font-bold text-on-accent-container">
              AI
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Trò chuyện AI Tutor</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Hỏi mọi thứ về ngữ pháp, từ vựng, văn hoá. Có cả voice call.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-medium">
              💬 Chat
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-3 py-1 text-xs font-medium">
              <Mic className="h-3 w-3" /> Voice
            </span>
          </div>
        </Link>

        {/* Test prep widget */}
        <Link
          href="/test-prep"
          data-aos="fade-up"
          data-aos-delay="150"
          className="group rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#983772] to-[#702ae1] text-white">
              <Trophy className="h-6 w-6" />
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Luyện thi chứng chỉ</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            IELTS, TOEIC, TOEFL, JLPT, HSK, TOPIK — đề mock và dự đoán điểm.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
            Chọn chứng chỉ
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Streak + Radar */}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <section
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
                <h3 className="text-lg font-bold">Streak {progress.streak} ngày</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {progress.streak > 0
                  ? "Bạn đang trên đà tuyệt vời. Học hôm nay để giữ lửa!"
                  : "Bắt đầu hành trình học hôm nay!"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
            >
              <Snowflake className="mr-1.5 h-3.5 w-3.5" />
              Freeze streak · 50💎
            </Button>
          </div>
          <StreakCalendar />
        </section>

        <section
          data-aos="fade-up"
          data-aos-delay="100"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <h3 className="text-lg font-bold">Skill radar</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Đánh giá 6 kỹ năng ngôn ngữ
          </p>
          <SkillRadar />
        </section>
      </div>

      {/* Recommended */}
      <section data-aos="fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Gợi ý cho bạn</h3>
          <Link
            href="/practice/reading"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { kind: "Reading", title: "桜の季節", sub: "Short story · N4", gradient: "from-[#5352a5] to-[#702ae1]", emoji: "🌸" },
            { kind: "Podcast", title: "NHK Easy News", sub: "Nghe · 6 phút", gradient: "from-[#702ae1] to-[#983772]", emoji: "🎙️" },
            { kind: "Video", title: "Japanese Slang", sub: "Video · 8 phút", gradient: "from-[#983772] to-[#a19ff9]", emoji: "📺" },
            { kind: "Grammar", title: "は vs が", sub: "Ngữ pháp · N5", gradient: "from-[#a19ff9] to-[#5352a5]", emoji: "📝" },
          ].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="group overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
            >
              <div className={`aspect-[5/3] bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <span className="text-6xl">{item.emoji}</span>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">{item.kind}</span>
                <h4 className="mt-1 font-bold leading-tight">{item.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
