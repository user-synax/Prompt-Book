import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

interface GenerateOptions {
  prompt: string;
  model?: string;
}

interface GenerateResult {
  response: string;
  tokensUsed: number | null;
  model: string;
}

export async function generateCompletion(options: GenerateOptions): Promise<GenerateResult> {
  const model = options.model || 'gpt-3.5-turbo';

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: options.prompt }],
    max_tokens: 2048,
  });

  const choice = completion.choices[0];
  const response = choice?.message?.content || '';
  const tokensUsed = completion.usage?.total_tokens || null;

  return {
    response,
    tokensUsed,
    model,
  };
}
