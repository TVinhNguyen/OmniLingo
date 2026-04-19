import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GrammarService } from '../service/grammar.service';
import type { IDrillTemplate } from '../domain/models';
import type { Types } from 'mongoose';

// ─── Mock helpers ─────────────────────────────────────────────────────────────

function makeId(str: string) {
  return { toString: () => str, toHexString: () => str } as unknown as Types.ObjectId;
}

function makeDrillTemplate(overrides: Partial<IDrillTemplate> = {}): IDrillTemplate {
  return {
    _id: makeId('drill001'),
    grammar_point_id: makeId('point001'),
    language: 'ja',
    drill_type: 'fill_blank',
    template: '{subject}は{verb}たい。',
    slots: {
      subject: { pool: 'pronouns_ja', items: ['私', 'あなた', '彼女'] },
      verb:    { items: ['食べ', '飲み', '行き'] },
    },
    answer_key: 'Conjugate to -tai form',
    difficulty:  2,
    tags:        ['N5', 'tai-form'],
    created_at:  new Date(),
    updated_at:  new Date(),
    ...overrides,
  } as IDrillTemplate;
}

// Repositories typed as any so jest.fn() works without strict generics
/* eslint-disable @typescript-eslint/no-explicit-any */
const pointRepo: any = {
  list:       jest.fn(),
  findById:   jest.fn(),
  findBySlug: jest.fn(),
  create:     jest.fn(),
  update:     jest.fn(),
  delete:     jest.fn(),
};
const drillRepo: any = {
  findByGrammarPoint: jest.fn(),
  findById:           jest.fn(),
  create:             jest.fn(),
  listByLanguage:     jest.fn(),
};
const poolRepo: any = {
  getPool:    jest.fn(),
  upsertPool: jest.fn(),
};
/* eslint-enable */

describe('GrammarService', () => {
  let svc: GrammarService;

  beforeEach(() => {
    jest.clearAllMocks();
    svc = new GrammarService(pointRepo, drillRepo, poolRepo);
  });

  // ─── listPoints ─────────────────────────────────────────────────────────

  describe('listPoints', () => {
    it('returns points with pagination metadata', async () => {
      pointRepo.list.mockResolvedValue({ points: [{ title: 'Test' }], total: 1 });
      const result = await svc.listPoints({ language: 'ja', page: 1, limit: 10 });
      expect(result.points).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('clamps limit to 100', async () => {
      pointRepo.list.mockResolvedValue({ points: [], total: 0 });
      await svc.listPoints({ limit: 9999 });
      expect(pointRepo.list).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

    it('defaults page to 1 and limit to 20', async () => {
      pointRepo.list.mockResolvedValue({ points: [], total: 0 });
      await svc.listPoints({});
      expect(pointRepo.list).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 20 }));
    });
  });

  // ─── getPoint ────────────────────────────────────────────────────────────

  describe('getPoint', () => {
    it('routes a 24-char hex id to findById', async () => {
      pointRepo.findById.mockResolvedValue({ title: 'Point A' });
      await svc.getPoint('507f1f77bcf86cd799439011');
      expect(pointRepo.findById).toHaveBeenCalled();
      expect(pointRepo.findBySlug).not.toHaveBeenCalled();
    });

    it('routes a slug to findBySlug', async () => {
      pointRepo.findBySlug.mockResolvedValue({ title: 'Point B' });
      await svc.getPoint('ja-tai-form-n4');
      expect(pointRepo.findBySlug).toHaveBeenCalledWith('ja-tai-form-n4');
    });
  });

  // ─── createPoint ─────────────────────────────────────────────────────────

  describe('createPoint', () => {
    const valid = {
      language: 'ja', level: 'N5', title: '〜たい', slug: 'ja-tai-n5',
      explanation: 'Want to do something', formation: 'Verb stem + たい',
    };

    it('creates a point from valid data', async () => {
      pointRepo.create.mockResolvedValue({ ...valid, _id: 'id1' });
      const result = await svc.createPoint(valid);
      expect(result).toMatchObject(valid);
    });

    it('throws on missing language', async () => {
      await expect(svc.createPoint({ level: 'N4', title: 'x', slug: 'x', explanation: 'x', formation: 'x' })).rejects.toThrow();
    });

    it('throws on missing explanation', async () => {
      await expect(svc.createPoint({ language: 'ja', level: 'N4', title: 'Test', slug: 'test' })).rejects.toThrow();
    });
  });

  // ─── generateDrills ──────────────────────────────────────────────────────

  describe('generateDrills', () => {
    it('fills slots with inline items', async () => {
      drillRepo.findByGrammarPoint.mockResolvedValue([makeDrillTemplate()]);
      const drills = await svc.generateDrills('point001', 3);
      expect(drills).toHaveLength(3);
      expect(drills[0].question).not.toContain('{subject}');
      expect(drills[0].question).not.toContain('{verb}');
      expect(drills[0].question).toContain('たい。');
    });

    it('resolves slots from named pool', async () => {
      const tmpl = makeDrillTemplate({
        template: '{pronoun}が行く。',
        slots: { pronoun: { pool: 'pronouns_ja' } },
      });
      drillRepo.findByGrammarPoint.mockResolvedValue([tmpl]);
      poolRepo.getPool.mockResolvedValue(['私', 'あなた']);
      const drills = await svc.generateDrills('point001', 2);
      expect(drills).toHaveLength(2);
      expect(poolRepo.getPool).toHaveBeenCalledWith('pronouns_ja');
      expect(drills[0].question).not.toContain('{pronoun}');
    });

    it('throws NOT_FOUND when no templates exist', async () => {
      drillRepo.findByGrammarPoint.mockResolvedValue([]);
      await expect(svc.generateDrills('point001')).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });

    it('respects DRILL_MAX_GENERATE cap', async () => {
      drillRepo.findByGrammarPoint.mockResolvedValue([makeDrillTemplate()]);
      const drills = await svc.generateDrills('point001', 100);
      expect(drills.length).toBeLessThanOrEqual(10);
    });

    it('returns correct metadata per drill', async () => {
      drillRepo.findByGrammarPoint.mockResolvedValue([makeDrillTemplate()]);
      const [drill] = await svc.generateDrills('point001', 1);
      expect(drill.drill_type).toBe('fill_blank');
      expect(drill.answer_key).toBe('Conjugate to -tai form');
      expect(drill.difficulty).toBe(2);
      expect(drill.grammar_point_id).toBe('point001');
    });
  });
});
