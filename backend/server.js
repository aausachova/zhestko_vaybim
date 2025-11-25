import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const DB_PATH = process.env.SQLITE_PATH || '/data/app.db';

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


