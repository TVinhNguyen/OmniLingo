import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Grammar Point ────────────────────────────────────────────────────────────

export interface IGrammarPoint extends Document {
  _id: Types.ObjectId;
  language: string;             // 'ja' | 'zh' | 'ko' | 'en'
  level: string;                // 'N5'|'N4'|'N3'|'N2'|'N1' | 'A1'...'C2' | 'HSK1'...
  title: string;                // e.g. "〜たい (want to do)"
  slug: string;                 // URL-safe id e.g. "ja-tai-form-n4"
  explanation: string;          // Markdown explanation
  formation: string;            // Formation rule e.g. "Verb stem + たい"
  examples: Array<{
    sentence: string;
    translation: string;
    audio_url?: string;
  }>;
  related_points: Types.ObjectId[];
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

const GrammarPointSchema = new Schema<IGrammarPoint>(
  {
    language: { type: String, required: true, index: true },
    level:    { type: String, required: true, index: true },
    title:    { type: String, required: true },
    slug:     { type: String, required: true, unique: true },
    explanation: { type: String, required: true },
    formation:   { type: String, required: true },
    examples: [
      {
        sentence:    { type: String, required: true },
        translation: { type: String, required: true },
        audio_url:   { type: String },
      },
    ],
    related_points: [{ type: Schema.Types.ObjectId, ref: 'GrammarPoint' }],
    tags: [{ type: String }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

GrammarPointSchema.index({ language: 1, level: 1 });
// Note: text index omitted to avoid language field conflicts in multi-language content
// Use $text search on specific fields instead if needed

export const GrammarPoint = mongoose.model<IGrammarPoint>('GrammarPoint', GrammarPointSchema);

// ─── Drill Template ───────────────────────────────────────────────────────────

export interface ISlotPool {
  pool: string;           // named pool id, e.g. "pronouns_ja"
  items?: string[];       // or inline items
}

export interface IDrillTemplate extends Document {
  _id: Types.ObjectId;
  grammar_point_id: Types.ObjectId;
  language: string;
  drill_type: 'fill_blank' | 'conjugation' | 'multiple_choice' | 'translation';
  template: string;       // e.g. "{subject}は{verb-tai}。"
  slots: Record<string, ISlotPool>;
  answer_key: string;     // Description of correct answer logic
  difficulty: number;     // 1–5
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

const DrillTemplateSchema = new Schema<IDrillTemplate>(
  {
    grammar_point_id: { type: Schema.Types.ObjectId, ref: 'GrammarPoint', required: true, index: true },
    language:   { type: String, required: true, index: true },
    drill_type: { type: String, required: true, enum: ['fill_blank', 'conjugation', 'multiple_choice', 'translation'] },
    template:   { type: String, required: true },
    slots:      { type: Schema.Types.Mixed, default: {} },
    answer_key: { type: String, required: true },
    difficulty: { type: Number, default: 3, min: 1, max: 5 },
    tags:       [{ type: String }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

export const DrillTemplate = mongoose.model<IDrillTemplate>('DrillTemplate', DrillTemplateSchema);

// ─── Vocabulary Slot Pools ─────────────────────────────────────────────────────

export interface ISlotPoolDoc extends Document {
  _id: Types.ObjectId;
  pool_id: string;         // e.g. "pronouns_ja"
  language: string;
  items: string[];
  created_at: Date;
}

const SlotPoolSchema = new Schema<ISlotPoolDoc>(
  {
    pool_id:  { type: String, required: true, unique: true },
    language: { type: String, required: true, index: true },
    items:    [{ type: String }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

export const SlotPool = mongoose.model<ISlotPoolDoc>('SlotPool', SlotPoolSchema);
