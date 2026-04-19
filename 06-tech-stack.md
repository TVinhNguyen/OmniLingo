# 06 — Tech Stack & Programming Languages

## 1. Triết lý chọn công nghệ

Ba nguyên tắc:

1. **OmniLingo có kỷ luật**: Cho phép nhiều ngôn ngữ nhưng giới hạn trong bộ đã phê duyệt (Go, TypeScript, Python, Rust, Swift, Kotlin). Không tuỳ hứng thêm Elixir, Scala, PHP… trừ khi có lý do business thật sự.
2. **Tool đã trưởng thành**: Ưu tiên tech stack có cộng đồng lớn, doc tốt, tuyển dụng dễ. Không đem bleeding-edge vào production path (ví dụ: dùng Next.js stable thay vì canary; dùng Kubernetes thay vì tự viết orchestrator).
3. **Match workload**: Ngôn ngữ phù hợp với nature của service. CRUD-heavy → Go/TS; CPU-bound stateful → Rust; ML/data → Python; UI → JS/Swift/Kotlin.

## 2. Tổng quan ngôn ngữ theo service

| Service type | Ngôn ngữ | Framework chính | Lý do |
|--------------|----------|-----------------|-------|
| High-throughput CRUD (identity, learning, assess, billing) | **Go** | Fiber / Echo, gRPC (tonic-free) | Fast, low memory, simple concurrency, tuyển dev dễ |
| Content-heavy với shape thay đổi (content, grammar, social, classroom, media, notification) | **TypeScript (Node.js)** | Fastify / NestJS | Ecosystem lớn, type-safe, share types với frontend |
| Hot-path tính toán (srs-service) | **Rust** | Axum + tonic | Performance, memory-safe, fsrs-rs sẵn |
| AI/ML & data-heavy (speech-ai, writing-ai, ai-tutor, search, dictionary, moderation, proctoring) | **Python** | FastAPI | Thư viện ML (torch, transformers, sentence-transformers), ecosystem AI |
| LLM proxy/gateway | **Go** | Custom | Low-latency proxy layer; type-safe; avoid GIL |
| Web frontend | **TypeScript + React** | Next.js 15 (App Router) | SEO cho marketing pages, SSR/ISR, React Server Components |
| iOS app native | **Swift** + **SwiftUI** | — | Hiệu năng tốt nhất, truy cập native API (Speech, CoreML) |
| Android app native | **Kotlin** + **Jetpack Compose** | — | Tương tự iOS |
| Cross-platform mobile (nếu chọn) | **React Native** hoặc **Flutter** | RN + Reanimated 3 + Hermes | Share code, team nhỏ |
| Desktop (optional) | Tauri (Rust shell + Web UI) | — | Nhẹ hơn Electron |
| Admin dashboard (nội bộ) | TypeScript + React | Next.js + Mantine/AntD | Nhanh, tiêu chuẩn |
| DevOps / IaC | **Terraform** + **Helm** + **Go/Python** scripts | — | Đã thành chuẩn |

## 3. Lý do chi tiết từng lựa chọn

### 3.1. Tại sao Go cho CRUD services?

- Biên dịch single static binary — deploy cực đơn giản, container nhẹ (< 20MB).
- Goroutines xử lý concurrency đơn giản hơn async/await rối của Node hoặc thread của Java.
- Memory footprint thấp — tiết kiệm chi phí k8s.
- Stdlib http, crypto, json đã đủ tốt cho 80% use case.
- **Rủi ro**: Không phong phú như Node/Python cho một số nhu cầu đặc biệt (AI, scraping). Nhưng với vai trò CRUD, Go dư sức.

### 3.2. Tại sao TypeScript cho content/social services?

- Shape dữ liệu content (nested, polymorphic) hợp với JS/TS hơn — không cần struct tag dày đặc như Go.
- Share TypeScript types với frontend qua một package nội bộ (`@omnilingo/shared-types`) — tránh "double definition".
- Ecosystem mạnh cho CMS, Markdown processing, sanitize HTML, rich-text editor backend.
- **NestJS** hoặc **Fastify**? → NestJS cho service có domain layer phức tạp (billing-service), Fastify cho service mỏng (content-service).

### 3.3. Tại sao Rust cho srs-service?

- srs-service xử lý request cực tần suất cao (mỗi user có thể 50–200 reviews/phiên). Tính toán FSRS không đắt nhưng cần cực nhanh và predictable.
- Rust + tonic (gRPC) cho throughput cao, tail latency thấp.
- fsrs-rs là implementation tham chiếu được maintain tốt.
- **Rủi ro**: Tuyển dev Rust khó hơn. Mitigate: code base nhỏ, self-contained, mỗi engineer dành 1 tuần ramp-up là đủ.

### 3.4. Tại sao Python cho AI/ML?

