import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Pháp lý
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Điều khoản dịch vụ
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Cập nhật lần cuối: 01/04/2026</p>

        <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-foreground">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    title: "1. Chấp nhận điều khoản",
    body:
      "Bằng việc truy cập và sử dụng OmniLingo, bạn đồng ý tuân theo các điều khoản sau. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.",
  },
  {
    title: "2. Tài khoản người dùng",
    body:
      "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập. Không chia sẻ tài khoản cho người khác. Mỗi người chỉ được tạo một tài khoản cá nhân.",
  },
  {
    title: "3. Thanh toán & hoàn tiền",
    body:
      "Gói Premium được tự gia hạn. Bạn có thể huỷ bất kỳ lúc nào. Chúng tôi hoàn tiền 100% trong vòng 7 ngày đầu nếu bạn không hài lòng.",
  },
  {
    title: "4. Quyền sở hữu nội dung",
    body:
      "Toàn bộ nội dung bài học, âm thanh, video là tài sản của OmniLingo hoặc đối tác. Không sao chép, phát tán hay thương mại hoá nếu chưa được cho phép.",
  },
  {
    title: "5. Quy tắc ứng xử",
    body:
      "Không được spam, quấy rối, phát ngôn thù ghét, hoặc chia sẻ nội dung vi phạm pháp luật trong cộng đồng và khi tương tác với giáo viên.",
  },
  {
    title: "6. Giới hạn trách nhiệm",
    body:
      "OmniLingo nỗ lực cung cấp dịch vụ chất lượng cao, nhưng không cam kết đạt kết quả học tập cụ thể. Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp.",
  },
  {
    title: "7. Thay đổi điều khoản",
    body:
      "Chúng tôi có thể cập nhật điều khoản bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo qua email ít nhất 14 ngày trước khi áp dụng.",
  },
  {
    title: "8. Liên hệ",
    body:
      "Mọi thắc mắc về điều khoản, vui lòng gửi email về legal@omnilingo.app hoặc qua trang Liên hệ.",
  },
]
