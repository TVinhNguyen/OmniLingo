import mongoose, { Schema, Document } from 'mongoose';

// ─── Shared sub-schemas ────────────────────────────────────────────────────────

/** Localised text: {"en": "...", "vi": "...", "ja": "..."} */
const LocaleSchema = new Schema<Record<string, string>>(
  {},
  { strict: false, _id: false },
);

// ─── Language ─────────────────────────────────────────────────────────────────

export interface ILanguage extends Document {
  code: string;                    // 'en', 'ja', 'zh', 'ko', 'vi'
  name: Record<string, string>;    // {"en": "Japanese", "vi": "Tiếng Nhật"}
  flagEmoji: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>({
  code:      { type: String, required: true, unique: true, lowercase: true },
  name:      { type: LocaleSchema, required: true },
  flagEmoji: { type: String, default: '' },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

export const Language = mongoose.model<ILanguage>('Language', LanguageSchema);

// ─── Track ────────────────────────────────────────────────────────────────────

export interface ITrack extends Document {
  id: string;
  language: string;
  type: 'general' | 'test_prep';
  name: Record<string, string>;
  cert?: string;                   // 'ielts', 'jlpt', 'hsk', 'toeic'
  levelRange: string[];            // ['A1','A2','B1','B2'] or ['N5','N4','N3']
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrackSchema = new Schema<ITrack>({
  id:         { type: String, required: true, unique: true },
  language:   { type: String, required: true, index: true },
  type:       { type: String, enum: ['general', 'test_prep'], required: true },
  name:       { type: LocaleSchema, required: true },
  cert:       { type: String },
  levelRange: { type: [String], default: [] },
  order:      { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

TrackSchema.index({ language: 1, isActive: 1 });
export const Track = mongoose.model<ITrack>('Track', TrackSchema);

// ─── Course ───────────────────────────────────────────────────────────────────

export interface ICourse extends Document {
  id: string;
  trackId: string;
  language: string;
  level: string;
  title: Record<string, string>;
  description: Record<string, string>;
  thumbnailUrl?: string;
  order: number;
  unitIds: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  id:           { type: String, required: true, unique: true },
  trackId:      { type: String, required: true, index: true },
  language:     { type: String, required: true, index: true },
  level:        { type: String, required: true },
  title:        { type: LocaleSchema, required: true },
  description:  { type: LocaleSchema, default: {} },
  thumbnailUrl: { type: String },
  order:        { type: Number, default: 0 },
  unitIds:      { type: [String], default: [] },
  status:       { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  publishedAt:  { type: Date },
  createdBy:    { type: String, required: true },
  updatedBy:    { type: String, required: true },
}, { timestamps: true });

CourseSchema.index({ trackId: 1, status: 1 });
export const Course = mongoose.model<ICourse>('Course', CourseSchema);

// ─── Unit ─────────────────────────────────────────────────────────────────────

export interface IUnit extends Document {
  id: string;
  courseId: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  order: number;
  lessonIds: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new Schema<IUnit>({
  id:          { type: String, required: true, unique: true },
  courseId:    { type: String, required: true, index: true },
  title:       { type: LocaleSchema, required: true },
  description: { type: LocaleSchema },
  order:       { type: Number, default: 0 },
  lessonIds:   { type: [String], default: [] },
  createdBy:   { type: String, required: true },
  updatedBy:   { type: String, required: true },
}, { timestamps: true });

export const Unit = mongoose.model<IUnit>('Unit', UnitSchema);
