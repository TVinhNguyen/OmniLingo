import type { FastifyInstance } from 'fastify';
import { Language, Track, Course, Unit } from '../../domain/models/content.model';
import { Lesson } from '../../domain/models/lesson.model';
import { Exercise } from '../../domain/models/exercise.model';

/**
 * Dev-only seed endpoint: POST /admin/seed
 * Seeds minimal sample data for local development and testing.
 * Disabled in production (guarded by NODE_ENV check).
 */
export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  if (fastify.config.env === 'production') return;

  fastify.post('/seed', {
    config: { disableRequestLogging: false },
    schema: { body: { type: ['object', 'null'], nullable: true } },
  }, async (_req, reply) => {
    // Languages
    await Language.deleteMany({});
    await Language.insertMany([
      { code: 'en', name: { en: 'English', vi: 'Tiếng Anh', ja: '英語' }, flagEmoji: '🇬🇧', isActive: true },
      { code: 'ja', name: { en: 'Japanese', vi: 'Tiếng Nhật', ja: '日本語' }, flagEmoji: '🇯🇵', isActive: true },
      { code: 'zh', name: { en: 'Chinese', vi: 'Tiếng Trung', ja: '中国語' }, flagEmoji: '🇨🇳', isActive: true },
      { code: 'ko', name: { en: 'Korean', vi: 'Tiếng Hàn', ja: '韓国語' }, flagEmoji: '🇰🇷', isActive: true },
      { code: 'vi', name: { en: 'Vietnamese', vi: 'Tiếng Việt', ja: 'ベトナム語' }, flagEmoji: '🇻🇳', isActive: true },
    ]);

    // Tracks
    await Track.deleteMany({});
    await Track.insertMany([
      { id: 'track_ja_general', language: 'ja', type: 'general', name: { en: 'Japanese General', vi: 'Tiếng Nhật Tổng Quát' }, levelRange: ['N5','N4','N3','N2','N1'], order: 0, isActive: true },
      { id: 'track_ja_jlpt',    language: 'ja', type: 'test_prep', cert: 'jlpt', name: { en: 'JLPT Preparation', vi: 'Luyện Thi JLPT' }, levelRange: ['N5','N4','N3','N2','N1'], order: 1, isActive: true },
      { id: 'track_en_general', language: 'en', type: 'general', name: { en: 'English General', vi: 'Tiếng Anh Tổng Quát' }, levelRange: ['A1','A2','B1','B2','C1','C2'], order: 0, isActive: true },
      { id: 'track_en_ielts',   language: 'en', type: 'test_prep', cert: 'ielts', name: { en: 'IELTS Preparation', vi: 'Luyện Thi IELTS' }, levelRange: ['B1','B2','C1'], order: 1, isActive: true },
    ]);

    // Course
    await Course.deleteMany({});
    await Course.insertMany([
      {
        id: 'course_ja_n5_01',
        trackId: 'track_ja_general',
        language: 'ja',
        level: 'N5',
        title: { en: 'Japanese for Beginners (N5)', vi: 'Tiếng Nhật cho Người Mới (N5)' },
        description: { en: 'Start your Japanese journey from zero', vi: 'Bắt đầu hành trình tiếng Nhật từ con số 0' },
        order: 0,
        unitIds: ['unit_ja_n5_01'],
        status: 'published',
        publishedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      },
    ]);

    // Unit
    await Unit.deleteMany({});
    await Unit.insertMany([
      {
        id: 'unit_ja_n5_01',
        courseId: 'course_ja_n5_01',
        title: { en: 'Unit 1: Greetings & Introductions', vi: 'Unit 1: Chào Hỏi & Giới Thiệu' },
        order: 0,
        lessonIds: ['lesson_ja_n5_greetings_01'],
        createdBy: 'system',
        updatedBy: 'system',
      },
    ]);

    // Exercise
    await Exercise.deleteMany({});
    await Exercise.insertMany([
      {
        id: 'ex_ja_mc_001',
        type: 'multiple_choice',
        language: 'ja',
        level: 'N5',
        skill: 'vocabulary',
        prompt: { text: { en: 'What does おはようございます mean?', vi: 'おはようございます có nghĩa là gì?' } },
        choices: ['Good morning', 'Good afternoon', 'Good evening', 'Goodbye'],
        answer: 0,
        explanation: { en: 'おはようございます is a formal morning greeting', vi: 'Đây là lời chào buổi sáng trang trọng' },
        tags: ['greetings', 'formal', 'N5'],
        difficulty: 0.1,
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        id: 'ex_ja_dict_001',
        type: 'dictation',
        language: 'ja',
        level: 'N5',
        skill: 'listening',
        prompt: { audioRef: 's3://media/exercises/ja/greet_001.mp3' },
        referenceText: 'おはようございます',
        lengthSeconds: 2.5,
        explanation: { en: 'Listen and type what you hear', vi: 'Nghe và gõ lại những gì bạn nghe' },
        tags: ['greetings', 'N5'],
        difficulty: 0.15,
        createdBy: 'system',
        updatedBy: 'system',
      },
    ]);

    // Lesson — published
    await Lesson.deleteMany({});
    await Lesson.insertMany([
      {
        id: 'lesson_ja_n5_greetings_01',
        version: 1,
        language: 'ja',
        track: 'general',
        level: 'N5',
        unitId: 'unit_ja_n5_01',
        title: { en: 'Greetings', vi: 'Chào Hỏi', ja: 'あいさつ' },
        objective: { en: 'Learn basic Japanese greetings', vi: 'Học các câu chào hỏi cơ bản trong tiếng Nhật' },
        estimatedMinutes: 12,
        blocks: [
          { type: 'explanation', content: { en: 'In Japan, greetings are an important part of daily life...', vi: 'Ở Nhật Bản, lời chào hỏi là một phần quan trọng trong cuộc sống hàng ngày...' } },
          { type: 'vocab_intro', words: ['word_ohayou', 'word_konnichiwa', 'word_konbanwa'] },
          { type: 'exercise', exerciseId: 'ex_ja_mc_001' },
          { type: 'dictation', audioRef: 's3://media/lessons/ja/greet01.mp3', sentences: [{ text: 'おはようございます', startMs: 300, endMs: 2800 }] },
        ],
        status: 'published',
        publishedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      },
    ]);

    // Flush all content cache keys so stale empty-list caches are invalidated
    try {
      const keys = await fastify.redis.keys('content:*');
      if (keys.length > 0) await fastify.redis.del(...keys);
    } catch { /* Redis unavailable — ignore */ }

    return reply.send({
      message: '✅ Seed data inserted',
      counts: {
        languages: 5,
        tracks: 4,
        courses: 1,
        units: 1,
        lessons: 1,
        exercises: 2,
      },
    });
  });
}
