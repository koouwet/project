import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import { aiMsg } from "./ai.js";
import { addUser, verifyUser, addMessage, getMessagesByUser } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(rootDir, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'about.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'people.html'));
});

app.get('/journal', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'journal.html'));
});

app.get('/resources', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'resources.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'chat.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'registration.html'));
});

app.post("/api/message", async (req, res) => {
  const { text } = req.body;
  const user = JSON.parse(req.headers['x-user']|| null);
  if (!text || !user) return res.status(400).json({ error: "Недопустимый запрос" });

  addMessage(user.id, 'user', text);

  const reply = await aiMsg(text);
  addMessage(user.id, 'bot', reply);

  res.json({ reply });
});

app.get("/api/messages/:userId", (req, res) => {
  const messages = getMessagesByUser(req.params.userId);
  res.json(messages);
});

app.listen(PORT, () =>
  console.log(`✓  Сервер запущен: http://localhost:${PORT}`)
);

app.post('/api/register', (req, res) => {
  const { name, password } = req.body;

  try {
    addUser(name, password);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const { name, password } = req.body;
  const user = verifyUser(name, password);
  if (user) {
    res.json({ success: true, user_id: user.id });
  } else {
    res.status(401).json({ success: false, error: "Неверное имя или пароль" });
  }
});