- Gần như mọi lib ML/NLP (torch, transformers, whisper, faster-whisper, sentence-transformers, spaCy) là Python-first.
- FastAPI có async + pydantic + OpenAPI auto — nhanh và đủ hiện đại.
- Cần chấp nhận GIL: các endpoint I/O-bound (gọi OpenAI) dùng async thoải mái; endpoint CPU-bound (inference local) dùng multiprocessing hoặc tách worker (Ray, Celery).

### 3.5. Tại sao Next.js cho web?

- App Router + React Server Components cho phép giảm JS bundle gửi client.
- SSG cho marketing pages (SEO), ISR cho content pages (revalidate mỗi 1 giờ), SSR/streaming cho dashboard cá nhân.
- Image optimization built-in.
- Vercel-ready nhưng không bắt buộc Vercel — có thể deploy lên k8s với standalone output.

### 3.6. Native mobile hay cross-platform?

Đây là quyết định lớn. Phân tích:

| Tiêu chí | Native (Swift + Kotlin) | React Native | Flutter |
|----------|:-----------------------:|:------------:|:-------:|
| Hiệu năng | 10/10 | 7–8/10 với Hermes+Reanimated | 8–9/10 |
| Chi phí phát triển | 2 team, 2 code base | 1 team, 1 code base | 1 team, 1 code base |
| Access native (Speech recognition, handwriting, Widgets) | Tốt nhất | Phải viết native module | Phải viết native module |
| Hot reload / DX | Khá | Rất tốt | Rất tốt |
| Cộng đồng thư viện | Lớn | Lớn | Trung bình |
| Animation phức tạp | Tốt nhất | Khá với Reanimated 3 | Rất tốt |

**Khuyến nghị Phase 1**: React Native với Expo (hoặc bare RN nếu cần native audio processing). Lý do: team nhỏ, 70–80% tính năng không cần native đặc biệt. Với phần cần native chuyên sâu (real-time audio pipeline cho voice tutor, handwriting cho Kanji/Hán), viết native module riêng qua TurboModules.

**Phase 2–3**: cân nhắc tách native app riêng nếu thị phần iOS tăng và cần tối ưu sâu (CoreML on-device speech).

### 3.7. Tại sao Kafka thay vì RabbitMQ làm event bus?

- Replay history (để rebuild projection): Kafka có log-based, RabbitMQ không.
- Throughput: Kafka scale tới hàng triệu/giây, RabbitMQ ~100k/giây.
- Nhưng Kafka ops nặng hơn → giai đoạn đầu có thể dùng managed (Confluent Cloud, AWS MSK, Aiven) để tập trung product.
- RabbitMQ vẫn dùng cho **task queue** (transcode video, send email) vì có DLQ, priority queue, delayed exchange dễ hơn.

### 3.8. PostgreSQL thay vì MySQL?

- JSONB mạnh, cần cho nhiều column flexible.
- Extension: pgvector (embedding), pg_trgm (fuzzy search), ltree (hierarchy), TimescaleDB (time series).
- MVCC + transactional DDL → migration an toàn hơn.
- MySQL vẫn tốt nhưng Postgres đã thắng mindshare trong hệ sinh thái mới.

## 4. Frontend stack chi tiết

### Web (Next.js)
```
next@15               # App Router, RSC
react@19
typescript@5.4
tailwindcss@3.4
shadcn/ui             # component base
radix-ui              # headless primitives
zustand / jotai       # client state (light)
@tanstack/react-query # server state
@apollo/client        # GraphQL (hoặc urql)
zod                   # validation
next-intl             # i18n
framer-motion         # animation
```

### Mobile (React Native)
```
react-native@0.76
expo@52               # bắt đầu với Expo SDK
expo-router           # file-based routing
nativewind            # tailwind cho RN
@shopify/restyle hoặc @gorhom/bottom-sheet
react-native-reanimated@3
react-native-gesture-handler
@tanstack/react-query
mmkv                  # fast key-value storage
@react-native-firebase/* # FCM, analytics
react-native-track-player # audio lesson
react-native-webrtc   # voice tutor
```

### iOS native modules (custom) — nếu cần
- `AVAudioEngine` + Apple Speech framework cho pronunciation on-device.
- PencilKit cho vẽ Kanji/Hán.

### Android native modules
- `MediaRecorder` + Google Speech on-device (ML Kit Digital Ink Recognition cho handwriting).

## 5. Backend stack chi tiết

### Go services
```
go 1.22+
fiber v2 hoặc echo     # HTTP
grpc-go + buf          # gRPC + proto tooling
sqlc                   # generate type-safe Go code từ SQL
goose                  # migrations
zap hoặc zerolog       # structured logging
otel-go                # tracing
wire hoặc fx           # DI (optional)
golang-migrate (alt)
testify                # assertions in tests
```

