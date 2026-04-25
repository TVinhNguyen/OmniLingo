"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  PenTool,
  Sparkles,
  Clock,
  Target,
  Save,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

const PROMPTS = [
  {
    id: 1,
    level: "B1",
    type: "Email",
    title: "Email xin nghỉ việc",
    desc: "Viết email lịch sự xin nghỉ việc 2 tuần tới. Giải thích lý do và đề xuất bàn giao.",
    words: 120,
    time: 20,
  },
  {
    id: 2,
    level: "B2",
    type: "Essay",
    title: "Tác động của mạng xã hội",
    desc: "Thảo luận tác động tích cực và tiêu cực của mạng xã hội đối với giới trẻ.",
    words: 250,
    time: 40,
  },
  {
    id: 3,
    level: "C1",
    type: "Report",
    title: "Báo cáo xu hướng tiêu dùng",
    desc: "Phân tích biểu đồ xu hướng tiêu dùng 5 năm và đưa ra nhận định.",
    words: 300,
    time: 45,
  },
]

const CORRECTIONS = [
  { type: "grammar", text: "have", suggestion: "has", reason: "Chủ ngữ số ít cần động từ 'has'" },
  { type: "spelling", text: "recieve", suggestion: "receive", reason: "i trước e, trừ sau c" },
  { type: "style", text: "very important", suggestion: "crucial", reason: "Dùng từ mạnh hơn" },
]

export default function WritingCenterPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const currentPrompt = PROMPTS.find((p) => p.id === selected)

  if (submitted && currentPrompt) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Phản hồi AI</h1>
          <p className="mt-1 text-muted-foreground">Phân tích bài viết của bạn</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
              <div className="mb-4 flex items-center gap-2">
                <Badge>{currentPrompt.level}</Badge>
                <Badge variant="outline">{currentPrompt.type}</Badge>
                <div className="text-sm text-muted-foreground">{wordCount} từ</div>
              </div>
              <div className="prose prose-sm max-w-none leading-relaxed text-foreground">
                {content.split("\n").map((para, i) => (
                  <p key={i} className="mb-3">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <AlertCircle className="h-5 w-5 text-accent" />
                Lỗi & đề xuất ({CORRECTIONS.length})
              </div>
              <div className="space-y-3">
                {CORRECTIONS.map((c, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-surface-low p-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="capitalize"
                      >
                        {c.type}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="rounded bg-danger/15 px-1.5 py-0.5 font-mono text-danger line-through">
                        {c.text}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="rounded bg-success/15 px-1.5 py-0.5 font-mono font-semibold text-success">
                        {c.suggestion}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{c.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-6 shadow-ambient">
              <div className="text-sm font-semibold text-muted-foreground">Điểm tổng</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-semibold text-primary">7.5</span>
                <span className="text-muted-foreground">/10</span>
              </div>
              <Progress value={75} className="mt-4 h-2" />
            </div>

            <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
              <div className="mb-4 font-semibold">Tiêu chí</div>
              {[
                { label: "Task Response", score: 8 },
                { label: "Coherence", score: 7 },
                { label: "Grammar", score: 7 },
                { label: "Vocabulary", score: 8 },
              ].map((c) => (
                <div key={c.label} className="mb-3 last:mb-0">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{c.label}</span>
                    <span className="font-semibold tabular-nums">{c.score}/10</span>
                  </div>
                  <Progress value={c.score * 10} className="h-1.5" />
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-accent" />
                Gợi ý cải thiện
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Sử dụng linking words đa dạng hơn
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Mở rộng câu bằng mệnh đề phụ
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Tăng cường từ vựng học thuật
                </li>
              </ul>
            </div>

            <Button
              className="h-11 w-full rounded-xl"
              onClick={() => {
                setSubmitted(false)
                setSelected(null)
                setContent("")
              }}
            >
              Thử prompt khác
            </Button>
          </aside>
        </div>
      </div>
    )
  }

  if (currentPrompt) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
              ← Quay lại
            </Button>
            <div className="mt-2 flex items-center gap-2">
              <Badge>{currentPrompt.level}</Badge>
              <Badge variant="outline">{currentPrompt.type}</Badge>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold">{currentPrompt.title}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{currentPrompt.desc}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-lowest px-4 py-3 shadow-ambient">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentPrompt.time} phút</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">~{currentPrompt.words} từ</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết..."
              className="min-h-[500px] resize-none border-none bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0"
            />
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground tabular-nums">{wordCount}</span>{" "}
                  / {currentPrompt.words} từ
                </span>
                <Progress
                  value={Math.min(100, (wordCount / currentPrompt.words) * 100)}
                  className="h-1.5 w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu nháp
                </Button>
                <Button
                  size="sm"
                  disabled={wordCount < 20}
                  onClick={() => setSubmitted(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Nộp bài
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-surface-lowest p-5 shadow-ambient">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-accent" />
                Gợi ý
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Bắt đầu bằng câu chủ đề rõ ràng</li>
                <li>Chia thành 3-4 đoạn văn</li>
                <li>Dùng linking words</li>
                <li>Kết luận ngắn gọn</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Công cụ AI
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="h-9 w-full justify-start rounded-lg">
                  Kiểm tra ngữ pháp
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-full justify-start rounded-lg">
                  Đề xuất từ vựng
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-full justify-start rounded-lg">
                  Paraphrase
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Writing Center</h1>
        <p className="mt-2 text-muted-foreground">
          Rèn luyện kỹ năng viết với đề bài và phản hồi AI
        </p>
      </div>

      <Tabs defaultValue="prompts">
        <TabsList>
          <TabsTrigger value="prompts">
            <PenTool className="mr-2 h-4 w-4" />
            Đề bài
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Lịch sử
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Mẫu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROMPTS.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(p.id)}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface-lowest p-6 text-left shadow-ambient transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex items-center gap-2">
                  <Badge>{p.level}</Badge>
                  <Badge variant="outline">{p.type}</Badge>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-pretty">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {p.time}&apos;
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />~{p.words} từ
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
              </motion.button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="rounded-3xl border border-border bg-surface-lowest p-12 text-center shadow-ambient">
            <History className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-xl font-semibold">Chưa có bài viết nào</h3>
            <p className="mt-1 text-muted-foreground">
              Bài viết đã nộp sẽ hiển thị ở đây
            </p>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {["Email công việc", "Essay học thuật", "CV & Cover Letter", "Báo cáo"].map((t) => (
              <div
                key={t}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground">Mẫu cấu trúc sẵn</div>
                </div>
                <Button variant="outline" size="sm">
                  Xem
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
