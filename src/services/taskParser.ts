export interface ParsedTestCase {
  input?: string;
  output?: string;
}

export interface ParsedExampleCase {
  input?: string;
  output?: string;
  explanation?: string;
}

export interface ParsedTaskSpec {
  condition?: string;
  tests?: string[];
  testCases?: ParsedTestCase[];
  hiddenTests?: string[];
  hiddenTestCases?: ParsedTestCase[];
  example?: string;
  examples?: ParsedExampleCase[];
  hint?: string;
  canShowHint?: boolean;
  timeLimit?: string;
  memoryLimit?: string;
}

function extractBlock(text: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
  const match = text.match(regex);
  return match?.[1]?.trim();
}

function extractBlocks(text: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'gi');
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

function normalizeLines(value?: string) {
  return value
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractLimits(condition?: string) {
  if (!condition) return { timeLimit: undefined, memoryLimit: undefined };
  const timeMatch = condition.match(/(?:Время|Time)\s*[:=]\s*([^\n]+)/i);
  const memoryMatch = condition.match(/(?:Память|Memory)\s*[:=]\s*([^\n]+)/i);
  return {
    timeLimit: timeMatch?.[1]?.trim(),
    memoryLimit: memoryMatch?.[1]?.trim(),
  };
}

export function parseTaskBlocks(raw: string): ParsedTaskSpec {
  if (!raw) return {};
  const condition = extractBlock(raw, 'условие');
  const testsBlock = extractBlock(raw, 'тест');
  const example = extractBlock(raw, 'пример');
  const hint = extractBlock(raw, 'подсказка');
  const showHintBlock = extractBlock(raw, 'показать подсказку');
  const hiddenTestsBlock = extractBlocks(raw, 'скрытый_тест');
  const hiddenTestsAnswers = extractBlocks(raw, 'скрытый_тест_ответ');
  const testInputs = extractBlocks(raw, 'тест');
  const testOutputs = extractBlocks(raw, 'тест_ответ');
  const testCases: ParsedTestCase[] =
    testInputs.length || testOutputs.length
      ? testInputs.map((input, index) => ({
          input,
          output: testOutputs[index],
        }))
      : [];

  const exampleInputs = extractBlocks(raw, 'пример');
  const exampleOutputs = extractBlocks(raw, 'пример_ответ');
  const exampleExplanations = extractBlocks(raw, 'пояснение');
  const examples: ParsedExampleCase[] =
    exampleInputs.length || exampleOutputs.length || exampleExplanations.length
      ? exampleInputs.map((input, index) => ({
          input,
          output: exampleOutputs[index],
          explanation: exampleExplanations[index],
        }))
      : [];
  const tests = normalizeLines(testsBlock);
  const hiddenTestCases: ParsedTestCase[] =
    hiddenTestsBlock.length || hiddenTestsAnswers.length
      ? hiddenTestsBlock.map((input, index) => ({
          input,
          output: hiddenTestsAnswers[index],
        }))
      : [];
  const { timeLimit, memoryLimit } = extractLimits(condition);
  const canShowHint = /^(да|true|show)$/i.test(showHintBlock ?? '');

  return {
    condition,
    tests,
    testCases: testCases.length ? testCases : undefined,
    hiddenTests: hiddenTestsBlock.length ? hiddenTestsBlock : undefined,
    hiddenTestCases: hiddenTestCases.length ? hiddenTestCases : undefined,
    example,
    examples: examples.length ? examples : undefined,
    hint,
    canShowHint,
    timeLimit,
    memoryLimit,
  };
}
