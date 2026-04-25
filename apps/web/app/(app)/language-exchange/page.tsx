"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  Search,
  MessageSquare,
  UserPlus,
  Filter,
  MapPin,
  Sparkles,
  Activity,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { FlagIcon } from "@/components/flag-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const partners = [
  {
    id: 1,
    name: "Emma Wilson",
    avatar: "EW",
    country: "gb",
    native: "en",
    learning: "vi",
    level: "B1",
    bio: "Love Vietnamese culture and food. Let's exchange!",
    interests: ["Music", "Travel", "Food"],
    online: true,
    age: 28,
    match: 95,
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    avatar: "KT",
    country: "jp",
    native: "ja",
    learning: "en",
    level: "B2",
    bio: "Tokyo-based engineer, anime fan looking for English practice partner",
    interests: ["Tech", "Anime", "Gaming"],
    online: true,
    age: 32,
    match: 92,
  },
  {
    id: 3,
    name: "Sophie Dubois",
    avatar: "SD",
    country: "fr",
    native: "fr",
    learning: "ja",
    level: "A2",
    bio: "Paris-based artist, want to learn Japanese for Tokyo trip next year",
    interests: ["Art", "Travel", "Cinema"],
    online: false,
    age: 26,
    match: 88,
  },
  {
    id: 4,
    name: "Carlos Mendez",
    avatar: "CM",
    country: "es",
    native: "es",
    learning: "en",
    level: "C1",
    bio: "Barcelona dev, love football and tech. Happy to chat anytime!",
    interests: ["Tech", "Football", "Travel"],
    online: true,
    age: 30,
    match: 85,
  },
  {
    id: 5,
    name: "Ming Li",
    avatar: "ML",
    country: "cn",
    native: "zh",
    learning: "en",
    level: "B2",
    bio: "Shanghai graduate student, research in AI",
    interests: ["Science", "Reading", "Hiking"],
    online: true,
    age: 24,
    match: 82,
  },
  {
    id: 6,
    name: "Anna Schmidt",
    avatar: "AS",
    country: "de",
    native: "de",
    learning: "ko",
    level: "A2",
    bio: "K-drama fan from Berlin. Beginner Korean, patient conversationalist",
    interests: ["K-drama", "Music", "Cooking"],
    online: false,
    age: 29,
    match: 78,
  },
]

const interestOptions = [
  "Music",
  "Travel",
  "Food",
  "Tech",
  "Gaming",
  "Art",
  "Cinema",
  "Sports",
  "Reading",
  "Cooking",
]

export default function LanguageExchangePage() {
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [levelRange, setLevelRange] = useState([1, 6])
  const [ageRange, setAgeRange] = useState([18, 60])
  const [sort, setSort] = useState("match")
  const [showFilters, setShowFilters] = useState(true)

  const sorted = [...partners].sort((a, b) => {
    if (sort === "match") return b.match - a.match
    if (sort === "active") return (b.online ? 1 : 0) - (a.online ? 1 : 0)
    return b.id - a.id
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-sans text-3xl font-bold text-balance lg:text-4xl">
          Language Exchange
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tìm partner ngôn ngữ - dạy nhau, học cùng nhau, kết bạn khắp thế giới
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between rounded-xl bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                </span>
                <Badge variant="secondary">{selectedInterests.length}</Badge>
              </Button>
            </div>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 rounded-3xl bg-surface-lowest p-5 shadow-ambient"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Bộ lọc</h3>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Tôi đang học
                  </label>
                  <Select defaultValue="en">
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Partner native
                  </label>
                  <Select defaultValue="any">
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Bất kỳ</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">
                      Trình độ ngôn ngữ tôi đang học
                    </label>
                    <span className="text-xs font-semibold text-primary">
                      {["A1", "A2", "B1", "B2", "C1", "C2"][levelRange[0] - 1]} -{" "}
                      {["A1", "A2", "B1", "B2", "C1", "C2"][levelRange[1] - 1]}
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={6}
                    step={1}
                    value={levelRange}
                    onValueChange={setLevelRange}
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-surface-low p-3">
                  <label
                    htmlFor="online-only"
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Activity className="h-4 w-4 text-success" />
                    Đang online
                  </label>
                  <Checkbox
                    id="online-only"
                    checked={onlineOnly}
                    onCheckedChange={(v) => setOnlineOnly(v === true)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Sở thích
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {interestOptions.map((i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedInterests((prev) =>
                            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                          )
                        }
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          selectedInterests.includes(i)
                            ? "bg-primary text-primary-foreground shadow-ambient"
                            : "bg-surface-low text-muted-foreground hover:bg-primary/10"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Tuổi</label>
                    <span className="text-xs font-semibold text-primary">
                      {ageRange[0]} - {ageRange[1]}
                    </span>
                  </div>
                  <Slider min={18} max={80} step={1} value={ageRange} onValueChange={setAgeRange} />
                </div>

                <Button variant="outline" size="sm" className="w-full rounded-xl bg-transparent">
                  Xóa bộ lọc
                </Button>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Partners grid */}
        <div>
          {/* Sort bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-lowest p-3 shadow-ambient">
            <div className="relative flex-1 min-w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, bio..."
                className="h-10 rounded-xl border-0 bg-surface-low pl-10"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-44 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Phù hợp nhất</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="active">Active nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {sorted.length} partners phù hợp
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                {p.match >= 85 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
                    <Sparkles className="h-3 w-3" />
                    {p.match}% match
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-lg font-bold text-white">
                      {p.avatar}
                    </div>
                    {p.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-surface-lowest bg-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">{p.name}</h3>
                      <FlagIcon code={p.country} className="h-3.5 w-5 shrink-0" />
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{p.age} tuổi</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-low p-2.5 text-sm">
                  <FlagIcon code={p.native} className="h-3.5 w-5" />
                  <span className="font-medium">Native</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <FlagIcon code={p.learning} className="h-3.5 w-5" />
                  <Badge variant="secondary" className="ml-auto rounded-full text-xs">
                    {p.level}
                  </Badge>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.interests.map((int) => (
                    <span
                      key={int}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      {int}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 gap-1.5 rounded-xl bg-primary shadow-ambient">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Chào
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
