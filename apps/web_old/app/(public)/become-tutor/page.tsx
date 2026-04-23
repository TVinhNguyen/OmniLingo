"use client"

import { motion } from "motion/react"
import Link from "next/link"
import {
  DollarSign,
  Clock,
  Users,
  GraduationCap,
  Heart,
  Globe,
  Upload,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const benefits = [
  {
    icon: DollarSign,
    title: "Thu nhập hấp dẫn",
    desc: "$15–$60/giờ tùy kinh nghiệm. Thanh toán hằng tuần qua chuyển khoản hoặc PayPal.",
  },
  {
    icon: Clock,
    title: "Lịch linh hoạt",
    desc: "Dạy từ bất kỳ đâu, bất kỳ khi nào. Bạn kiểm soát hoàn toàn lịch trình của mình.",
  },
  {
    icon: Users,
    title: "Tiếp cận 2M+ học viên",
    desc: "Hệ thống matching thông minh đưa học viên phù hợp đến với bạn tự động.",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo liên tục",
    desc: "Khóa học sư phạm miễn phí, webinar hàng tháng và cộng đồng 15K+ giáo viên.",
  },
  {
    icon: Heart,
    title: "Hỗ trợ tận tâm",
    desc: "Đội hỗ trợ riêng cho giáo viên, xử lý tranh chấp và chăm sóc học viên.",
  },
  {
    icon: Globe,
    title: "Ảnh hưởng toàn cầu",
    desc: "Thay đổi cuộc sống của học viên từ Việt Nam đến Brazil mỗi ngày.",
  },
]

const steps = [
  {
    n: 1,
    title: "Nộp hồ sơ",
    desc: "Điền form 5 phút với thông tin cơ bản và video giới thiệu 2 phút.",
  },
  {
    n: 2,
    title: "Phỏng vấn demo",
    desc: "Dạy thử 30 phút với chuyên gia tuyển dụng của OmniLingo.",
  },
  {
    n: 3,
    title: "Hoàn tất hồ sơ",
    desc: "Tạo profile chuyên nghiệp, đặt giá và lịch trống.",
  },
  {
    n: 4,
    title: "Đón học viên đầu tiên",
    desc: "Thường mất 1–2 tuần. Chúng tôi sẽ hỗ trợ marketing cho bạn.",
  },
]

export default function BecomeTutorPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-5xl px-4 text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Heart className="mr-1.5 h-3 w-3" />
          Trở thành giáo viên
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Dạy ngôn ngữ bạn yêu. <span className="text-gradient-primary">Thay đổi cuộc sống.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          Gia nhập cộng đồng 15.000+ giáo viên trên OmniLingo. Thu nhập chủ động, lịch linh hoạt,
          và tác động thực sự đến học viên khắp thế giới.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover">
            <Link href="#apply">Nộp hồ sơ ngay</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="#how">Tìm hiểu thêm</Link>
          </Button>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6">
          {[
            { v: "$45", l: "Thu nhập trung bình/giờ" },
            { v: "15K+", l: "Giáo viên đang hoạt động" },
            { v: "4.9", l: "Đánh giá trung bình" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold tracking-tight text-gradient-primary">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Vì sao giáo viên chọn <span className="text-gradient-primary">OmniLingo</span>?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto mt-20 max-w-5xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Quy trình ứng tuyển</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((s) => (
            <Card
              key={s.n}
              className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="apply" className="mx-auto mt-20 max-w-3xl px-4">
        <Card className="rounded-3xl border border-border bg-surface-lowest p-8 shadow-ambient md:p-10">
          <h2 className="text-2xl font-bold tracking-tight">Nộp hồ sơ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Điền form dưới đây, chúng tôi sẽ phản hồi trong 3 ngày làm việc.
          </p>

          <form className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input id="fullname" placeholder="Nguyễn Văn A" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="language">Ngôn ngữ bạn muốn dạy</Label>
                <Input id="language" placeholder="VD: Tiếng Anh, Tiếng Nhật" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp">Số năm kinh nghiệm</Label>
                <Input id="exp" type="number" placeholder="2" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Chia sẻ về phương pháp giảng dạy, kinh nghiệm và điều khiến bạn đặc biệt..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="video">Video giới thiệu (URL)</Label>
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-surface-low p-4">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Dán link YouTube/Vimeo hoặc tải lên sau khi gửi form
                </span>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-surface-low p-4 text-sm text-muted-foreground">
              {[
                "Bạn là người bản ngữ hoặc có trình độ C1+",
                "Đã có ít nhất 1 năm kinh nghiệm dạy",
                "Máy tính + internet ổn định",
                "Chấp nhận quy tắc ứng xử của OmniLingo",
              ].map((r) => (
                <div key={r} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              type="button"
              className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover"
            >
              Gửi hồ sơ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>
      </section>
    </div>
  )
}
