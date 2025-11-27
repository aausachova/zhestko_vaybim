export type OpenRouterRole = 'system' | 'user' | 'assistant';

export interface OpenRouterMessage {
  role: OpenRouterRole;
  content: string;
}

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_REFERRER = 'https://github.com/shoosh/zhestko_vaybim';
const DEFAULT_TITLE = 'VibeCodeJam';

const env = (import.meta as any).env ?? {};

function getApiKey() {
  const key = env.VITE_OPENROUTER_KEY?.trim();
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
  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  console.debug('[OpenRouter] request', payload);
  const apiKey = getApiKey();
  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': env.VITE_OPENROUTER_REF || DEFAULT_REFERRER,
      'X-Title': DEFAULT_TITLE,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[OpenRouter] error response', response.status, errorBody);
    throw new Error(`OpenRouter error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  console.debug('[OpenRouter] raw response', data);
  const choice = data?.choices?.[0];
  if (!choice) {
    throw new Error('OpenRouter: пустой список choices');
  }
  const content = choice.message?.content?.trim();
  const reasoning = Array.isArray(choice.message?.reasoning_details)
    ? choice.message.reasoning_details.map((item: any) => item.text).join('\n')
    : choice.message?.reasoning;

  if (!content) {
    console.warn(
      `[OpenRouter] empty choice content (finish_reason=${choice.finish_reason}), using reasoning fallback`,
      choice,
    );
  }

  return content || reasoning || `[Jam] Ответ оборван (finish_reason=${choice.finish_reason})`;
}

export async function* openRouterStream({ model, messages, temperature = 0.2, maxTokens = 500 }: ChatOptions) {
  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  };

  console.debug('[OpenRouter][stream] request', payload);
  const apiKey = getApiKey();
  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': env.VITE_OPENROUTER_REF || DEFAULT_REFERRER,
      'X-Title': DEFAULT_TITLE,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const errorBody = await response.text();
    console.error('[OpenRouter][stream] error response', response.status, errorBody);
    throw new Error(`OpenRouter stream error ${response.status}: ${errorBody}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === 'data: [DONE]') {
        console.debug('[OpenRouter][stream] done');
        return;
      }
      if (!trimmed.startsWith('data:')) continue;
      const payloadString = trimmed.slice(5).trim();
      if (!payloadString) continue;
      try {
        const json = JSON.parse(payloadString);
        console.debug('[OpenRouter][stream] chunk', json);
        yield json;
      } catch (err) {
        console.error('[OpenRouter][stream] failed to parse chunk', payloadString, err);
      }
    }
  }
}
