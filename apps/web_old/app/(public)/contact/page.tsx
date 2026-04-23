import { Mail, MessageSquare, Phone, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const channels = [
    {
      icon: MessageSquare,
      title: "Chat trực tiếp",
      desc: "Phản hồi trung bình trong 3 phút",
      value: "Bắt đầu chat",
    },
    {
      icon: Mail,
      title: "Email",
      desc: "Phản hồi trong 24 giờ",
      value: "support@omnilingo.app",
    },
    {
      icon: Phone,
      title: "Hotline (chỉ Premium)",
      desc: "Thứ 2–Thứ 6, 8:00–20:00 GMT+7",
      value: "1900 6868",
    },
    {
      icon: MapPin,
      title: "Văn phòng",
      desc: "Địa chỉ làm việc",
      value: "Tầng 12, VP Tower, Cầu Giấy, Hà Nội",
    },
  ]

  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-4 text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Liên hệ
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Hãy <span className="text-gradient-primary">nói chuyện</span> với chúng tôi
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground">
          Dù là câu hỏi kỹ thuật, góp ý sản phẩm hay đề xuất hợp tác — chúng tôi luôn sẵn lòng lắng nghe.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-10 px-4 md:grid-cols-2">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((c) => (
              <Card
                key={c.title}
                className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <p className="mt-3 text-sm font-semibold">{c.value}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 rounded-3xl border border-border bg-gradient-primary p-6 text-primary-foreground shadow-ambient">
            <h3 className="text-xl font-bold">Mọi giờ, mọi nơi</h3>
            <p className="mt-2 text-sm opacity-90">
              Cộng đồng OmniLingo hoạt động 24/7 trên 40+ quốc gia — luôn có người sẵn sàng giúp đỡ
              dù bạn đang ở múi giờ nào.
            </p>
          </Card>
        </div>

        <Card className="rounded-3xl border border-border bg-surface-lowest p-8 shadow-ambient">
          <h2 className="text-2xl font-bold tracking-tight">Gửi tin nhắn</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chúng tôi sẽ phản hồi trong vòng 24 giờ.
          </p>
          <form className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input id="name" placeholder="Nguyễn Văn A" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Chủ đề</Label>
              <Input id="subject" placeholder="Tôi cần hỗ trợ về..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Nội dung</Label>
              <Textarea id="message" rows={6} placeholder="Mô tả chi tiết vấn đề của bạn..." />
            </div>
            <Button
              type="button"
              size="lg"
              className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover"
            >
              Gửi tin nhắn
            </Button>
          </form>
        </Card>
      </section>
    </div>
  )
}
