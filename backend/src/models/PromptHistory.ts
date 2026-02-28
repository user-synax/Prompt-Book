import mongoose, { Document, Schema } from 'mongoose';

export interface IPromptHistory extends Document {
  promptId: mongoose.Types.ObjectId;
  promptVersion: number;
  promptContent: string;
  userId: mongoose.Types.ObjectId;
  variables: Record<string, string>;
  generatedResponse: string;
  aiModel: string;
  tokensUsed: number | null;
  createdAt: Date;
}

const promptHistorySchema = new Schema<IPromptHistory>(
  {
    promptId: {
      type: Schema.Types.ObjectId,
      ref: 'Prompt',
      required: true,
    },
    promptVersion: {
      type: Number,
      required: true,
    },
    promptContent: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    variables: {
      type: Schema.Types.Mixed,
      default: {},
    },
    generatedResponse: {
      type: String,
      required: true,
    },
    aiModel: {
      type: String,
      default: 'gpt-3.5-turbo',
    },
    tokensUsed: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

promptHistorySchema.index({ userId: 1, createdAt: -1 });
promptHistorySchema.index({ promptId: 1 });

export const PromptHistory = mongoose.model<IPromptHistory>('PromptHistory', promptHistorySchema);
