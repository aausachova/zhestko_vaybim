import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const DB_PATH = process.env.SQLITE_PATH || '/data/app.db';
const require = createRequire(import.meta.url);
const { createRunner, runCode: executeInSandbox, stopRunner } = require('./dood/runner.js');

const LANGUAGE_MAP = {
  javascript: 'javascript',
  typescript: 'javascript',
  python: 'python',
  go: 'go',
};

const runnerStore = new Map(); // userId -> { containerId, language }
const runnerLocks = new Map(); // userId -> Promise queue

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let db;

async function initDb() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  const existing = await db.get('SELECT COUNT(*) as count FROM users');
  if (existing?.count === 0) {
    const userHash = await bcrypt.hash('user', 10);
    const adminHash = await bcrypt.hash('admin', 10);
    await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['user', userHash, 'user']);
    await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', adminHash, 'admin']);
    console.log('[seed] Inserted default users: user/user, admin/admin');
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, role: user.role, username: user.username });
});

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}

app.get('/api/users', auth, async (req, res) => {
  const rows = await db.all('SELECT id, username, role FROM users ORDER BY id ASC');
  res.json(rows);
});

function normalizeLanguage(language) {
  if (!language) return null;
  const key = language.toLowerCase();
  return LANGUAGE_MAP[key] || null;
}

function enqueueRunnerTask(userId, task) {
  const prev = runnerLocks.get(userId) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(task);
  runnerLocks.set(userId, next.catch(() => {}));
  return next;
}

async function ensureRunner(userId, languageKey) {
  if (!languageKey) {
    throw new Error('unsupported language');
  }
  const current = runnerStore.get(userId);
  if (current?.language === languageKey) {
    return current;
  }
  if (current) {
    console.log(`[runner] stopping previous container for user ${userId}`);
    await stopRunner(current.containerId).catch((err) => console.warn('[runner] stop error', err.message));
    runnerStore.delete(userId);
  }
  console.log(`[runner] creating container for user ${userId} (${languageKey})`);
  const containerId = await createRunner(languageKey);
  const slot = { containerId, language: languageKey };
  runnerStore.set(userId, slot);
  return slot;
}

async function disposeRunner(userId) {
  const slot = runnerStore.get(userId);
  if (!slot) return;
  try {
    await stopRunner(slot.containerId);
    console.log(`[runner] disposed container ${slot.containerId.substring(0, 12)} for user ${userId}`);
  } catch (err) {
    console.warn('[runner] dispose error', err.message);
  } finally {
    runnerStore.delete(userId);
  }
}

app.post('/api/runner/start', auth, async (req, res) => {
  const { language } = req.body || {};
  const langKey = normalizeLanguage(language);
  if (!langKey) {
    return res.status(400).json({ error: 'unsupported language' });
  }
  try {
    console.log('[runner] start request', { userId: req.user.sub, language: langKey });
    await enqueueRunnerTask(req.user.sub, () => ensureRunner(req.user.sub, langKey));
    console.log('[runner] start ready', { userId: req.user.sub, language: langKey });
    res.json({ ok: true, language: langKey });
  } catch (err) {
    console.error('[runner] start error', err);
    res.status(500).json({ error: 'runner_start_failed' });
  }
});

app.post('/api/runner/run', auth, async (req, res) => {
  const { language, code, input = '' } = req.body || {};
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'code is required' });
  }
  const langKey = normalizeLanguage(language);
  if (!langKey) {
    return res.status(400).json({ error: 'unsupported language' });
  }
  try {
    console.log('[runner] run request', {
      userId: req.user.sub,
      language: langKey,
      codeLength: typeof code === 'string' ? code.length : 0,
      inputLength: typeof input === 'string' ? input.length : 0,
    });
    const result = await enqueueRunnerTask(req.user.sub, async () => {
      const slot = await ensureRunner(req.user.sub, langKey);
      const runResult = await executeInSandbox(slot.containerId, langKey, code, input);
      console.log('[runner] run completed', {
        userId: req.user.sub,
        language: langKey,
        status: runResult.status,
        stdoutBytes: runResult.output ? runResult.output.length : 0,
        stderrBytes: runResult.error ? runResult.error.length : 0,
      });
      return {
        status: runResult.status,
        stdout: runResult.output ?? '',
        stderr: runResult.error ?? '',
      };
    });
    res.json(result);
  } catch (err) {
    console.error('[runner] run error', err);
    res.status(500).json({ error: 'run_failed' });
  }
});

app.post('/api/runner/tests', auth, async (req, res) => {
  const { language, code, tests } = req.body || {};
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'code is required' });
  }
  if (!Array.isArray(tests) || tests.length === 0) {
    return res.status(400).json({ error: 'tests array required' });
  }
  const langKey = normalizeLanguage(language);
  if (!langKey) {
    return res.status(400).json({ error: 'unsupported language' });
  }
  try {
    console.log('[runner] tests request', {
      userId: req.user.sub,
      language: langKey,
      tests: tests.length,
      codeLength: typeof code === 'string' ? code.length : 0,
    });
    const payload = await enqueueRunnerTask(req.user.sub, async () => {
      const slot = await ensureRunner(req.user.sub, langKey);
      const results = [];
      for (let i = 0; i < tests.length; i += 1) {
        const testInput = typeof tests[i]?.input === 'string' ? tests[i].input : '';
        const expected = typeof tests[i]?.expected === 'string' ? tests[i].expected : undefined;
        console.log('[runner] test case run', {
          userId: req.user.sub,
          language: langKey,
          index: i,
          inputLength: testInput.length,
          expectLength: expected ? expected.length : 0,
        });
        const runResult = await executeInSandbox(slot.containerId, langKey, code, testInput);
        const normalized = (runResult.output ?? '').trim();
        const passed = expected ? normalized === expected.trim() && runResult.status === 'success' : undefined;
        results.push({
          index: i,
          status: runResult.status,
          stdout: runResult.output ?? '',
          stderr: runResult.error ?? '',
          passed,
        });
      }
      console.log('[runner] tests completed', { userId: req.user.sub, language: langKey, total: results.length });
      return results;
    });
    res.json({ results: payload });
  } catch (err) {
    console.error('[runner] tests error', err);
    res.status(500).json({ error: 'tests_failed' });
  }
});

app.delete('/api/runner', auth, async (req, res) => {
  try {
    await enqueueRunnerTask(req.user.sub, () => disposeRunner(req.user.sub));
    res.json({ ok: true });
  } catch (err) {
    console.error('[runner] stop error', err);
    res.status(500).json({ error: 'runner_stop_failed' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[backend] listening on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });

async function shutdown() {
  console.log('[backend] shutting down, stopping runners...');
  const stopJobs = Array.from(runnerStore.entries()).map(([userId, slot]) =>
    stopRunner(slot.containerId)
      .then(() => console.log(`[runner] stopped container for user ${userId}`))
      .catch((err) => console.warn('[runner] stop error', err.message)),
  );
  await Promise.all(stopJobs);
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


