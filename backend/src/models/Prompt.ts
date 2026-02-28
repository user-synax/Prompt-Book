import mongoose, { Document, Schema } from 'mongoose';

export const CATEGORIES = [
  'general', 'coding', 'writing', 'design', 'marketing', 'education', 'data', 'other'
] as const;

export type Category = typeof CATEGORIES[number];

export interface IPrompt extends Document {
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  rating: number;
  isPublic: boolean;
  isFavorite: boolean;
  version: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const promptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Prompt content is required'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'general',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

promptSchema.index({ isPublic: 1 });
promptSchema.index({ category: 1 });
promptSchema.index({ tags: 1 });
promptSchema.index({ userId: 1, createdAt: -1 });
promptSchema.index({ title: 'text', description: 'text', content: 'text' });

export const Prompt = mongoose.model<IPrompt>('Prompt', promptSchema);
