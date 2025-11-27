import { openRouterChat, openRouterStream, OpenRouterMessage } from './openRouterClient';
import { buildAutocompletePrompt, buildInterviewSystemPrompt, AUTOCOMPLETE_SYSTEM_PROMPT } from '../prompts/interview';

export interface InterviewTurnInput {
  level: string;
  language?: string;
  history: OpenRouterMessage[];
}

const INTERVIEW_RESPONSE_TOKENS = 10000;
const AUTOCOMPLETE_RESPONSE_TOKENS = 200;
const AUTOCOMPLETE_MODEL = 'openai/gpt-4.1-mini';

function buildStarterHistory(level: string, language?: string): OpenRouterMessage[] {
  return [
    { role: 'system', content: buildInterviewSystemPrompt(level, language) },
    {
      role: 'assistant',
      content: `Привет! Я Jam. Расскажи кратко о своём опыте, ожиданиях по языку ${language ?? 'JavaScript'} и уровне задач (${level}).`,
    },
  ];
}

export async function sendInterviewTurn({ level, language, history }: InterviewTurnInput) {
  const starterHistory = buildStarterHistory(level, language);
  const baseHistory: OpenRouterMessage[] = history.length ? history : starterHistory;

  return openRouterChat({
    model: 'openai/gpt-5',
    messages: baseHistory,
    temperature: 0.3,
    maxTokens: INTERVIEW_RESPONSE_TOKENS,
  });
}

interface StreamInterviewInput extends InterviewTurnInput {
  onChunk: (delta: string) => void;
}

export async function streamInterviewTurn({ level, language, history, onChunk }: StreamInterviewInput) {
  const starterHistory = buildStarterHistory(level, language);
  const baseHistory: OpenRouterMessage[] = history.length ? history : starterHistory;

  for await (const chunk of openRouterStream({
    model: 'openai/gpt-5',
    messages: baseHistory,
    temperature: 0.4,
    maxTokens: INTERVIEW_RESPONSE_TOKENS,
  })) {
    const delta = chunk?.choices?.[0]?.delta?.content;
    if (delta) {
      onChunk(delta);
    }
  }
}

interface AutocompleteOptions {
  context?: string;
}

export async function requestAutocompleteSnippet(code: string, language = 'JavaScript', options?: AutocompleteOptions) {
  if (!code.trim()) {
    return '';
  }
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: AUTOCOMPLETE_SYSTEM_PROMPT },
    { role: 'user', content: buildAutocompletePrompt(language, code, options?.context) },
  ];

  return openRouterChat({
    model: AUTOCOMPLETE_MODEL,
    messages,
    temperature: 0.1,
    maxTokens: AUTOCOMPLETE_RESPONSE_TOKENS,
  });
}
