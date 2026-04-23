"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const posts = [
  {
    slug: "7-thoi-quen-duy-tri-chuoi-365-ngay",
    category: "Phương pháp",
    title: "7 thói quen nhỏ giúp tôi duy trì chuỗi học 365 ngày",
    excerpt:
      "Học ngoại ngữ là hành trình dài hơi. Đây là 7 chiến thuật tôi dùng để biến việc học thành một phần tự nhiên trong ngày.",
    date: "12/04/2026",
    readTime: "6 phút",
    author: "Linh Trần",
    gradient: "from-[#5352a5] to-[#a19ff9]",
  },
  {
    slug: "ielts-7-trong-6-thang",
    category: "Luyện thi",
    title: "Lộ trình đạt IELTS 7.0 trong 6 tháng cho người đi làm",
    excerpt:
      "Bạn chỉ có 1 giờ mỗi ngày? Đây là lộ trình cụ thể với từng mốc tuần, từng kỹ năng, kèm tài liệu miễn phí.",
    date: "05/04/2026",
    readTime: "12 phút",
    author: "Mr. Kenji",
    gradient: "from-[#702ae1] to-[#983772]",
  },
  {
    slug: "srs-la-gi-tai-sao-hieu-qua",
    category: "Khoa học",
    title: "SRS là gì và tại sao nó là vũ khí tối thượng để nhớ từ vựng?",
    excerpt:
      "Khoa học về sự quên lãng, đường cong Ebbinghaus và cách thuật toán SM-2 giúp bạn nhớ 10.000 từ mà không học thuộc.",
    date: "28/03/2026",
    readTime: "9 phút",
    author: "Dr. Sophie",
    gradient: "from-[#983772] to-[#d0406e]",
  },
  {
    slug: "hoc-tieng-nhat-cho-nguoi-viet",
    category: "Tiếng Nhật",
    title: "Học tiếng Nhật cho người Việt: Lợi thế nào bạn đang bỏ qua",
    excerpt:
      "Từ Hán-Việt, ngữ pháp tương tự, phát âm dễ chịu — người Việt có 3 lợi thế lớn khi học tiếng Nhật mà ít ai tận dụng đúng.",
    date: "20/03/2026",
    readTime: "8 phút",
    author: "Cô Ming",
    gradient: "from-[#a19ff9] to-[#702ae1]",
  },
  {
    slug: "ai-tutor-va-giao-vien-thuc",
    category: "AI & Giáo dục",
    title: "AI Tutor vs Giáo viên thực: Ai nên dạy bạn kỹ năng nói?",
    excerpt:
      "Mỗi bên có điểm mạnh riêng. Bài viết này phân tích khi nào nên chọn AI, khi nào cần 1-1 với giáo viên bản ngữ.",
    date: "14/03/2026",
    readTime: "7 phút",
    author: "Carlos V.",
    gradient: "from-[#5352a5] to-[#983772]",
  },
  {
    slug: "5-loi-phat-am-pho-bien",
    category: "Phát âm",
    title: "5 lỗi phát âm phổ biến nhất của người Việt học tiếng Anh",
    excerpt:
      "Âm /θ/, /ð/, ending sounds, trọng âm từ và ngữ điệu — những lỗi khiến bạn khó nghe hiểu dù từ vựng rất tốt.",
    date: "08/03/2026",
    readTime: "10 phút",
    author: "Emma H.",
    gradient: "from-[#702ae1] to-[#5352a5]",
  },
]

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
            OmniLingo Blog
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Kiến thức, mẹo và <span className="text-gradient-primary">câu chuyện</span> về ngôn ngữ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground">
            Bài viết chuyên sâu từ giáo viên, chuyên gia và học viên của OmniLingo.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link href={`/blog/${featured.slug}`} className="group block">
            <Card className="overflow-hidden rounded-3xl border border-border bg-surface-lowest p-0 shadow-ambient transition-shadow hover:shadow-hover">
              <div className="grid md:grid-cols-2">
                <div
                  className={`relative aspect-[4/3] md:aspect-auto bg-gradient-to-br ${featured.gradient}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="absolute left-6 top-6">
                    <Badge className="rounded-full bg-white/20 text-white backdrop-blur">
                      Nổi bật
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
                  <Badge variant="outline" className="w-fit rounded-full">
                    {featured.category}
                  </Badge>
                  <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-pretty text-muted-foreground">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{featured.author}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Đọc bài viết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface-lowest p-0 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover">
                  <div
                    className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                    <div className="absolute left-5 top-5">
                      <Badge className="rounded-full bg-white/20 text-white backdrop-blur">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="text-balance text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{post.author}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
