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
}

function buildHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res: Response) {
  if (res.ok) {
    return res.json().catch(() => ({}));
  }
  const error = await res.json().catch(() => ({}));
  throw new Error(error?.error || `Request failed (${res.status})`);
}

export async function startCodeRunner(language: string, token: string) {
  const res = await fetch('/api/runner/start', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language }),
  });
  return handleResponse(res);
}

export async function stopCodeRunner(token: string) {
  const res = await fetch('/api/runner', {
    method: 'DELETE',
    headers: buildHeaders(token),
  });
  return handleResponse(res);
}

export async function runUserCode(language: string, code: string, token: string, input = ''): Promise<RunnerResult> {
  const res = await fetch('/api/runner/run', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language, code, input }),
  });
  return handleResponse(res);
}

export async function runUserTests(
  language: string,
  code: string,
  tests: TestCasePayload[],
  token: string,
): Promise<TestRunResult[]> {
  const res = await fetch('/api/runner/tests', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ language, code, tests }),
  });
  const data = await handleResponse(res);
  return Array.isArray(data?.results) ? data.results : [];
}


