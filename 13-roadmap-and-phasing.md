# 13 — Roadmap & Phasing

Tài liệu cuối cùng trong bộ — trả lời câu hỏi "làm cái gì trước, làm cái gì sau". Nó gói các quyết định từ tài liệu 01-12 thành một kế hoạch triển khai theo phase, đi kèm team size, milestone, và risk.

## 1. Triết lý roadmap

### 1.1. Nguyên tắc

1. **Ship sớm, học sớm**: MVP phải ra thị trường trong 6 tháng. Không build hoàn hảo rồi ra mắt.
2. **Focus scope**: chọn 2 ngôn ngữ (EN + JP) thay vì 8. Chọn General + 1 Cert track thay vì all certs. "Do less, but do it well."
3. **Architecture debt < Product debt**: nếu phải trade-off, chấp nhận product chưa perfect hơn chấp nhận architecture kẹt. Architecture debt đắt gấp 10x sau 2 năm.
4. **Buy vs build**: MVP dùng managed service + SaaS tối đa (MongoDB Atlas, Stripe, Cloudflare, Azure OpenAI). Self-host khi rõ ràng tiết kiệm > 50% và có team đủ.
5. **Evidence-driven expansion**: thêm ngôn ngữ mới, cert mới khi có data chứng minh demand, không theo cảm tính.

### 1.2. Phase overview

| Phase | Thời gian | Tên | Mục tiêu |
|-------|-----------|-----|----------|
| **0** | T-3 → T0 | Setup | Team core, infra skeleton, prototype |
| **1** | T0 → T+6 | MVP | Ship EN + JP, 5k paying user |
| **1.5** | T+6 → T+12 | Proof | CN + KR, test prep, 25k paying |
| **2** | T+12 → T+24 | Scale | EU languages, tutor marketplace, 100k paying |
| **3** | T+24 → T+36 | Platform | B2B enterprise, international expand, 500k paying |
| **4** | T+36+ | Moat | AI differentiation, certification partnerships, acquisition |

## 2. Phase 0 — Foundation (3 tháng trước launch)

### 2.1. Mục tiêu

- Hire core team.
- Infra skeleton running.
- Prototype 1 lesson flow end-to-end.
- Content pipeline tool + 5 sample lessons.
- Branding + landing page + waitlist.

### 2.2. Team (hire 3 tháng đầu)

| Role | Count | Tại sao |
|------|-------|---------|
| Tech Lead / Architect | 1 | Thiết lập foundation, ra ADR |
| Senior Backend Eng | 3 | Core services: identity, content, learning |
| Senior Frontend Eng | 2 | Web + component library |
| Senior Mobile Eng (RN) | 2 | App shell, offline foundation |
| ML / AI Eng | 1 | AI tutor, pronunciation scoring |
| DevOps / SRE | 1 | EKS, CI/CD, observability skeleton |
| Product Manager | 1 | Roadmap, user research |
| Designer (Product + UX) | 1 | Design system, core flows |
| Content Lead | 1 | Pedagogy, curriculum framework |
| Content Editor (EN native) | 1 | Lesson author |
| Content Editor (JP native) | 1 | Lesson author |
| Linguist / SLA advisor | 0.5 (consultant) | Quality assurance pedagogy |

Total ~15 people tính cả part-time.

### 2.3. Infrastructure delivered

- AWS org + 4 account (dev/staging/prod/shared).
- 1 EKS cluster dev-sg, 1 staging-sg.
- Terraform monorepo + CI.
- GitHub Actions template.
- Argo CD skeleton.
- Observability baseline (Prometheus + Grafana + Loki).
- Linkerd mesh.
- Auth baseline (identity-service + Cognito pool hoặc self-host).

### 2.4. Content foundation

- Content CMS deployed (Strapi hoặc headless).
- 5 EN lessons (A1 đầu tiên) + 5 JP lessons (N5 đầu tiên) — proof pedagogy tool.
- Reviewer workflow tested.
- Audio recording studio setup, 2-3 voice talent đầu.

## 3. Phase 1 — MVP (Month 0-6)

### 3.1. Scope (ship)

**Languages**: English (A1-B2), Japanese (N5-N3).

