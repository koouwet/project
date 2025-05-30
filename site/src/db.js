import Database from 'better-sqlite3';

const db = new Database('messenger.db');
import bcrypt from 'bcrypt';

export function addUser(name, password) {
  const password_hash = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (name, password_hash) VALUES (?, ?)');
    return stmt.run(name, password_hash);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Пользователь с таким именем уже существует');
    }
    throw err;
  }
}

export function getUserByName(name) {
  const stmt = db.prepare('SELECT * FROM users WHERE name = ?');
  return stmt.get(name); 
}

export function verifyUser(name, password) {
  const user = getUserByName(name);
  if (!user) return false;

  const match = bcrypt.compareSync(password, user.password_hash);
  return match ? user : false;
}

export function addMessage(user_id, role, text) {
  const stmt = db.prepare('INSERT INTO messages (user_id, role, text) VALUES (?, ?, ?)');
  return stmt.run(user_id, role, text);
}

export function getMessagesByUser(user_id) {
  const stmt = db.prepare('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at');
  return stmt.all(user_id);
}