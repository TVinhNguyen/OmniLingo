import { use } from "react"
import Link from "next/link"
import {
  Clock,
  Users,
  Award,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Headphones,
  MessageSquare,
  ArrowLeft,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlagIcon } from "@/components/flag-icon"

const MODULES = [
  {
    title: "Module 1: Làm quen với tiếng Anh",
    lessons: 12,
    duration: "4 giờ",
    items: [
      "Bảng chữ cái và phát âm cơ bản",
      "Chào hỏi và giới thiệu bản thân",
      "Số đếm và thời gian",
    ],
  },
  {
    title: "Module 2: Giao tiếp hàng ngày",
    lessons: 18,
    duration: "6 giờ",
    items: [
      "Mua sắm và đi chợ",
      "Ẩm thực và nhà hàng",
      "Phương tiện giao thông",
    ],
  },
  {
    title: "Module 3: Ngữ pháp nền tảng",
    lessons: 15,
    duration: "5 giờ",
    items: ["Hiện tại đơn", "Quá khứ đơn", "Tương lai"],
  },
  {
    title: "Module 4: Thực hành 4 kỹ năng",
    lessons: 20,
    duration: "8 giờ",
    items: ["Listening với audio thực tế", "Speaking với AI", "Reading passages", "Writing essays"],
  },
]

export default function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  return (
    <main className="min-h-dvh bg-surface-low pt-16">
      <div className="border-b border-border bg-gradient-to-br from-primary/10 via-surface-lowest to-surface-low">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại khóa học
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <FlagIcon code="us" size={20} />
            <span className="font-semibold">Tiếng Anh</span>
            <Badge>A1 - A2</Badge>
            <Badge variant="outline">Bestseller</Badge>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-semibold text-pretty sm:text-5xl">
            Tiếng Anh giao tiếp cho người mới bắt đầu
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Hành trình 12 tuần từ số 0 đến giao tiếp cơ bản với phương pháp đã được chứng minh hiệu
            quả
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">4.9</span>
              <span className="text-muted-foreground">(2,341 đánh giá)</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              45,230 học viên
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              65 giờ học
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Award className="h-4 w-4" />
              Có chứng chỉ
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl font-semibold">Bạn sẽ học được gì</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Giao tiếp tự tin trong 20+ tình huống",
                  "Nắm vững 1000+ từ vựng cốt lõi",
                  "Hiểu và áp dụng ngữ pháp A1-A2",
                  "Phát âm chuẩn như người bản xứ",
                  "Nghe hiểu hội thoại thực tế",
                  "Đọc và viết văn bản cơ bản",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold">Nội dung khóa học</h2>
              <div className="mt-2 text-sm text-muted-foreground">
                4 modules · 65 bài học · 23 giờ video
              </div>
              <div className="mt-5 space-y-3">
                {MODULES.map((m, i) => (
                  <details
                    key={m.title}
                    className="group overflow-hidden rounded-2xl border border-border bg-surface-lowest shadow-ambient"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 transition hover:bg-surface-low">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{m.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {m.lessons} bài · {m.duration}
                          </div>
                        </div>
                      </div>
                    </summary>
                    <div className="border-t border-border p-5">
                      <ul className="space-y-2">
                        {m.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold">Yêu cầu</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Không cần kiến thức trước",
                  "Máy tính hoặc điện thoại có kết nối internet",
                  "15-30 phút mỗi ngày để luyện tập",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-20 rounded-3xl border border-border bg-surface-lowest p-6 shadow-card">
              <div
                className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20"
                aria-hidden="true"
              />

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold">Miễn phí</span>
                <span className="text-sm text-muted-foreground line-through">$49</span>
              </div>

              <Button asChild size="lg" className="mt-4 h-12 w-full rounded-xl">
                <Link href="/sign-up">Bắt đầu khóa học</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="mt-2 h-12 w-full rounded-xl">
                <Link href="/pricing">Nâng cấp Premium</Link>
              </Button>

              <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  <span>65 bài học video</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Tài liệu PDF đầy đủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-muted-foreground" />
                  <span>Audio tất cả bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Cộng đồng hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Chứng chỉ hoàn thành</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
