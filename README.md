# OmniLingo Academy — Kiến trúc Nền tảng Học Ngôn ngữ Đa năng

[![CI](https://github.com/TVinhNguyen/OmniLingo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/TVinhNguyen/OmniLingo/actions/workflows/ci.yml)

Bộ tài liệu kiến trúc cho một nền tảng học ngôn ngữ tổng hợp (web + mobile) hỗ trợ nhiều ngôn ngữ (Anh, Nhật, Trung, Hàn, Pháp, Đức, Tây Ban Nha, Việt cho người nước ngoài…), tích hợp đầy đủ các module học (từ vựng, ngữ pháp, nghe chép chính tả, đọc, nói, viết), luyện đề chứng chỉ quốc tế (TOEIC, IELTS, TOEFL, HSK, JLPT, TOPIK, DELF/DELE, Cambridge), lộ trình học cá nhân hoá và nhiều gói đăng ký phân tầng.

## 📊 Trạng thái dự án (2026-04-25)

| Milestone | Định nghĩa | Status | ETA |
|-----------|-----------|--------|-----|
| **Tech Wire** | FE↔BE wired, CI green, code build clean | ✅ ~99% | Done |
| **MVP1 Alpha** | + content demo + staging deploy | ⏳ ~30% | ~4 tuần |
| **MVP1 Beta** | + provider thật + 30-50 user UAT | ⏳ ~10% | ~6 tuần |
| **MVP1 Launch (VN-only)** | + legal PDPL + Hetzner VPS deploy + content seed | ⏳ ~5% | **~9 tuần** (ETA 2026-06-25) |

**Đọc kỹ trước khi đánh giá**: technical wiring xong **không nghĩa là** product ship được. Còn cần content (lesson/audio/đề thi), production deploy, provider integration (Stripe/SES/ElevenLabs), legal review.

📋 **Checklist chi tiết task ship-blocker**: [docs/mvp1-product-readiness-checklist.md](./docs/mvp1-product-readiness-checklist.md)
🔧 **Trạng thái wire FE↔BE từng flow**: [docs/wiring-status-2026-04-22.md](./docs/wiring-status-2026-04-22.md)
🛠️ **Plan phát triển 4 tuần**: [docs/development-plan-2026-04-25.md](./docs/development-plan-2026-04-25.md)
🤖 **Task brief Gemini Wave 2**: [docs/gemini-tasks-wave2-hardening.md](./docs/gemini-tasks-wave2-hardening.md)

## Cấu trúc tài liệu

| # | Tài liệu | Nội dung chính |
|---|---------|----------------|
| 00 | [README.md](./README.md) | Mục lục, executive summary |
| 01 | [01-product-overview.md](./01-product-overview.md) | Tầm nhìn, target users, phân tích đối thủ, USP |
| 02 | [02-features-and-learning-modules.md](./02-features-and-learning-modules.md) | Danh mục đầy đủ các tính năng và module học |
| 03 | [03-high-level-architecture.md](./03-high-level-architecture.md) | Kiến trúc tổng quan, nguyên tắc thiết kế |
| 04 | [04-microservices-breakdown.md](./04-microservices-breakdown.md) | Chi tiết từng microservice, trách nhiệm, API |
| 05 | [05-data-model.md](./05-data-model.md) | Mô hình dữ liệu, omnilingo persistence |
| 06 | [06-tech-stack.md](./06-tech-stack.md) | Ngôn ngữ lập trình, framework, lý do chọn |
| 07 | [07-ai-ml-services.md](./07-ai-ml-services.md) | Speech, NLP, adaptive learning, AI tutor |
| 08 | [08-infrastructure-and-deployment.md](./08-infrastructure-and-deployment.md) | Cloud, Kubernetes, CI/CD, CDN, đa vùng |
| 09 | [09-security-and-compliance.md](./09-security-and-compliance.md) | Xác thực, GDPR, PCI-DSS, COPPA, chống gian lận |
| 10 | [10-subscription-and-monetization.md](./10-subscription-and-monetization.md) | Gói subscription, pricing, payment, B2B |
| 11 | [11-learning-paths-and-curriculum.md](./11-learning-paths-and-curriculum.md) | Lộ trình học, SRS, CEFR/JLPT/HSK mapping |
| 12 | [12-observability-and-sre.md](./12-observability-and-sre.md) | Monitoring, logging, SLO, incident response |
| 13 | [13-roadmap-and-phasing.md](./13-roadmap-and-phasing.md) | Lộ trình triển khai MVP → Scale |

## Executive Summary

OmniLingo Academy định vị là "**một nền tảng — mọi ngôn ngữ — mọi mục tiêu**". Không như Duolingo tập trung gamification cho người mới bắt đầu, hay WaniKani chuyên Kanji, hoặc Prep.vn chuyên luyện IELTS, chúng ta hợp nhất ba nhu cầu mà hiện tại người học phải dùng 3–5 app khác nhau để đáp ứng:

1. **Học ngôn ngữ hằng ngày** (vocab, grammar, listening, speaking) với SRS và AI tutor.
2. **Luyện thi chứng chỉ** (TOEIC/IELTS/TOEFL/HSK/JLPT…) với đề thật + AI chấm Writing/Speaking.
3. **Học 1-kèm-1 hoặc nhóm** với giáo viên thật (marketplace kiểu italki/Preply).

### Tiếp cận kiến trúc cốt lõi

- **Microservices theo domain** (Learning, Content, Assessment, Tutoring, Billing, Social…) thay vì monolith, để mỗi module có thể scale và phát hành độc lập.
- **OmniLingo persistence**: PostgreSQL cho core transactional data, MongoDB cho content phi cấu trúc, Redis cho cache/session/leaderboard, Elasticsearch cho tìm kiếm, ClickHouse cho analytics, S3 cho media.
- **Event-driven** qua Kafka để tách biệt học liệu, tracking, analytics, notification.
- **AI-first**: Speech-to-Text (Whisper), Text-to-Speech (đa nhà cung cấp), LLM (Claude/GPT/Gemini) cho AI tutor, pronunciation scoring, essay grading, phân phối lộ trình thích ứng (adaptive learning).
- **Edge-optimized**: CDN + edge compute (Cloudflare Workers) cho audio/video và static content, đặc biệt quan trọng vì 60–70% nội dung là media.
- **Mobile-first**: React Native/Flutter với offline-first, vì học ngôn ngữ đa phần xảy ra trên điện thoại, trong lúc di chuyển.

### Pricing Model (tóm tắt — chi tiết ở tài liệu 10)

| Gói | Đối tượng | Giá tham khảo |
|------|-----------|----------------|
| **Free** | Người mới thử, bị giới hạn số bài/ngày, có quảng cáo | 0đ |
| **Plus** | Học cá nhân 1 ngôn ngữ, không quảng cáo, offline, SRS không giới hạn | ~99k/tháng |
| **Pro** | Tất cả ngôn ngữ, AI tutor không giới hạn, luyện đề + chấm Writing/Speaking AI, báo cáo tiến độ chuyên sâu | ~249k/tháng |
| **Ultimate** | Pro + credit học 1-1 với giáo viên, live classes, mock test với giám thị | ~599k/tháng |
| **Family** | Tối đa 6 thành viên, tất cả tính năng Pro | ~399k/tháng |
| **B2B / Schools** | Quản trị lớp, phân công bài, báo cáo, SSO | Custom |

## Cách đọc bộ tài liệu này

Đọc theo thứ tự 01 → 13 nếu là lần đầu. Nếu bạn là:

- **Product Manager / BA**: đọc 01, 02, 10, 11, 13.
- **Tech Lead / Architect**: đọc toàn bộ, đặc biệt 03, 04, 05, 06, 08.
- **DevOps / SRE**: tập trung 08, 12, 09.
- **ML Engineer**: 07, 05 (schema), 11 (adaptive learning).
- **Backend Engineer**: 04, 05, 06, 09.
- **Frontend / Mobile Engineer**: 02, 06, 07 (client SDK cho AI).

## E2E Testing

Playwright E2E tests live in `apps/web-e2e/` and cover four critical journeys: authentication, onboarding, billing, and learning.

**E2E gates the main branch.** The CI E2E Playwright job runs on every PR that touches `apps/web-e2e/**` or `apps/web/**` paths and must pass before merge. Tests run against Chromium in CI with one retry. Locally, all three browser engines (Chromium, Firefox, WebKit) are exercised.

```bash
# Run locally (starts Next.js dev server automatically)
cd apps/web-e2e && pnpm install && pnpm exec playwright install --with-deps
pnpm test

# Run CI-style (Chromium only, GitHub reporter)
CI=true pnpm test:ci
```

## Quy ước trong tài liệu

- Sơ đồ được viết bằng cú pháp **Mermaid** để có thể render trực tiếp trên GitHub/GitLab.
- Tên dịch vụ theo kebab-case (`vocabulary-service`, `assessment-service`).
- API prefix: `/api/v1/...`.
- Sự kiện Kafka: `<domain>.<entity>.<action>` ví dụ `learning.lesson.completed`.
