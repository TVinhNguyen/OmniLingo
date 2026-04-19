import mongoose, { Schema, Document } from 'mongoose';

// ─── Lesson Block ─────────────────────────────────────────────────────────────

export type LessonBlockType =
  | 'explanation'
  | 'vocab_intro'
  | 'exercise'
  | 'dictation'
  | 'video'
  | 'reading';

export interface LessonBlock {
  type: LessonBlockType;
  // explanation
  content?: Record<string, string>;
  // vocab_intro
  words?: string[];
  // exercise
  exerciseId?: string;
  // dictation
  audioRef?: string;
  sentences?: Array<{ text: string; startMs: number; endMs: number }>;
  // video
  videoRef?: string;
  transcript?: string;
  // reading
  passageRef?: string;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export interface ILesson extends Document {
  id: string;
  version: number;
  language: string;
  track: string;
  level: string;
  unitId: string;
  title: Record<string, string>;
  objective: Record<string, string>;
  estimatedMinutes: number;
  blocks: LessonBlock[];
  thumbnailUrl?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SentenceSchema = new Schema(
  { text: String, startMs: Number, endMs: Number },
  { _id: false },
);

const BlockSchema = new Schema<LessonBlock>(
  {
    type:        { type: String, required: true },
    content:     { type: Schema.Types.Mixed },
    words:       { type: [String] },
    exerciseId:  { type: String },
    audioRef:    { type: String },
    sentences:   { type: [SentenceSchema] },
    videoRef:    { type: String },
    transcript:  { type: String },
    passageRef:  { type: String },
  },
  { _id: false },
);

const LessonSchema = new Schema<ILesson>(
  {
    id:               { type: String, required: true, unique: true },
    version:          { type: Number, required: true, default: 1 },
    language:         { type: String, required: true, index: true },
    track:            { type: String, required: true },
    level:            { type: String, required: true },
    unitId:           { type: String, required: true, index: true },
    title:            { type: Schema.Types.Mixed, required: true },
    objective:        { type: Schema.Types.Mixed, default: {} },
    estimatedMinutes: { type: Number, default: 10 },
    blocks:           { type: [BlockSchema], default: [] },
    thumbnailUrl:     { type: String },
    status:           { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt:      { type: Date },
    createdBy:        { type: String, required: true },
    updatedBy:        { type: String, required: true },
  },
  { timestamps: true },
);

LessonSchema.index({ language: 1, level: 1, status: 1 });
LessonSchema.index({ unitId: 1, status: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
