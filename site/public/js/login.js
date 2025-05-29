const loginDialog = document.querySelector('.loginDialog');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('.login-form');
const loginCloseBtn = document.querySelector('.login-close-btn');

loginBtn.addEventListener('click', () => loginDialog.showModal());
loginCloseBtn.addEventListener('click', () => loginDialog.close());
loginDialog.addEventListener('click', e => {
  if (e.target === loginDialog) loginDialog.close();
});

function validateLoginInput(event) {
  const input = event.target;
  const error = document.getElementById(`${input.id}-error`);
  let isValid = true;
  let message = "";

  if (input.name === "username") {
    const value = input.value.trim();
    if (value.length < 4) {
      isValid = false;
      message = "Имя должно быть не короче 4 символов.";
    } else if (!/^[A-Za-z0-9]+$/.test(value) || !/[A-Za-z]/.test(value)) {
      isValid = false;
      message = "Имя может содержать только латиницу, цифры и хотя бы одну букву.";
    }
  }

  if (input.name === "password") {
    const value = input.value;
    if (value.length < 8) {
      isValid = false;
      message = "Пароль должен быть не короче 8 символов.";
    }
  }

  input.setAttribute("aria-invalid", isValid ? "false" : "true");
  if (error) {
    error.textContent = message;
    error.hidden = isValid;
  }
}

document.querySelectorAll('.login-form input').forEach(input => {
  input.addEventListener('blur', validateLoginInput);
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = loginForm.username.value.trim();
  const password = loginForm.password.value;

  ['login-username', 'login-password'].forEach(id => {
    const el = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    el.hidden = true;
    input.setAttribute("aria-invalid", "false");
  });

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json();

    if (!data.success) {
      const errorField = data.error.includes("имя") ? "login-username" : "login-password";
      const errorSpan = document.getElementById(`${errorField}-error`);
      const input = document.getElementById(errorField);
      input.setAttribute("aria-invalid", "true");
      errorSpan.textContent = data.error;
      errorSpan.hidden = false;
      return;
    }

    loginForm.reset();
    loginDialog.close();
    localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: name }));
    window.location.href = "/chat";

  } catch (err) {
    const span = document.getElementById("login-password-error");
    const input = document.getElementById("login-password");
    input.setAttribute("aria-invalid", "true");
    span.textContent = "Сервер недоступен. Повторите позже.";
    span.hidden = false;
  }
});


async function loadMessages() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
  
    try {
      const res = await fetch(`/api/messages/${user.id}`);
      const messages = await res.json();
  
      messages.forEach(msg => {
        addMsg(msg.text, msg.role === 'user');
      });
    } catch (err) {
      addMsg("❌ Не удалось загрузить историю сообщений", false);
    }
  }
  
  window.addEventListener("DOMContentLoaded", loadMessages);