const feed  = document.getElementById("chat-feed");
const form  = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = '/registration';
} else {
  document.body.style.visibility = 'visible';
}

function addMsg(text, isUser) {
  const li = document.createElement("li");
  li.className = `chat__msg ${isUser ? "chat__msg--user" : "chat__msg--bot"}`;
  li.style.whiteSpace = "pre-wrap";
  li.textContent = text;
  feed.append(li);
  feed.scrollTop = feed.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, true);
  input.value = "";
  input.focus();

  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-user": JSON.stringify(user)
       },
      body: JSON.stringify({ text })
    });
    const { reply, error } = await res.json();
    if (error) throw new Error(error);
    addMsg(reply, false);
  } catch (err) {
    addMsg("❌ Ошибка связи с сервером", false);
    console.error(err);
  }
});

async function loadUserMessages() {
  try {
    const res = await fetch(`/api/messages/${user.id}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach(msg => addMsg(msg.text.replace(/(?<!\.)\.(?!\.)/g, '.\n'), msg.role === "user"));
    }
  } catch (err) {
    console.error('Ошибка загрузки сообщений:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadUserMessages);

const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = '/chat'})