**Core modules**:
- Onboarding + placement test.
- Daily lesson flow (vocabulary, grammar, listening, minor speaking, reading).
- SRS với FSRS (basic).
- Streak, XP, badge (basic 30 badge).
- Pronunciation scoring basic (Azure Pronunciation Assessment).
- AI tutor text chat (Claude) — 50 msg/day limit for paid.
- Progress dashboard.
- Subscription tier: Free + Plus + Pro.
- Payment: Stripe (international), VNPay + MoMo (VN), Apple IAP, Google IAP.
- Mobile (iOS + Android) + Web.

**Content volume**:
- EN: 100 lessons × 5 activities = 500 activities.
- JP: 80 lessons × 5 activities = 400 activities.
- ~2,000 flashcards per language (HF vocabulary).

**Not in MVP** (deliberate cut):
- Writing AI grading (defer Phase 1.5).
- Speaking AI tutor voice mode (defer).
- Tutor 1-1 marketplace (Phase 2).
- Live group class (Phase 2).
- Test prep track dedicated (Phase 1.5 with 1 cert).
- Social / leaderboard (Phase 1.5).
- Family plan (Phase 1.5).

### 3.2. Technical milestones

**Month 1-2**:
- [ ] identity-service + user-service production-ready.
- [ ] content-service + MongoDB layout.
- [ ] First lesson load < 2s p95.
- [ ] Placement test v1 (rule-based, upgrade CAT sau).

**Month 3**:
- [ ] SRS FSRS initial parameters, tune after 3 months data.
- [ ] Kafka + event pipeline producing learning events.
- [ ] ClickHouse analytics pipeline.
- [ ] Mobile app MVP screen complete.

**Month 4**:
- [ ] AI tutor integrated (llm-gateway + ai-tutor-service).
- [ ] Pronunciation scoring MVP (Azure API direct, wrap in speech-ai-service).
- [ ] Payment integration Stripe + VNPay + MoMo tested.
- [ ] Subscription lifecycle (trial, active, grace, cancel) production.

**Month 5**:
- [ ] Closed beta 500 user.
- [ ] Load test 2k concurrent user.
- [ ] Incident response drill.
- [ ] Content library complete (900 activities).

**Month 6**:
- [ ] Public launch VN + SEA.
- [ ] App Store + Play Store approval.
- [ ] Marketing campaign.
- [ ] Status page public.

### 3.3. Product milestones

- [ ] Onboarding complete rate > 70%.
- [ ] Day-1 retention > 45%.
- [ ] Day-7 retention > 25%.
- [ ] Free-to-paid conversion > 2% in first cohort.

### 3.4. Success criteria

- 50k signup (free), 5k paying.
- MRR $40k-60k.
- App store rating > 4.4.
- Zero Sev1 incident in last 2 weeks.

### 3.5. Risk + mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Content quality thấp | Churn ngay | Hire native editor early, SLA advisor review |
| AI cost burst | Budget hole | LLM cost budget alert, semantic cache, tier-gating |
| Payment integration VN chậm | Không có revenue | Start VNPay MoMo conversation Tháng 0, redundant providers |
| Mobile app reject App Store | Delay launch | Submit early beta, follow policy strict (especially IAP) |
| Team bandwidth | Delay | Cut scope (ok to defer tutor marketplace, writing AI) |

## 4. Phase 1.5 — Proof Expansion (Month 6-12)

### 4.1. Scope add

**Languages**:
- Chinese (HSK 1-4).
- Korean (TOPIK 1-3).

**New features**:
- Writing AI grading (writing-ai-service production, Claude-based).
- AI tutor voice mode (LiveKit + Whisper self-host + TTS tiered).
- Test prep track 1: **IELTS** (full mock test bank, predicted band).
- Family plan (launch).
- Social: leaderboard, friend system (opt-in), basic forum.
- Advanced analytics dashboard for user (weakness trend, projected score).

**Technical**:
- Self-host Whisper GPU (cost saving from Azure STT).
- Vector DB (Qdrant) deployed cho RAG AI tutor.
- Adaptive learning bandit v1 (contextual bandit).
- Multi-region setup foundation (1 secondary region warm).
- CMS v2 (custom, replace Strapi nếu needed).

### 4.2. Team growth

Double lên ~30 people:
- +1 Tech Lead (ML/Data).
- +3 Backend (for new services).
- +1 Frontend.
- +1 Mobile.
- +1 Native iOS (nếu move khỏi RN phần heavy như voice).
- +1 ML Eng.
- +1 SRE.
- +1 Security Eng.
- +1 PM.
- +1 Designer.
- +5 Content editors (2 CN, 2 KR, 1 IELTS cert author).
- +1 Customer Success.
- +1 Data Analyst.

