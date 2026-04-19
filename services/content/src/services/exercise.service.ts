import { Exercise, type IExercise } from '../domain/models/exercise.model';
import { Errors } from '../domain/errors';
import type { CacheService } from './cache.service';
import type { Config } from '../config/index';

export interface CreateExerciseDto {
  type: IExercise['type'];
  language: string;
  level: string;
  skill: IExercise['skill'];
  prompt?: IExercise['prompt'];
  choices?: IExercise['choices'];
  answer?: IExercise['answer'];
  referenceText?: string;
  lengthSeconds?: number;
  durationSeconds?: number;
  rubricCode?: string;
  pairs?: IExercise['pairs'];
  explanation?: Record<string, string>;
  tags?: string[];
  difficulty?: number;
}

export class ExerciseService {
  constructor(
    private readonly cache: CacheService,
    private readonly cfg: Config,
  ) {}

  async getById(id: string): Promise<IExercise> {
    const cacheKey = this.cache.keys.exercise(id);
    const cached = await this.cache.get<IExercise>(cacheKey);
    if (cached) return cached;

    const exercise = await Exercise.findOne({ id }).lean();
    if (!exercise) throw Errors.notFound('Exercise', id);

    await this.cache.set(cacheKey, exercise, this.cfg.cacheTtl.exercises);
    return exercise as unknown as IExercise;
  }

  async getBatch(ids: string[]): Promise<IExercise[]> {
    if (ids.length === 0) return [];

    // Try cache for each
    const results: IExercise[] = [];
    const missingIds: string[] = [];

    await Promise.all(
      ids.map(async (id) => {
        const cached = await this.cache.get<IExercise>(this.cache.keys.exercise(id));
        if (cached) results.push(cached);
        else missingIds.push(id);
      }),
    );

    if (missingIds.length > 0) {
      const fromDb = await Exercise.find({ id: { $in: missingIds } }).lean();
      for (const ex of fromDb) {
        const exercise = ex as unknown as IExercise;
        await this.cache.set(
          this.cache.keys.exercise(exercise.id),
          exercise,
          this.cfg.cacheTtl.exercises,
        );
        results.push(exercise);
      }
    }

    // Return in original order
    const idxMap = Object.fromEntries(ids.map((id, i) => [id, i]));
    return results.sort((a, b) => (idxMap[a.id] ?? 0) - (idxMap[b.id] ?? 0));
  }

  async create(dto: CreateExerciseDto, createdBy: string): Promise<IExercise> {
    const id = `ex_${dto.language}_${dto.type}_${Date.now()}`;
    const exercise = await Exercise.create({
      id,
      ...dto,
      prompt: dto.prompt ?? {},
      explanation: dto.explanation ?? {},
      tags: dto.tags ?? [],
      difficulty: dto.difficulty ?? 0.5,
      createdBy,
      updatedBy: createdBy,
    });
    return exercise;
  }

  async update(id: string, dto: Partial<CreateExerciseDto>, updatedBy: string): Promise<IExercise> {
    const exercise = await Exercise.findOne({ id });
    if (!exercise) throw Errors.notFound('Exercise', id);

    Object.assign(exercise, { ...dto, updatedBy });
    await exercise.save();

    // Invalidate cache
    await this.cache.del(this.cache.keys.exercise(id));
    return exercise;
  }

  async list(filter: { language?: string; skill?: string; level?: string; tags?: string[]; limit?: number }): Promise<IExercise[]> {
    const query: Record<string, unknown> = {};
    if (filter.language) query['language'] = filter.language;
    if (filter.skill) query['skill'] = filter.skill;
    if (filter.level) query['level'] = filter.level;
    if (filter.tags?.length) query['tags'] = { $in: filter.tags };

    return Exercise.find(query)
      .limit(filter.limit ?? 50)
      .lean() as unknown as IExercise[];
  }
}
