import { openRouterChat, OpenRouterMessage } from './openRouterClient';
import { ReportInsights, LevelReport } from '../types/reports';

const DEFAULT_INSIGHTS: ReportInsights = {
  headline: 'Интервью завершено',
  overallScore: 75,
  solvedTasks: 0,
  totalTasks: 0,
  strengths: [],
  improvements: [],
  recommendations: [],
  skillScores: [
    { name: 'Алгоритмы', score: 7, color: 'orange' },
    { name: 'Код', score: 8, color: 'blue' },
    { name: 'Системный дизайн', score: 6, color: 'purple' },
  ],
  codeQuality: {
    readability: 75,
    efficiency: 70,
    maintainability: 72,
  },
  security: [
    { label: 'Контроль честности', status: 'ok', message: 'Нарушений не обнаружено' },
  ],
  tasks: [],
};

interface InsightInput {
  language: string;
  levels: LevelReport[];
  chatHistory: OpenRouterMessage[];
  durationSeconds: number;
}

export async function generateReportInsights({
  language,
  levels,
  chatHistory,
  durationSeconds,
}: InsightInput): Promise<ReportInsights> {
  try {
    const userPayload = {
      language,
      durationSeconds,
      levels,
      chatExcerpt: chatHistory.slice(-50),
    };

    const response = await openRouterChat({
      model: 'openai/gpt-5-mini',
      maxTokens: 1500,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Ты аналитик HR-лаборатории. На основе истории собеседования и метрик по уровням сформируй JSON отчёт строго в указанном формате. Не добавляй пояснений, только валидный JSON. Все проценты/оценки должны быть числами. Цвета для skillScores выбирай из списка: blue, indigo, orange, pink, purple, green.',
        },
        {
          role: 'user',
          content: `Сформируй JSON вида:
{
  "headline": string,
  "overallScore": number (0-100),
  "solvedTasks": number,
  "totalTasks": number,
  "strengths": string[],
  "improvements": string[],
  "recommendations": string[],
  "skillScores": [{ "name": string, "score": number (0-10), "color": string }],
  "codeQuality": { "readability": number, "efficiency": number, "maintainability": number },
  "security": [{ "label": string, "status": "ok" | "warning", "message": string }],
  "tasks": [{ "name": string, "level": "Junior"|"Middle"|"Senior", "durationLabel": string, "status": "solved"|"partial"|"failed", "score": number, "notes": string }]
}
Данные:
${JSON.stringify(userPayload)}`,
        },
      ],
    });

    try {
      const parsed = JSON.parse(response);
      return {
        ...DEFAULT_INSIGHTS,
        ...parsed,
        skillScores: parsed.skillScores || DEFAULT_INSIGHTS.skillScores,
        codeQuality: parsed.codeQuality || DEFAULT_INSIGHTS.codeQuality,
        security: parsed.security || DEFAULT_INSIGHTS.security,
        tasks: parsed.tasks || [],
      };
    } catch (err) {
      console.warn('[reportInsights] failed to parse JSON', err, response);
      return DEFAULT_INSIGHTS;
    }
  } catch (err) {
    console.error('[reportInsights] OpenRouter error', err);
    return DEFAULT_INSIGHTS;
  }
}

