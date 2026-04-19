import { Heart, Globe2, Users2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-4 text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Câu chuyện của chúng tôi
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Ngôn ngữ là những cây cầu. <span className="text-gradient-primary">Chúng tôi xây cùng bạn.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          OmniLingo bắt đầu năm 2021 khi ba người bạn — một nhà ngôn ngữ học, một kỹ sư và một giáo viên —
          muốn tạo ra một cách học ngôn ngữ nhẹ nhàng, nhân văn hơn. Hôm nay chúng tôi đồng hành cùng
          hơn 2 triệu học viên trên 20+ ngôn ngữ.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: Users2, label: "Học viên", value: "2.1M+" },
            { icon: Globe2, label: "Ngôn ngữ", value: "20+" },
            { icon: Heart, label: "Bài học hoàn thành", value: "318M" },
            { icon: Sparkles, label: "Hội thoại AI", value: "45M" },
          ].map((s) => (
            <Card
              key={s.label}
              className="rounded-3xl border border-border bg-surface-lowest p-6 text-center shadow-ambient"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4">
        <h2 className="mb-6 text-3xl font-bold tracking-tight">Chúng tôi tin điều gì?</h2>
        <div className="space-y-4 text-lg leading-relaxed text-foreground">
          <p>
            Ngôn ngữ không chỉ là từ vựng và ngữ pháp — nó là văn hoá, danh tính và sự kết nối.
            Công việc của chúng tôi là làm cho hành trình đến fluency nhẹ nhàng, ấm áp và chân thật hơn.
          </p>
          <p>
            Chúng tôi dựa trên khoa học: spaced repetition, comprehensible input, deliberate practice.
            Nhưng chúng tôi gói tất cả trong thiết kế tôn trọng thời gian và cảm xúc của bạn.
            Bởi không ai học tốt khi cảm thấy lo lắng hay vội vã.
          </p>
          <p>
            Trên hết, chúng tôi tin vào sức mạnh của giáo viên con người. AI của chúng tôi là bạn học tuyệt vời,
            nhưng các giáo viên trên nền tảng mới là linh hồn của OmniLingo.
          </p>
        </div>
      </section>
    </div>
  )
}