### 4.3. Business milestones

- 250k signup, 25k paying.
- MRR $250k-400k.
- SOC 2 Type I ready.
- 2 B2B pilot (schools).

### 4.4. Decisions to make

- **React Native vs native**: ở Phase 1.5 đánh giá xem RN có đủ hay cần port voice feature native. Quyết định dựa data performance thật.
- **Self-host LLM**: evaluate khi chi phí LLM > $200k/tháng — tipping point self-host A100/H100 có ý nghĩa.
- **Partner vs build**: dataset IELTS đề thật — thương lượng với publisher hoặc build đề mock custom.

## 5. Phase 2 — Scale (Month 12-24)

### 5.1. Scope add

**Languages**:
- Spanish, French, German (A1-B1 each).
- Vietnamese cho ngoại (A1-B1).
- HSK 5-6, TOPIK 4-6, JLPT N2+N1.

**New features / products**:
- **Tutor marketplace 1-1**: booking, scheduling, Stripe Connect payout, rating review, dispute.
- **Live group classes**: LiveKit room, interactive lesson, attendance tracking.
- **Ultimate plan** launch (include tutor credit).
- **Marketplace content**: creator upload deck, course, revenue share 70/30.
- **Gift + Referral** program.
- **Certificate of Completion** issuance.
- **AI tutor** memory persistent (user-specific knowledge base).
- **Writing coaching** interactive (not just score, iterative improvement).
- **Speaking partner AI** (role-play scenarios).

**Test prep**:
- + TOEIC, TOEFL iBT.
- + JLPT N1, N2.
- + HSK 5+6.
- + TOPIK intermediate + advanced.

**Technical**:
- Multi-region active-active (US east + EU west).
- CDN edge compute (Cloudflare Workers) for dynamic content.
- Data lake + warehouse (Snowflake or self-host Iceberg).
- ML platform (Kubeflow or SageMaker) cho model training.
- Dedicated AI team with ML-Ops infra.
- Service mesh upgrade Istio nếu cần rich policy.

### 5.2. Team size ~70 people

Mature engineering org:
- 3 Tech Leads (Core / AI / Platform).
- 20 Backend Eng (domain teams).
- 10 Frontend + Mobile.
- 5 ML/Data Eng.
- 5 SRE + Platform.
- 3 Security.
- 2 QA Automation.
- 15-20 Content (across languages).
- 5 Product + Design.
- 5 Ops (CS, content ops, community).
- 5 Business + Growth.

### 5.3. Business milestones

- 1M signup, 100k paying.
- MRR $2M-3M.
- SOC 2 Type II + ISO 27001 certified.
- B2B: 20 schools + 5 enterprise.
- Marketplace GMV $500k/month.

### 5.4. Strategic bets

- **Partnership**: ETS (TOEFL), British Council (IELTS), Japan Foundation (JLPT) — official practice partner status.
- **M&A opportunity**: nhỏ acquisition content creator (tutor agency, niche language course).
- **Geographic**: JP market serious push (Japan user paying very well cho language learning).

## 6. Phase 3 — Platform (Month 24-36)

### 6.1. Scope add

**Languages**: Arabic, Thai, Indonesian, Russian, Portuguese (BR). Tổng ~15 languages.

**Products**:
- **OmniLingo for Schools** (B2B K-12): LMS integration (Canvas, Moodle), assignment tool, parent portal.
- **OmniLingo for Enterprise**: corporate dashboard, skills taxonomy, ROI report.
- **Developer platform**: public API + SDK cho third-party integrate (edtech, HR tool).
- **Immersive experiences**: VR/AR scene for language immersion (experimental).
- **Podcast + long-form content**: native-like content at higher levels.

**Technical**:
- Multi-region + multi-cloud (selective, AI workload on GCP).
- Service federation with acquired companies.
- Feature store + real-time ML serving.
- Edge inference for on-device personalization.

### 6.2. Team size ~200 people

Structure:
- Engineering 80 (domain teams).
- AI / ML 20.
- Platform / SRE 15.
- Security + Compliance 10.
- Product + Design 20.
- Content 30 (scale across 15 languages).
- Sales + B2B 15 (enterprise).
- Customer Success + Support 20.
- Operations + Finance + HR 20.

### 6.3. Business milestones

- 5M signup, 500k paying.
- ARR $60M+.
- B2B contribute 25-30% ARR.
- International ex-VN: 50%+ revenue.
- Net positive unit economics mature.

