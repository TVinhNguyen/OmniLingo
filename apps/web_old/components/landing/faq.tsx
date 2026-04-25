"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Tôi có thể học miễn phí không?",
    a: "Có. Gói Free cho phép 5 lesson/ngày với 1 ngôn ngữ, SRS cơ bản, và truy cập cộng đồng. Nâng cấp bất kỳ lúc nào.",
  },
  {
    q: "OmniLingo hỗ trợ những ngôn ngữ nào?",
    a: "Hiện tại: Tiếng Anh, Nhật, Trung, Hàn, Pháp, Đức, Tây Ban Nha và Tiếng Việt cho người nước ngoài. Chúng tôi đang mở thêm Ý, Bồ Đào Nha, Ả Rập.",
  },
  {
    q: "AI Tutor khác gì giáo viên người thật?",
    a: "AI Tutor sẵn sàng 24/7, giá rẻ, phản hồi tức thì cho luyện nói và viết. Giáo viên bản xứ phù hợp khi bạn cần hướng dẫn sâu, roleplay phức tạp, chấm bài chuẩn thi. Hai loại bổ trợ lẫn nhau.",
  },
  {
    q: "Có đảm bảo tăng điểm chứng chỉ không?",
    a: "Gói Ultimate có cam kết tăng band điểm IELTS tối thiểu 0.5 nếu học đủ lộ trình 12 tuần, nếu không chúng tôi gia hạn miễn phí.",
  },
  {
    q: "Tôi có thể huỷ đăng ký bất kỳ lúc nào không?",
    a: "Có. Huỷ chỉ với 3 click trong Settings → Subscription. Không có phí huỷ, không câu hỏi khó chịu.",
  },
  {
    q: "Dữ liệu học tập có đồng bộ giữa các thiết bị không?",
    a: "Có. Web, iOS, Android đồng bộ realtime. Gói Plus trở lên còn có offline mode: tải lesson và SRS deck về để học không cần internet.",
  },
  {
    q: "Có chương trình giới thiệu bạn bè không?",
    a: "Có. Mỗi bạn bè đăng ký Plus/Pro qua link của bạn, cả hai được tặng 1 tháng miễn phí. Xem trang Referral trong tài khoản.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center" data-aos="fade-up">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Không thấy câu trả lời?{" "}
            <a href="/contact" className="font-semibold text-accent hover:underline">
              Liên hệ với chúng tôi
            </a>
            .
          </p>
        </div>

        <div className="mt-12" data-aos="fade-up" data-aos-delay="100">
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-3"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border-0 bg-surface-lowest shadow-ambient"
              >
                <AccordionTrigger className="px-6 py-5 text-left text-base font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
