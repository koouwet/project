# Технологии проекта «Clear Language»

## 1. Обзор стека
<table>
  <tr>
    <th rowspan="3" style="text-align:center;">Front‑end</th>
    <td>HTML5 (многостраничные шаблоны в `/public`)</td>
  </tr>
  <tr>
    <td>CSS3 (Flexbox & Grid, кастомные свойства)</td>
  </tr>
  <tr>
    <td>JavaScript — формы регистрации и входа, чат‑клиент</td>
  </tr>
  <tr>
    <th rowspan="7" style="text-align:center;">Back-end</th>
    <td>Node.js 20 (ES‑modules)</td>
  </tr>
  <tr>
    <td>Express 4.19 — HTTP‑сервер, REST‑API </td>
  </tr>
  <tr>
    <td>better‑sqlite3 9 — синхронная встроенная СУБД</td>
  </tr>
  <tr>
    <td>https‑proxy‑agent 7 — проксирование исходящих запросов</td>
  </tr>
  <tr>
    <td>Gemini Flash API — генерация ответов ИИ </td>
  </tr>
  <tr>
    <td>bcrypt 5 — хеширование паролей</td>
  </tr>
  <tr>
    <td>axios — библиотека для HTTP-запросов</td>
  </tr>
</table>



---

## 2. Структура каталогов

```text
Clear_Language/
├── src/                  # Node‑код (ESM)
│   ├── ai.js             # Прокси к Gemini Flash API
│   ├── db.js             # Работа с SQLite (better‑sqlite3)
│   ├── config.js         # Работа с config.json
│   └── server.js         # Точка входа Express
├── public/               # Статические страницы, стили, скрипты
│   ├── about.html
│   ├── chat.html
│   ├── index.html
│   ├── journal.html
│   ├── people.html
│   ├── registration.html
│   ├── css/              # Папка с css для страниц
│   ├── img/              # Папка с изображениями для страниц
│   └── js/               # Папка с js для страниц
├── messenger.db          # База сообщений/пользователей (SQLite)
├── package-lock.json
└── package.json
```

---

## 3. Детали реализации

### 3.1 Express‑сервер

- **Маршруты:** 4 статические (`/`, `/chat`, `/login`, `/register`) + 2 API‑эндпойнта (`/api/chat`, `/api/messages/:id`).
- **Middleware:** `express.json()`, `helmet()`, кастомная проверка заголовка `X‑User`.

#### Пример актуального app `/api/message`

```js
app.post("/api/message", async (req, res) => {
  const { text } = req.body;
  const user = JSON.parse(req.headers['x-user'] || null);
  if (!text || !user) return res.status(400).json({ error: "Недопустимый запрос" });

  addMessage(user.id, 'user', text);

  const reply = await aiMsg(text);
  addMessage(user.id, 'bot', reply);

  res.json({ reply });
});
```

### 3.2 База данных

- **SQLite** хранится локально (`messenger.db`).
- Схема (упрощённо):

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  role TEXT CHECK(role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3.3 Клиентский JavaScript

|      Файл       | Назначение |
|:---------------:|:-----------|
| `chat.js`        | GET → `/api/messages/:userId`, вывод сообщений, auto-scroll |
| `chat.js`        | POST → `/api/message`, обработка, добавления в базу данных и вывод сообщений |
| `registration.js`| POST `/api/register`, клиентская валидация форм |
| `login.js`       | POST `/api/login`, сохранение токена (пока — в LocalStorage) |

> Файлы используют **ES‑modules** (`type="module"`), только для современных браузеров.

---

## 4. Переменные окружения (`.env`)

| Ключ            | Значение |
|:---------------:|:---------|
| `PORT`          | Порт Express (default `3000`) |
| `GEMINI_API_KEY`| Ключ доступа к Gemini Flash |
| `FORWARD_PROXY` | `http://user:pass@proxy:port` (опционально) |

---

## 5. Особенности работы NLP-модели

> Хотя исходный код NLP-модели в проекте отсутствует, архитектура подразумевает, что:
> - Входной текст пользователя отправляется на сервер.
> - NLP-модель, либо локальная, либо облачная (через API), обрабатывает его, упрощая сложные формулировки.
> - Обработанный текст возвращается пользователю в чате.
>
> Это делает систему особенно полезной для людей с когнитивными нарушениями, предоставляя им доступ к понятной информации.

---

## 6. Рекомендации по установке и настройке (для разработчиков)

1. **Установка зависимостей:**

    ```bash
    npm install
    ```

2. **Запуск сервера:**

    ```bash
    node src/server.js
    ```

    _(Файл `server.js` должен содержать основную серверную логику. Его наличие подтверждается структурой проекта.)_

---

