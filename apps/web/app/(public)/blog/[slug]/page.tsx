import { use } from "react"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CONTENT = `
## Tại sao phương pháp truyền thống không hiệu quả?

Nhiều người học ngôn ngữ theo cách học thuộc từ vựng và ngữ pháp mà không áp dụng vào thực tế. Cách này tạo cảm giác mình đang tiến bộ, nhưng khi gặp tình huống giao tiếp thực tế lại hoàn toàn bất lực.

Nghiên cứu của Đại học Cambridge cho thấy người học tiếp xúc với ngôn ngữ trong ngữ cảnh thực tế học nhanh hơn 3 lần so với phương pháp truyền thống.

## Nguyên tắc 1: Immersion - Đắm chìm trong ngôn ngữ

Tạo một môi trường nơi ngôn ngữ đích xuất hiện liên tục. Đổi ngôn ngữ điện thoại, xem phim không phụ đề, nghe podcast khi đi làm. Bộ não sẽ dần học cách xử lý ngôn ngữ một cách tự nhiên.

## Nguyên tắc 2: Active Recall

Thay vì đọc đi đọc lại, hãy ép bản thân nhớ lại. Flashcard SRS (Spaced Repetition System) là công cụ mạnh mẽ nhất. Mỗi lần nhớ lại sẽ củng cố đường dẫn thần kinh liên quan.

## Nguyên tắc 3: Output trước khi perfect

Đừng chờ đến khi giỏi mới nói. Bắt đầu nói từ ngày đầu tiên, chấp nhận sai, học từ sai lầm. Đây là cách duy nhất để não chuyển từ passive knowledge sang active production.

## Kết luận

Học ngôn ngữ không phải là nhồi nhét kiến thức mà là huấn luyện não bộ. Kiên trì với 3 nguyên tắc trên trong 90 ngày, bạn sẽ thấy khả năng của mình biến đổi hoàn toàn.
`

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  return (
    <main className="min-h-dvh bg-surface-low pt-16">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Blog
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Badge>Phương pháp</Badge>
          <Badge variant="outline">Ngôn ngữ học</Badge>
        </div>

        <h1 className="mt-4 font-serif text-4xl font-semibold text-pretty sm:text-5xl">
          3 nguyên tắc khoa học giúp học ngôn ngữ nhanh hơn 3x
        </h1>

        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/tutor-emma.jpg" alt="" />
              <AvatarFallback>ET</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">Emma Thompson</div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  15/03/2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />7 phút đọc
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="mt-10 aspect-[16/9] rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-surface-lowest"
          aria-hidden="true"
        />

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground">
          {CONTENT.trim().split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="mt-10 font-serif text-2xl font-semibold text-pretty sm:text-3xl">
                  {para.replace("## ", "")}
                </h2>
              )
            }
            return (
              <p key={i} className="text-pretty">
                {para}
              </p>
            )
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-8 text-center">
          <h3 className="font-serif text-2xl font-semibold">Sẵn sàng thử phương pháp này?</h3>
          <p className="mt-2 text-muted-foreground">Bắt đầu 7 ngày miễn phí với OmniLingo</p>
          <Button asChild size="lg" className="mt-6 rounded-xl">
            <Link href="/sign-up">Dùng thử miễn phí</Link>
          </Button>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 font-serif text-2xl font-semibold">Bài viết liên quan</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Cách xây dựng streak 100+ ngày",
              "Từ vựng vs ngữ pháp: Nên học gì trước?",
            ].map((t) => (
              <Link
                key={t}
                href="#"
                className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <Badge variant="outline">Phương pháp</Badge>
                <h4 className="mt-3 font-serif text-lg font-semibold text-pretty">{t}</h4>
                <div className="mt-2 text-sm text-muted-foreground">5 phút đọc</div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  )
}
