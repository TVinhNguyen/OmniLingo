"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  Award,
  Send,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const COMMENTS = [
  {
    id: 1,
    user: "Minh Anh",
    avatar: "/tutor-emma.jpg",
    level: "B2",
    time: "2 giờ",
    content: "Bài viết rất hữu ích! Mình cũng đang luyện thi IELTS và gặp khó khăn tương tự.",
    likes: 12,
  },
  {
    id: 2,
    user: "Đức Hùng",
    avatar: "/tutor-kenji.jpg",
    level: "C1",
    time: "1 giờ",
    content:
      "Theo kinh nghiệm của mình thì nên tập trung vào collocations hơn là học từ đơn lẻ. Các bạn có thể thử Oxford Collocations Dictionary.",
    likes: 24,
    awarded: true,
  },
  {
    id: 3,
    user: "Sophie Tran",
    avatar: "/tutor-sophie.jpg",
    level: "B1",
    time: "45 phút",
    content: "Cảm ơn bạn đã chia sẻ! Mình đã bookmark lại.",
    likes: 5,
  },
]

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient sm:p-8"
      >
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/tutor-emma.jpg" alt="" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Emma Wilson</span>
                <Badge variant="secondary" className="h-5">
                  Tutor
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Tiếng Anh · 2 ngày trước</div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </header>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge>IELTS</Badge>
          <Badge variant="outline">Writing</Badge>
          <Badge variant="outline">Tips</Badge>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold text-pretty sm:text-4xl">
          5 bí quyết tăng band Writing IELTS từ 6.0 lên 7.5
        </h1>

        <div className="mt-6 prose prose-sm max-w-none leading-relaxed text-foreground">
          <p>
            Sau 3 năm luyện thi IELTS và giúp hơn 200 học viên đạt mục tiêu, mình muốn chia sẻ
            những điều mình rút ra được để giúp các bạn cải thiện kỹ năng Writing một cách có hệ
            thống.
          </p>
          <h3 className="mt-6 font-serif text-xl font-semibold">1. Tập trung vào Task Response</h3>
          <p>
            Task Response chiếm 25% tổng điểm. Hãy đọc kỹ đề, trả lời đầy đủ tất cả các phần yêu
            cầu và duy trì quan điểm nhất quán xuyên suốt bài viết.
          </p>
          <h3 className="mt-6 font-serif text-xl font-semibold">2. Collocations thay vì từ đơn lẻ</h3>
          <p>
            Thay vì học từng từ riêng lẻ, hãy học theo cụm. Ví dụ thay vì &quot;big problem&quot;,
            hãy dùng &quot;pressing issue&quot; hoặc &quot;mounting concern&quot;.
          </p>
          <h3 className="mt-6 font-serif text-xl font-semibold">3. Đa dạng cấu trúc câu</h3>
          <p>
            Giám khảo đánh giá khả năng sử dụng đa dạng cấu trúc. Luyện tập câu phức với mệnh đề
            quan hệ, câu điều kiện, và inversion.
          </p>
          <h3 className="mt-6 font-serif text-xl font-semibold">4. Kế hoạch trước khi viết</h3>
          <p>
            Dành 5 phút đầu tiên để brainstorm và lập dàn ý. Một bài viết có cấu trúc rõ ràng luôn
            đạt điểm Coherence cao hơn.
          </p>
          <h3 className="mt-6 font-serif text-xl font-semibold">5. Đọc sample answers band 9</h3>
          <p>
            Tham khảo các bài mẫu band 9 từ những nguồn uy tín như Cambridge hoặc IELTS Liz để nắm
            được phong cách viết academic chuẩn.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={() => setLiked(!liked)}
            className="gap-2"
          >
            <Heart className={liked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
            {124 + (liked ? 1 : 0)}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {COMMENTS.length}
          </Button>
          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            onClick={() => setSaved(!saved)}
          >
            <Bookmark className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            Đọc bài
          </div>
        </div>
      </motion.article>

      <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
        <h2 className="mb-4 font-serif text-xl font-semibold">Bình luận ({COMMENTS.length})</h2>

        <div className="mb-6 flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="min-h-[80px] resize-none"
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" disabled={!comment.trim()}>
                <Send className="mr-2 h-3.5 w-3.5" />
                Gửi
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {COMMENTS.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={c.avatar || "/placeholder.svg"} alt="" />
                <AvatarFallback>{c.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="rounded-2xl bg-surface-low p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{c.user}</span>
                    <Badge variant="outline" className="h-5 text-[10px]">
                      {c.level}
                    </Badge>
                    {c.awarded && (
                      <Badge className="h-5 gap-1 bg-accent text-accent-foreground text-[10px]">
                        <Award className="h-3 w-3" />
                        Best answer
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{c.content}</p>
                </div>
                <div className="mt-2 flex items-center gap-4 pl-2">
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    {c.likes}
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