### Node.js / TypeScript services
```
node 22 LTS
fastify@4              # HTTP
@grpc/grpc-js + ts-proto
prisma hoặc drizzle    # ORM
pino                   # logging
@opentelemetry/*
vitest hoặc jest
```

### Python services
```
python 3.12
fastapi
pydantic v2
uvicorn / hypercorn
sqlalchemy 2.0 + alembic
httpx
anyio
opentelemetry-python
pytest + pytest-asyncio
# ML:
torch 2.4
transformers
faster-whisper
sentence-transformers
```

### Rust services
```
rust 1.80+
axum                   # HTTP
tonic                  # gRPC
sqlx                   # async SQL, compile-time checked
tokio runtime
tracing + tracing-opentelemetry
```

## 6. Shared tooling

- **API contracts**: Protobuf cho gRPC, OpenAPI 3.1 cho REST public, GraphQL SDL cho BFF.
- **Code generation**: buf (proto), oapi-codegen (OpenAPI→Go), ts-proto, orval (OpenAPI→TS client).
- **Linting**: golangci-lint, eslint + @typescript-eslint, ruff + mypy, clippy.
- **Formatter**: gofmt, prettier, ruff format.
- **Testing**:
  - Unit: tuỳ ngôn ngữ.
  - Integration: testcontainers (Postgres, Redis, Kafka) — chạy trong CI.
  - E2E: Playwright cho web, Detox cho RN.
  - Contract testing: Pact giữa các service quan trọng.
- **Load test**: k6 (TypeScript script).

## 7. Third-party services & SaaS

| Loại | Lựa chọn chính | Backup / alternative |
|------|----------------|----------------------|
| Email | Amazon SES | SendGrid |
| SMS | Twilio | Local VN SMS gateway |
| Push | Firebase Cloud Messaging + APNs | OneSignal |
| Analytics | Mixpanel hoặc Amplitude | Self-host PostHog |
| Error tracking | Sentry | — |
| Session replay | Sentry / LogRocket | — |
| Support | Intercom hoặc Freshchat | Crisp |
| Feature flags | Unleash (self-host) hoặc Growthbook | LaunchDarkly (nếu ngân sách) |
| Experimentation | Growthbook | Statsig |
| Search (nếu không self-host ES) | Algolia hoặc Typesense Cloud | — |
| Email/Landing | Mailchimp / Customer.io | — |
| Payment | Stripe | Braintree |
| Payment VN | VNPay, MoMo, ZaloPay | Payoo |
| Payment TQ | Alipay, WeChat Pay | — |
| Video conf (fallback) | LiveKit Cloud | Daily.co, Agora |
| TTS premium | ElevenLabs | Azure TTS, Play.ht |
| STT fallback | Deepgram, Azure Speech | — |
| LLM | Anthropic Claude, OpenAI | Gemini, self-host Llama 3 |
| Image gen (cho avatar cosmetic) | Stability AI / DALL-E | — |

## 8. Monorepo vs Polyrepo

**Phase 1 (team < 30)**: **Monorepo** với **Nx** hoặc **Turborepo**.

Cấu trúc:
```
/
├── apps/
│   ├── web/                     # Next.js
│   ├── mobile/                  # React Native
│   ├── admin/                   # Next.js admin
│   └── docs/                    # docs site
├── services/
│   ├── identity/                # Go
│   ├── learning/                # Go
│   ├── content/                 # TS
│   ├── srs/                     # Rust
│   └── …
├── packages/
│   ├── shared-types/
│   ├── ui/                      # React component lib
│   ├── proto/                   # .proto files
│   └── eslint-config/
├── infrastructure/
│   ├── terraform/
│   ├── helm/
│   └── docker/
└── tools/
    ├── scripts/
    └── codegen/
```

**Phase 2+ (team > 40, scale)**: có thể tách repo cho vài team có chu kỳ release khác biệt (ví dụ mobile app tách riêng vì có approval process).

## 9. Build & CI

- **CI**: GitHub Actions (hoặc GitLab CI). Matrix build theo service thay đổi (detect changed paths).
- **Container**: Docker buildx, multi-stage builds, distroless base image khi có thể.
- **Registry**: AWS ECR hoặc GitHub Container Registry.
- **Image signing**: cosign (supply chain).
- **SBOM**: syft generate khi build.

Chi tiết CI/CD ở [08-infrastructure-and-deployment.md](./08-infrastructure-and-deployment.md).

## 10. Versioning & release cadence

- Services: continuous delivery — merge to `main` → deploy to staging → (auto canary) → production. Mỗi service có thể deploy độc lập nhiều lần/ngày.
- Mobile app: 2-tuần/1 release (Apple/Google review).
- Breaking API change: giữ version cũ tối thiểu 2 release cycle.
