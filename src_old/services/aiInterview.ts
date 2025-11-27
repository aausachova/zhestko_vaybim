import { openRouterChat, OpenRouterMessage } from './openRouterClient';
import { buildAutocompletePrompt, buildInterviewSystemPrompt, AUTOCOMPLETE_SYSTEM_PROMPT } from '../prompts/interview';

export interface InterviewTurnInput {
  level: string;
  history: OpenRouterMessage[];
}

export async function sendInterviewTurn({ level, history }: InterviewTurnInput) {
  const baseHistory = history.length
    ? history
    : [
        { role: 'system', content: buildInterviewSystemPrompt(level) },
        {
          role: 'assistant',
          content: `Привет! Я Jam, твой AI-интервьюер. Расскажи кратко о своём опыте и ожидаемом уровне задач (${level}).`,
        },
      ];

  return openRouterChat({
    model: 'openai/gpt-5',
    messages: baseHistory,
    temperature: 0.4,
    maxTokens: 450,
  });
}

export async function requestAutocompleteSnippet(code: string, language = 'JavaScript') {
  if (!code.trim()) {
    return '';
  }
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: AUTOCOMPLETE_SYSTEM_PROMPT },
    { role: 'user', content: buildAutocompletePrompt(language, code) },
  ];

  return openRouterChat({
    model: 'qwen/qwen3-coder-flash',
    messages,
    temperature: 0.1,
    maxTokens: 200,
  });
}
