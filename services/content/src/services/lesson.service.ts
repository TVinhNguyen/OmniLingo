import { randomUUID } from 'crypto';
import { Lesson, type ILesson } from '../domain/models/lesson.model';
import { Unit } from '../domain/models/content.model';
import { Errors } from '../domain/errors';
import type { CacheService } from './cache.service';
import type { KafkaService } from './kafka.service';
import type { Config } from '../config/index';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateLessonDto {
  language: string;
  track: string;
  level: string;
  unitId: string;
  title: Record<string, string>;
  objective?: Record<string, string>;
  estimatedMinutes?: number;
  blocks?: ILesson['blocks'];
  thumbnailUrl?: string;
}

export interface UpdateLessonDto {
  title?: Record<string, string>;
  objective?: Record<string, string>;
  estimatedMinutes?: number;
  blocks?: ILesson['blocks'];
  thumbnailUrl?: string;
}

// ─── Lesson Service ────────────────────────────────────────────────────────────

export class LessonService {
  constructor(
    private readonly cache: CacheService,
    private readonly kafka: KafkaService,
    private readonly cfg: Config,
  ) {}

  async getById(id: string, version?: number): Promise<ILesson> {
    const cacheKey = version
      ? this.cache.keys.lessonVersion(id, version)
      : this.cache.keys.lessonLatest(id);

    const cached = await this.cache.get<ILesson>(cacheKey);
    if (cached) return cached;

    const query = version
      ? { id, version, status: 'published' }
      : { id, status: 'published' };

    const lesson = await Lesson.findOne(query).lean();
    if (!lesson) throw Errors.notFound('Lesson', id);

    const ttl = version ? this.cfg.cacheTtl.lessonVersion : this.cfg.cacheTtl.lessons;
    await this.cache.set(cacheKey, lesson, ttl);

    return lesson as unknown as ILesson;
  }

  async getByUnit(unitId: string): Promise<ILesson[]> {
    const lessons = await Lesson.find({ unitId, status: 'published' })
      .sort({ id: 1 })
      .lean();
    return lessons as unknown as ILesson[];
  }

  async create(dto: CreateLessonDto, createdBy: string): Promise<ILesson> {
    const id = `lesson_${dto.language}_${dto.level}_${Date.now()}`;
    const lesson = await Lesson.create({
      id,
      version: 1,
      ...dto,
      objective: dto.objective ?? {},
      estimatedMinutes: dto.estimatedMinutes ?? 10,
      blocks: dto.blocks ?? [],
      status: 'draft',
      createdBy,
      updatedBy: createdBy,
    });
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto, updatedBy: string): Promise<ILesson> {
    const lesson = await Lesson.findOne({ id });
    if (!lesson) throw Errors.notFound('Lesson', id);
    if (lesson.status === 'published') throw Errors.cannotEditPublished(id);

    const updates: Partial<ILesson> = { ...dto, updatedBy };
    Object.assign(lesson, updates);
    await lesson.save();
    return lesson;
  }

  async publish(id: string, publishedBy: string): Promise<ILesson> {
    const lesson = await Lesson.findOne({ id });
    if (!lesson) throw Errors.notFound('Lesson', id);
    if (lesson.status === 'published') throw Errors.alreadyPublished(id);

    lesson.status = 'published';
    lesson.publishedAt = new Date();
    lesson.updatedBy = publishedBy;
    await lesson.save();

    // Invalidate latest cache
    await this.cache.del(this.cache.keys.lessonLatest(id));

    // Add to unit's lessonIds if not already there
    await Unit.updateOne(
      { id: lesson.unitId },
      { $addToSet: { lessonIds: id } },
    );

    // Emit Kafka event
    await this.kafka.publish('content.lesson.published', {
      eventId: randomUUID(),
      lessonId: id,
      version: lesson.version,
      language: lesson.language,
      level: lesson.level,
      unitId: lesson.unitId,
      publishedBy,
      publishedAt: lesson.publishedAt.toISOString(),
    });

    return lesson;
  }

  async archive(id: string, archivedBy: string): Promise<void> {
    const lesson = await Lesson.findOne({ id });
    if (!lesson) throw Errors.notFound('Lesson', id);

    lesson.status = 'archived';
    lesson.updatedBy = archivedBy;
    await lesson.save();

    // Purge cache
    await this.cache.del(
      this.cache.keys.lessonLatest(id),
      this.cache.keys.lessonVersion(id, lesson.version),
    );

    await this.kafka.publish('content.lesson.archived', {
      eventId: randomUUID(),
      lessonId: id,
      archivedBy,
      archivedAt: new Date().toISOString(),
    });
  }
}
