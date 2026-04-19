import { GrammarPointRepository, DrillTemplateRepository, SlotPoolRepository } from '../repository/grammar.repository.js';
import type { IGrammarPoint, IDrillTemplate } from '../domain/models.js';
import { Errors } from '../domain/errors.js';
import { config } from '../config.js';
import type { GrammarProducer } from '../messaging/producer.js';

// ─── Grammar Point Service ────────────────────────────────────────────────────

export class GrammarService {
  constructor(
    private pointRepo: GrammarPointRepository,
    private drillRepo: DrillTemplateRepository,
    private poolRepo: SlotPoolRepository,
    private producer?: GrammarProducer,
  ) {}

  async listPoints(filter: {
    language?: string;
    level?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ points: IGrammarPoint[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(100, filter.limit ?? 20);
    const { points, total } = await this.pointRepo.list({ ...filter, page, limit });
    return { points, total, page, limit };
  }

  async getPoint(idOrSlug: string): Promise<IGrammarPoint> {
    // Try ObjectId first, fall back to slug
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      return this.pointRepo.findById(idOrSlug);
    }
    return this.pointRepo.findBySlug(idOrSlug);
  }

  async createPoint(data: Partial<IGrammarPoint>): Promise<IGrammarPoint> {
    if (!data.language || !data.level || !data.title || !data.slug) {
      throw Errors.InvalidInput('language, level, title, slug are required');
    }
    if (!data.explanation || !data.formation) {
      throw Errors.InvalidInput('explanation and formation are required');
    }
    const point = await this.pointRepo.create(data as Omit<IGrammarPoint, '_id' | 'created_at' | 'updated_at'>);
    // Publish Kafka event (non-blocking — failure should not fail the API)
    void this.producer?.publishCreated(point).catch(() => undefined);
    return point;
  }

  async updatePoint(id: string, data: Partial<IGrammarPoint>): Promise<IGrammarPoint> {
    const point = await this.pointRepo.update(id, data);
    void this.producer?.publishUpdated(point).catch(() => undefined);
    return point;
  }

  async deletePoint(id: string): Promise<void> {
    return this.pointRepo.delete(id);
  }

  // ─── Drill Engine ──────────────────────────────────────────────────────────

  async getDrillTemplates(grammarPointId: string): Promise<IDrillTemplate[]> {
    return this.drillRepo.findByGrammarPoint(grammarPointId);
  }

  /**
   * Generate N drill questions from a given grammar point's templates.
   * Slots are filled from named pools or inline lists.
   */
  async generateDrills(
    grammarPointId: string,
    count: number = config.drillMaxGenerate,
  ): Promise<GeneratedDrill[]> {
    const templates = await this.drillRepo.findByGrammarPoint(grammarPointId);
    if (templates.length === 0) {
      throw Errors.NotFound('DrillTemplates for this grammar point');
    }

    const maxCount = Math.min(count, config.drillMaxGenerate);
    const results: GeneratedDrill[] = [];

    for (let i = 0; i < maxCount; i++) {
      const tmpl = templates[i % templates.length];
      const question = await this.fillTemplate(tmpl);
      results.push({
        drill_id: tmpl._id.toString(),
        drill_type: tmpl.drill_type,
        question,
        answer_key: tmpl.answer_key,
        difficulty: tmpl.difficulty,
        template_raw: tmpl.template,
        grammar_point_id: grammarPointId,
      });
    }

    return results;
  }

  private async fillTemplate(tmpl: IDrillTemplate): Promise<string> {
    let question = tmpl.template;
    const slotPattern = /\{([^}]+)\}/g;
    const slots = [...question.matchAll(slotPattern)].map(m => m[1]);

    for (const slotName of slots) {
      const slotDef = tmpl.slots[slotName];
      if (!slotDef) continue;

      // Get items from pool or inline list
      let items: string[] = slotDef.items ?? [];
      if (slotDef.pool && items.length === 0) {
        try {
          items = await this.poolRepo.getPool(slotDef.pool);
        } catch {
          items = [slotDef.pool]; // fallback
        }
      }

      if (items.length > 0) {
        const chosen = items[Math.floor(Math.random() * items.length)];
        question = question.replace(`{${slotName}}`, chosen);
      }
    }

    return question;
  }

  async createDrillTemplate(
    data: Partial<IDrillTemplate>,
  ): Promise<IDrillTemplate> {
    if (!data.grammar_point_id || !data.template || !data.answer_key) {
      throw Errors.InvalidInput('grammar_point_id, template, answer_key are required');
    }
    return this.drillRepo.create(data as Omit<IDrillTemplate, '_id' | 'created_at' | 'updated_at'>);
  }
}

export interface GeneratedDrill {
  drill_id: string;
  drill_type: string;
  question: string;
  answer_key: string;
  difficulty: number;
  template_raw: string;
  grammar_point_id: string;
}
