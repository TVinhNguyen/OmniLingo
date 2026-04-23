"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Star,
  Upload,
  X,
  ChevronRight,
  Clock,
  Calendar,
  ImagePlus,
  CheckCircle2,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const tutor = {
  name: "Emma Wilson",
  avatar: "EW",
  language: "English",
  sessionDate: "15 Tháng 10, 2024",
  duration: "60 phút",
  topic: "Business English - Presentation Skills",
}

const aspects = [
  { id: "quality", label: "Chất lượng giảng dạy", desc: "Kiến thức và phương pháp dạy" },
  { id: "communication", label: "Giao tiếp", desc: "Rõ ràng, dễ hiểu" },
  { id: "preparation", label: "Chuẩn bị", desc: "Bài giảng có cấu trúc, tài liệu" },
  { id: "overall", label: "Tổng thể", desc: "Cảm nhận chung về buổi học" },
]

const tagSuggestions = [
  "kiên nhẫn",
  "rõ ràng",
  "vui tính",
  "nghiêm khắc",
  "có tổ chức",
  "chuyên nghiệp",
  "sáng tạo",
  "nhiệt tình",
  "tận tâm",
  "giải thích tốt",
]

function StarRating({
  value,
  onChange,
  size = 24,
}: {
  value: number
  onChange: (v: number) => void
  size?: number
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`transition-colors ${
              (hover || value) >= s
                ? "fill-warning text-warning"
                : "fill-transparent text-muted-foreground"
            }`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  )
}

export default function TutorReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [overallRating, setOverallRating] = useState(0)
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({})
  const [content, setContent] = useState("")
  const [recommend, setRecommend] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [anonymous, setAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (t: string) => {
    setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-surface-lowest p-12 text-center shadow-hover"
        >
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold">Cảm ơn bạn!</h2>
          <p className="mt-2 text-muted-foreground">
            Review đã được gửi. Đánh giá của bạn giúp cộng đồng tốt hơn.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/tutors/bookings">Xem booking</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tutors/bookings" className="hover:text-primary">
          Bookings
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Viết review</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Tutor info */}
        <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 p-6 shadow-ambient">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-xl font-bold text-white">
            {tutor.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">{tutor.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {tutor.sessionDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {tutor.duration}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{tutor.topic}</p>
          </div>
        </div>

        {/* Overall rating */}
        <div className="rounded-3xl bg-surface-lowest p-6 text-center shadow-ambient sm:p-8">
          <h3 className="text-lg font-semibold">Bạn đánh giá buổi học thế nào?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Chạm vào sao để đánh giá</p>
          <div className="mt-6 flex justify-center">
            <StarRating value={overallRating} onChange={setOverallRating} size={40} />
          </div>
          {overallRating > 0 && (
            <motion.p
              key={overallRating}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm font-medium text-primary"
            >
              {["", "Rất tệ", "Không hài lòng", "Bình thường", "Tốt", "Xuất sắc"][overallRating]}
            </motion.p>
          )}
        </div>

        {/* Aspects */}
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <h3 className="mb-4 font-semibold">Đánh giá chi tiết</h3>
          <div className="space-y-4">
            {aspects.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
                <StarRating
                  value={aspectRatings[a.id] || 0}
                  onChange={(v) => setAspectRatings({ ...aspectRatings, [a.id]: v })}
                  size={22}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Review content */}
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <label className="block text-sm font-semibold">
            Chia sẻ trải nghiệm <span className="text-destructive">*</span>
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Viết ít nhất 20 ký tự để giúp người khác có cái nhìn rõ ràng
          </p>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Điểm tôi ấn tượng nhất là... Phương pháp dạy của cô/thầy..."
            className="mt-3 min-h-32 resize-none rounded-xl"
            maxLength={1000}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span className={content.length < 20 ? "text-destructive" : ""}>
              {content.length}/1000
            </span>
            {content.length >= 20 && <span className="text-success">✓ Đủ điều kiện</span>}
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <h3 className="font-semibold">Mô tả bằng từ khóa</h3>
          <p className="mt-1 text-xs text-muted-foreground">Chọn các từ phù hợp với tutor này</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tagSuggestions.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  tags.includes(t)
                    ? "bg-primary text-primary-foreground shadow-ambient"
                    : "bg-surface-low text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <h3 className="font-semibold">Ảnh đính kèm (tuỳ chọn)</h3>
          <p className="mt-1 text-xs text-muted-foreground">Tối đa 3 ảnh</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div
                key={i}
                className="relative grid h-20 w-20 place-items-center rounded-xl bg-surface-low"
              >
                <span className="text-xs">{p}</span>
                <button
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button
                onClick={() => setPhotos([...photos, `photo-${photos.length + 1}`])}
                className="grid h-20 w-20 place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ImagePlus className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <label className="flex items-start gap-3">
            <Checkbox
              checked={recommend}
              onCheckedChange={(v) => setRecommend(v === true)}
              className="mt-0.5"
            />
            <div>
              <div className="text-sm font-medium">Tôi recommend tutor này</div>
              <div className="text-xs text-muted-foreground">
                Học viên khác sẽ thấy bạn recommend
              </div>
            </div>
          </label>
          <hr className="my-4 border-border" />
          <label className="flex items-start gap-3">
            <Checkbox
              checked={anonymous}
              onCheckedChange={(v) => setAnonymous(v === true)}
              className="mt-0.5"
            />
            <div>
              <div className="text-sm font-medium">Đăng ẩn danh</div>
              <div className="text-xs text-muted-foreground">
                Tên và avatar của bạn sẽ được ẩn
              </div>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-surface-lowest/90 p-4 shadow-hover backdrop-blur sm:flex-row sm:items-center sm:justify-end">
          <Button variant="ghost" className="rounded-xl">
            Hủy
          </Button>
          <Button
            onClick={() => setSubmitted(true)}
            disabled={overallRating === 0 || content.length < 20}
            className="gap-2 rounded-xl bg-primary shadow-ambient"
          >
            <Send className="h-4 w-4" />
            Gửi review
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
