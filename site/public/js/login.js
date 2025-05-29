loginForm.addEventListener('submit', async (e) => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  });

  const data = await res.json();

});


async function loadMessages() {
  const res = await fetch(`/api/messages/${user.id}`);
  const messages = await res.json();
  }