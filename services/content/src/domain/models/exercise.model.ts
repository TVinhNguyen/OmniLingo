import mongoose, { Schema, Document } from 'mongoose';

// ─── Exercise (polymorphic) ───────────────────────────────────────────────────

export type ExerciseType =
  | 'multiple_choice'
  | 'dictation'
  | 'speaking_prompt'
  | 'fill_in_blank'
  | 'sentence_arrange'
  | 'matching'
  | 'translation';

export type Skill = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';

export interface IExercise extends Document {
  id: string;
  type: ExerciseType;
  language: string;
  level: string;
  skill: Skill;

  // Prompt (shared)
  prompt: { text?: Record<string, string>; audioRef?: string };

  // multiple_choice, fill_in_blank, sentence_arrange
  choices?: string[];
  answer?: number | string | string[];

  // dictation
  referenceText?: string;
  lengthSeconds?: number;

  // speaking_prompt
  durationSeconds?: number;
  rubricCode?: string;

  // matching
  pairs?: Array<{ left: string; right: string }>;

  // explanation (shared)
  explanation: Record<string, string>;
  tags: string[];
  difficulty: number; // 0..1

  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    id:       { type: String, required: true, unique: true },
    type:     { type: String, required: true, index: true },
    language: { type: String, required: true, index: true },
    level:    { type: String, required: true },
    skill:    { type: String, required: true },

    prompt: {
      text:     { type: Schema.Types.Mixed },
      audioRef: { type: String },
    },

    choices:       { type: Schema.Types.Mixed },
    answer:        { type: Schema.Types.Mixed },
    referenceText: { type: String },
    lengthSeconds: { type: Number },
    durationSeconds:{ type: Number },
    rubricCode:    { type: String },
    pairs:         { type: Schema.Types.Mixed },

    explanation: { type: Schema.Types.Mixed, default: {} },
    tags:        { type: [String], default: [] },
    difficulty:  { type: Number, default: 0.5, min: 0, max: 1 },

    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true },
);

ExerciseSchema.index({ language: 1, skill: 1, level: 1 });
ExerciseSchema.index({ tags: 1 });

export const Exercise = mongoose.model<IExercise>('Exercise', ExerciseSchema);
