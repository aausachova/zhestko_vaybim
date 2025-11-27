export interface RunnerResult {
  status: string;
  stdout: string;
  stderr: string;
}

export interface TestCasePayload {
  input: string;
  expected?: string;
}

export interface TestRunResult extends RunnerResult {
  index: number;
  passed?: boolean;
  kind?: 'visible' | 'hidden';
  expected?: string;
}

const REDACTED = '***';

function shortToken(token: string) {
  if (!token) return REDACTED;
  if (token.length <= 8) return REDACTED;
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

function buildHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res: Response, context: string) {
  if (res.ok) {
    return res.json().catch(() => ({}));
  }
  const text = await res.text().catch(() => '');
  console.error(`[RunnerAPI] ${context} failed`, res.status, text);
  let message = `Request failed (${res.status})`;
  try {
    const json = text ? JSON.parse(text) : null;
    message = json?.error || message;
  } catch {
    message = text || message;
  }
  if (res.status === 401) {
    message = 'invalid token';
  }
  throw new Error(message);
}

export async function startCodeRunner(language: string, token: string) {
  console.debug('[RunnerAPI] start', { language, token: shortToken(token) });
  const res = await fetch('/api/runner/start', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language }),
  });
  return handleResponse(res, 'start');
}

export async function stopCodeRunner(token: string) {
  console.debug('[RunnerAPI] stop', { token: shortToken(token) });
  const res = await fetch('/api/runner', {
    method: 'DELETE',
    headers: buildHeaders(token),
  });
  return handleResponse(res, 'stop');
}

export async function runUserCode(language: string, code: string, token: string, input = ''): Promise<RunnerResult> {
  console.debug('[RunnerAPI] run code', {
    language,
    codeLength: code.length,
    inputLength: input.length,
    token: shortToken(token),
  });
  const res = await fetch('/api/runner/run', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language, code, input }),
  });
  return handleResponse(res, 'run');
}

export async function runUserTests(
  language: string,
  code: string,
  tests: TestCasePayload[],
  token: string,
): Promise<TestRunResult[]> {
  console.debug('[RunnerAPI] run tests', {
    language,
    codeLength: code.length,
    tests: tests.length,
    token: shortToken(token),
  });
  const res = await fetch('/api/runner/tests', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language, code, tests }),
  });
  const data = await handleResponse(res, 'tests');
  return Array.isArray(data?.results) ? data.results : [];
}


