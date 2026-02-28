import mongoose, { Document, Schema } from 'mongoose';

export interface IPromptVersion extends Document {
  promptId: mongoose.Types.ObjectId;
  version: number;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  rating: number | null;
  isPublic: boolean;
  createdAt: Date;
}

const promptVersionSchema = new Schema<IPromptVersion>(
  {
    promptId: {
      type: Schema.Types.ObjectId,
      ref: 'Prompt',
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: null },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

promptVersionSchema.index({ promptId: 1, version: 1 }, { unique: true });

export const PromptVersion = mongoose.model<IPromptVersion>('PromptVersion', promptVersionSchema);
