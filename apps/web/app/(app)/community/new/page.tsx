"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ChevronRight,
  Bold,
  Italic,
  Code,
  Link2,
  ImageIcon,
  Code2,
  List,
  Quote,
  Eye,
  Save,
  Send,
  Lightbulb,
  Sparkles,
  X,
  Plus,
} from "lucide-react"
import { FlagIcon } from "@/components/flag-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const postTypes = [
  { id: "discussion", label: "Thảo luận", icon: "💬", color: "from-primary to-accent" },
  { id: "question", label: "Câu hỏi", icon: "❓", color: "from-accent to-primary" },
  { id: "grammar", label: "Ngữ pháp check", icon: "📝", color: "from-success to-primary" },
  { id: "feedback", label: "Xin feedback", icon: "🎯", color: "from-warning to-accent" },
]

const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
]

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

const similarPosts = [
  { title: "Cách dùng 'have been' vs 'have gone' - IELTS", upvotes: 42 },
  { title: "Phân biệt present perfect và past simple", upvotes: 28 },
  { title: "Grammar check: Essay about climate change", upvotes: 15 },
]

const suggestedTags = ["grammar", "ielts", "vocabulary", "writing", "speaking", "pronunciation"]

export default function CommunityNewPage() {
  const [type, setType] = useState("discussion")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [preview, setPreview] = useState(false)
  const [language, setLanguage] = useState("en")
  const [level, setLevel] = useState("B2")

  const addTag = (t: string) => {
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t])
      setTagInput("")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/community" className="hover:text-primary">
          Cộng đồng
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Tạo bài viết</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="font-sans text-3xl font-bold text-balance">Tạo bài viết mới</h1>
            <p className="mt-2 text-muted-foreground">
              Chia sẻ câu hỏi, thảo luận hoặc xin feedback từ cộng đồng
            </p>
          </div>

          {/* Post type tabs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {postTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                  type === t.id
                    ? "border-primary bg-primary/5 shadow-ambient"
                    : "border-transparent bg-surface-lowest hover:border-primary/30"
                }`}
              >
                <div className="text-2xl">{t.icon}</div>
                <div className="mt-2 text-sm font-semibold">{t.label}</div>
              </button>
            ))}
          </div>

          {/* Main card */}
          <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient sm:p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold">
                Tiêu đề <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề rõ ràng, hấp dẫn..."
                className="h-12 rounded-xl text-base"
                maxLength={200}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {title.length}/200
              </div>
            </div>

            {/* Language + Level */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Ngôn ngữ</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        <span className="flex items-center gap-2">
                          <FlagIcon code={l.code} className="h-4 w-6" />
                          {l.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Trình độ</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold">Tags (tối đa 5)</label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-border bg-surface-low p-2 focus-within:border-primary">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 rounded-full bg-primary/10 text-primary"
                  >
                    #{tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {tags.length < 5 && (
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(tagInput.trim())
                      }
                    }}
                    placeholder="Thêm tag..."
                    className="min-w-24 flex-1 bg-transparent px-2 py-1 text-sm outline-none"
                  />
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Gợi ý:</span>
                {suggestedTags
                  .filter((t) => !tags.includes(t))
                  .slice(0, 5)
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() => addTag(t)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Plus className="h-3 w-3" />#{t}
                    </button>
                  ))}
              </div>
            </div>

            {/* Editor */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold">Nội dung</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreview(!preview)}
                  className="h-8 gap-1 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                  {preview ? "Chỉnh sửa" : "Xem trước"}
                </Button>
              </div>

              {!preview ? (
                <div className="overflow-hidden rounded-xl border-2 border-border focus-within:border-primary">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-low p-2">
                    {[Bold, Italic, Code, Link2, ImageIcon, Code2, Quote, List].map((Icon, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết nội dung chi tiết. Càng rõ ràng càng dễ nhận được câu trả lời tốt..."
                    className="min-h-[320px] resize-none rounded-none border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>
              ) : (
                <div className="min-h-[400px] rounded-xl border-2 border-dashed border-border bg-surface-low p-6">
                  {content ? (
                    <article className="prose prose-sm max-w-none dark:prose-invert">
                      <h2>{title || "Chưa có tiêu đề"}</h2>
                      <div className="whitespace-pre-wrap">{content}</div>
                    </article>
                  ) : (
                    <p className="text-muted-foreground">Chưa có nội dung để xem trước.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-surface-lowest/90 p-4 shadow-hover backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" className="gap-2 rounded-xl">
              <Save className="h-4 w-4" />
              Lưu nháp
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 rounded-xl bg-transparent">
                <Eye className="h-4 w-4" />
                Xem trước
              </Button>
              <Button className="gap-2 rounded-xl bg-primary shadow-ambient">
                <Send className="h-4 w-4" />
                Đăng bài
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5">
                <Lightbulb className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold">Tips khi post</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Tiêu đề cụ thể, tóm tắt ý chính",
                "Chọn đúng loại bài để dễ tìm",
                "Thêm context: level, tình huống",
                "Đính kèm ví dụ cụ thể",
                "Dùng code block cho câu tiếng Anh",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Bài tương tự</h3>
            </div>
            <div className="space-y-3">
              {similarPosts.map((p, i) => (
                <Link
                  key={i}
                  href="/community"
                  className="block rounded-xl p-3 transition-colors hover:bg-surface-low"
                >
                  <div className="line-clamp-2 text-sm font-medium">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">↑ {p.upvotes} upvotes</div>
                </Link>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
