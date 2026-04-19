import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const cookieTypes = [
  {
    name: "Thiết yếu",
    required: true,
    desc: "Cần thiết để đăng nhập, giữ phiên và bảo mật. Không thể tắt.",
  },
  {
    name: "Hiệu năng & phân tích",
    required: false,
    desc: "Giúp chúng tôi hiểu bạn dùng sản phẩm thế nào để cải thiện trải nghiệm (Vercel Analytics).",
  },
  {
    name: "Cá nhân hoá",
    required: false,
    desc: "Ghi nhớ ngôn ngữ giao diện, chủ đề dark/light và tuỳ chọn khác.",
  },
  {
    name: "Marketing",
    required: false,
    desc: "Đo hiệu quả chiến dịch và hiển thị nội dung phù hợp hơn.",
  },
]

export default function CookiesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Pháp lý
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Chính sách Cookie
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          OmniLingo sử dụng cookie để nâng cao trải nghiệm của bạn. Bạn có thể tuỳ chỉnh bất kỳ lúc nào.
        </p>

        <Card className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface-lowest shadow-ambient">
          <div className="divide-y divide-border">
            {cookieTypes.map((c) => (
              <div key={c.name} className="flex items-start justify-between gap-4 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{c.name}</h3>
                    {c.required && (
                      <Badge variant="secondary" className="rounded-full text-xs">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
                <Switch checked={c.required ? true : undefined} disabled={c.required} />
              </div>
            ))}
          </div>
        </Card>

        <p className="mt-8 text-sm text-muted-foreground">
          Thay đổi sẽ được lưu trên thiết bị của bạn và có thể đồng bộ nếu bạn đăng nhập.
        </p>
      </div>
    </div>
  )
}
