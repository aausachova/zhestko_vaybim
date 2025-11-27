export interface LoginResponse {
  token: string;
  role: 'user' | 'admin';
  username: string;
}

export async function apiLogin(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || `Login failed (${res.status})`);
  }
  return res.json();
}