## 7. Phase 4 — Moat (Month 36+)

Focus từ "scale" sang "defensibility":

### 7.1. Moat vectors

- **AI**: proprietary models trained on years of user data — pronunciation, essay scoring outperform generic vendor.
- **Content library**: 20+ languages × full level range — không ai replicate trong < 3 năm.
- **Certification network**: official partnership với testing authorities — "prep trên OmniLingo giảm 20% phí thi" kind of deal.
- **Teacher marketplace**: network effect, top tutor stuck on platform.
- **Institutional**: trường/công ty lock in với LMS integration + multi-year contract.
- **Data flywheel**: adaptive learning improve mỗi tháng.

### 7.2. Opportunities

- **Acquisition** đối thủ nhỏ trong niche (specific language, specific cert prep).
- **Geographic M&A**: mua lại local champion VN/SEA để nhanh.
- **Adjacencies**: language → skills đào tạo (coding English cho dev, medical English cho bác sĩ).
- **Emerging**: agentic tutor that can teach literally anything (language is gateway).

## 8. Cross-cutting tracks (parallel all phases)

### 8.1. Trust & safety

- MVP: basic moderation + parental consent rule.
- Phase 1.5: formal content policy + appeal flow.
- Phase 2: trust center public page, bug bounty.
- Phase 3: child safety board, academic integrity advisory council.

### 8.2. Accessibility

- MVP: WCAG 2.1 AA web, iOS VoiceOver, Android TalkBack basics.
- Phase 1.5: full AA audit + remediation.
- Phase 2: sign language video support (experimental for deaf learners).
- Phase 3: alternative input (switch, eye gaze).

### 8.3. Research & academic

- Phase 2: first whitepaper (SLA research + platform data).
- Phase 3: research partnership university program (data sharing with IRB).
- Phase 4: OmniLingo Research Institute — annual conference, open datasets.

## 9. Key decisions timeline

| When | Decision |
|------|----------|
| Month 2 | Final mobile stack (RN vs native) |
| Month 4 | Keep Strapi CMS vs build custom |
| Month 6 | Self-host Whisper on-prem GPU vs keep API |
| Month 9 | Test prep content sourcing (partner vs in-house) |
| Month 12 | Multi-region expansion target (US or EU first) |
| Month 15 | Tutor marketplace commission model final |
| Month 18 | B2B sales motion (inbound-led vs outbound enterprise team) |
| Month 24 | Multi-cloud (selective) or stay AWS-primary |
| Month 30 | Potential M&A target evaluation |

## 10. Budget envelope (indicative)

| Phase | Monthly burn | Cumulative | Fundraising |
|-------|-------------|-----------|-------------|
| Phase 0 | $150k | $450k | Seed $2M |
| Phase 1 (MVP) | $300k | $2.5M | (within Seed) |
| Phase 1.5 | $600k | $6M | Series A $10-15M |
| Phase 2 | $1.5M | $24M | Series B $30-50M |
| Phase 3 | $4M | $72M | Series C $80-120M |

Revenue cover burn: aim for operating break-even Month 30-36, positive unit economics Month 18.

## 11. Exit / long-term optionality

Không cần quyết định sớm nhưng giữ option:
- **IPO path** (Duolingo precedent): thường Series D+, ARR > $150M.
- **Strategic acquirer**: edtech giant (Pearson, McGraw Hill), tech giant (Google, Microsoft cho Education portfolio).
- **Private equity** cho profitable growth trajectory.
- **Stay private**: nếu PMF + cash flow strong.

## 12. Checklist final trước mỗi phase gate

Trước khi tuyên bố "done Phase X", verify:

- [ ] All success criteria hit.
- [ ] No Sev1 incident last 4 weeks.
- [ ] SLO targets met current phase.
- [ ] Customer NPS tracked, trend positive.
- [ ] Team sustainable (< 5% attrition last quarter).
- [ ] Architecture principles still holding (xem [03](./03-high-level-architecture.md)).
- [ ] Tech debt backlog reviewed — no critical red.
- [ ] Next-phase design docs approved.
- [ ] Board / leadership sign-off.

---

**Kết thúc bộ tài liệu**. Đọc lại từ [README](./README.md) để tổng hợp hoặc đi sâu [03](./03-high-level-architecture.md) cho kiến trúc, [11](./11-learning-paths-and-curriculum.md) cho pedagogy.

Tài liệu này là **living document** — cập nhật mỗi quarter với learnings từ thực tế vận hành.
