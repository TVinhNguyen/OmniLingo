import type Redis from 'ioredis';
import { GrammarPoint, DrillTemplate, SlotPool, type IGrammarPoint, type IDrillTemplate } from '../domain/models.js';
import { Errors } from '../domain/errors.js';

const CACHE_TTL = 3600;

// ─── Grammar Point Repository ─────────────────────────────────────────────────

export class GrammarPointRepository {
  constructor(private redis: Redis | null) {}

  private cacheKey(id: string): string {
    return `grammar:point:${id}`;
  }

  async findById(id: string): Promise<IGrammarPoint> {
    const cacheKey = this.cacheKey(id);

    if (this.redis) {
      const cached = await this.redis.get(cacheKey).catch(() => null);
      if (cached) return JSON.parse(cached) as IGrammarPoint;
    }

    const point = await GrammarPoint.findById(id).populate('related_points', 'title slug level');
    if (!point) throw Errors.NotFound('GrammarPoint');

    if (this.redis) {
      await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(point)).catch(() => null);
    }
    return point;
  }

  async findBySlug(slug: string): Promise<IGrammarPoint> {
    const point = await GrammarPoint.findOne({ slug }).populate('related_points', 'title slug level');
    if (!point) throw Errors.NotFound('GrammarPoint');
    return point;
  }

  async list(filter: {
    language?: string;
    level?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ points: IGrammarPoint[]; total: number }> {
    const { language, level, tag, search, page = 1, limit = 20 } = filter;
    const query: Record<string, unknown> = {};
    if (language) query.language = language;
    if (level) query.level = level;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const [points, total] = await Promise.all([
      GrammarPoint.find(query)
        .select('language level title slug formation tags created_at')
        .sort({ level: 1, title: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      GrammarPoint.countDocuments(query),
    ]);
    return { points: points as unknown as IGrammarPoint[], total };
  }

  async create(data: Omit<IGrammarPoint, '_id' | 'created_at' | 'updated_at'>): Promise<IGrammarPoint> {
    const point = new GrammarPoint(data);
    await point.save();
    return point;
  }

  async update(id: string, data: Partial<IGrammarPoint>): Promise<IGrammarPoint> {
    const point = await GrammarPoint.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!point) throw Errors.NotFound('GrammarPoint');
    if (this.redis) {
      await this.redis.del(this.cacheKey(id)).catch(() => null);
    }
    return point;
  }

  async delete(id: string): Promise<void> {
    const result = await GrammarPoint.findByIdAndDelete(id);
    if (!result) throw Errors.NotFound('GrammarPoint');
    if (this.redis) {
      await this.redis.del(this.cacheKey(id)).catch(() => null);
    }
  }
}

// ─── Drill Template Repository ────────────────────────────────────────────────

export class DrillTemplateRepository {
  async findByGrammarPoint(grammarPointId: string): Promise<IDrillTemplate[]> {
    return DrillTemplate.find({ grammar_point_id: grammarPointId }).lean() as unknown as IDrillTemplate[];
  }

  async findById(id: string): Promise<IDrillTemplate> {
    const drill = await DrillTemplate.findById(id).lean();
    if (!drill) throw Errors.NotFound('DrillTemplate');
    return drill as unknown as IDrillTemplate;
  }

  async create(data: Omit<IDrillTemplate, '_id' | 'created_at' | 'updated_at'>): Promise<IDrillTemplate> {
    const drill = new DrillTemplate(data);
    await drill.save();
    return drill;
  }

  async listByLanguage(language: string, limit = 50): Promise<IDrillTemplate[]> {
    return DrillTemplate.find({ language }).limit(limit).lean() as unknown as IDrillTemplate[];
  }
}

// ─── Slot Pool Repository ─────────────────────────────────────────────────────

export class SlotPoolRepository {
  async getPool(poolId: string): Promise<string[]> {
    const pool = await SlotPool.findOne({ pool_id: poolId }).lean();
    if (!pool) throw Errors.NotFound(`SlotPool '${poolId}'`);
    return pool.items;
  }

  async upsertPool(poolId: string, language: string, items: string[]): Promise<void> {
    await SlotPool.findOneAndUpdate(
      { pool_id: poolId },
      { $set: { language, items } },
      { upsert: true, runValidators: true },
    );
  }
}
