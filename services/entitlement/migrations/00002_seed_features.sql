-- +goose Up
-- +goose StatementBegin

-- Seed the canonical feature → plan mapping from the product spec (10-subscription-and-monetization.md).
-- Quota -1 = unlimited. Quota 0 = not available.
INSERT INTO plan_features (feature_code, description, min_tier, quota_map) VALUES

-- ─── Lessons ──────────────────────────────────────────────────────────────────
('lessons_per_day',       'Max lessons per day',
 'free',     '{"free":5,"plus":-1,"pro":-1,"ultimate":-1,"family":-1}'),

-- ─── SRS Flashcards ───────────────────────────────────────────────────────────
('srs_cards_limit',       'Max SRS flashcards in library',
 'free',     '{"free":500,"plus":-1,"pro":-1,"ultimate":-1,"family":-1}'),

-- ─── Pronunciation ────────────────────────────────────────────────────────────
('pronunciation_scoring',  'Pronunciation scoring sessions per day',
 'free',     '{"free":5,"plus":-1,"pro":-1,"ultimate":-1,"family":-1}'),
('pronunciation_advanced', 'Advanced pronunciation model (Azure/custom)',
 'pro',      '{"free":0,"plus":0,"pro":-1,"ultimate":-1,"family":-1}'),

-- ─── AI Chat Tutor ────────────────────────────────────────────────────────────
('ai_chat_tutor',          'AI chat tutor messages per day',
 'free',     '{"free":10,"plus":50,"pro":-1,"ultimate":-1,"family":-1}'),
('ai_voice_tutor',         'AI voice tutor (real-time voice call)',
 'ultimate', '{"free":0,"plus":0,"pro":0,"ultimate":-1,"family":0}'),

-- ─── AI Writing Grader ────────────────────────────────────────────────────────
('ai_writing_grading',     'AI writing grading submissions per week',
 'free',     '{"free":1,"plus":3,"pro":-1,"ultimate":-1,"family":-1}'),

-- ─── Mock Tests ───────────────────────────────────────────────────────────────
('mock_test',              'Certification mock tests per month',
 'free',     '{"free":1,"plus":3,"pro":-1,"ultimate":-1,"family":-1}'),
('mock_test_proctored',    'Proctored mock test (webcam)',
 'ultimate', '{"free":0,"plus":0,"pro":0,"ultimate":-1,"family":0}'),

-- ─── Offline Mode ─────────────────────────────────────────────────────────────
('offline_mode',           'Download lessons for offline use',
 'plus',     '{"free":0,"plus":1,"pro":1,"ultimate":1,"family":1}'),

-- ─── Ads ──────────────────────────────────────────────────────────────────────
('ads_free',               'Ad-free experience',
 'plus',     '{"free":0,"plus":1,"pro":1,"ultimate":1,"family":1}'),

-- ─── Live Classes ─────────────────────────────────────────────────────────────
('live_group_class',       'Live group class sessions per month',
 'pro',      '{"free":0,"plus":0,"pro":2,"ultimate":-1,"family":2}'),

-- ─── Tutor Credits ────────────────────────────────────────────────────────────
('tutor_credit',           'Monthly 1-1 tutor credits',
 'ultimate', '{"free":0,"plus":0,"pro":0,"ultimate":60,"family":0}'),

-- ─── Analytics ────────────────────────────────────────────────────────────────
('analytics_advanced',     'Full advanced analytics dashboard',
 'plus',     '{"free":0,"plus":1,"pro":1,"ultimate":1,"family":1}'),

-- ─── Multi-language ───────────────────────────────────────────────────────────
('multi_language',         'Study multiple languages simultaneously',
 'pro',      '{"free":0,"plus":0,"pro":1,"ultimate":1,"family":1}'),

-- ─── Family ───────────────────────────────────────────────────────────────────
('family_seat',            'Extra family member seats',
 'family',   '{"free":0,"plus":0,"pro":0,"ultimate":0,"family":6}'),

-- ─── Priority Support ─────────────────────────────────────────────────────────
('priority_support_email', 'Email priority support',
 'pro',      '{"free":0,"plus":0,"pro":1,"ultimate":1,"family":1}'),
('priority_support_chat',  'Live chat priority support',
 'ultimate', '{"free":0,"plus":0,"pro":0,"ultimate":1,"family":0}')

ON CONFLICT (feature_code) DO NOTHING;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM plan_features;
-- +goose StatementEnd
