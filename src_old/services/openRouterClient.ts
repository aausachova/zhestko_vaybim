export type OpenRouterRole = 'system' | 'user' | 'assistant';

export interface OpenRouterMessage {
  role: OpenRouterRole;
  content: string;
}

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_REFERRER = 'https://github.com/shoosh/zhestko_vaybim';
const DEFAULT_TITLE = 'VibeCodeJam';

function getApiKey() {
  const key = import.meta.env.VITE_OPENROUTER_KEY?.trim();
  if (!key) {
    throw new Error('Отсутствует ключ OpenRouter. Добавьте VITE_OPENROUTER_KEY в .env');
  }
  return key;
}

interface ChatOptions {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
}

export async function openRouterChat({ model, messages, temperature = 0.2, maxTokens = 500 }: ChatOptions) {
  const apiKey = getApiKey();
  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': import.meta.env.VITE_OPENROUTER_REF || DEFAULT_REFERRER,
      'X-Title': DEFAULT_TITLE,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('Пустой ответ от OpenRouter');
  }
  return content;
}
