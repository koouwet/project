const registerDialog = document.querySelector('.registerDialog');
const openBtn = document.querySelector('.register-btn')

const user = localStorage.getItem('user');
if (user) {
  window.location.href = '/chat';
}

const openDialog = () => {
    registerDialog.showModal()
}

openBtn.addEventListener('click', openDialog)

const closeBtn = document.querySelector('.close-btn')

const closeDialog = () => {
    registerDialog.close()
}

const closeDialog2 = (event) => {
    if (event.target === registerDialog) {
        registerDialog.close()
    } 
}

registerDialog.addEventListener('click', closeDialog2)
closeBtn.addEventListener('click', closeDialog)

const togglePassword = document.querySelector('.toggle-password')
const passwordInput = document.getElementById('password')
let showPass = false

const icons = {
    show: `
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none">
        <path d="M1 12S5 4 12 4s11 8 11 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M1 12s4 8 11 8 11-8 11-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      </svg>`,
    hide: 
      `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 28 28" fill="none">
      <path clip-rule="evenodd" d="M22.6928 1.55018C22.3102 1.32626 21.8209 1.45915 21.6 1.84698L19.1533 6.14375C17.4864 5.36351 15.7609 4.96457 14.0142 4.96457C9.32104 4.96457 4.781 7.84644 1.11993 13.2641L1.10541 13.2854L1.09271 13.3038C0.970762 13.4784 0.967649 13.6837 1.0921 13.8563C3.79364 17.8691 6.97705 20.4972 10.3484 21.6018L8.39935 25.0222C8.1784 25.4101 8.30951 25.906 8.69214 26.1299L9.03857 26.3326C9.4212 26.5565 9.91046 26.4237 10.1314 26.0358L23.332 2.86058C23.553 2.47275 23.4219 1.97684 23.0392 1.75291L22.6928 1.55018ZM18.092 8.00705C16.7353 7.40974 15.3654 7.1186 14.0142 7.1186C10.6042 7.1186 7.07416 8.97311 3.93908 12.9239C3.63812 13.3032 3.63812 13.8561 3.93908 14.2354C6.28912 17.197 8.86102 18.9811 11.438 19.689L12.7855 17.3232C11.2462 16.8322 9.97333 15.4627 9.97333 13.5818C9.97333 11.2026 11.7969 9.27368 14.046 9.27368C15.0842 9.27368 16.0317 9.68468 16.7511 10.3612L18.092 8.00705ZM15.639 12.3137C15.2926 11.7767 14.7231 11.4277 14.046 11.4277C12.9205 11.4277 12 12.3906 12 13.5802C12 14.3664 12.8432 15.2851 13.9024 15.3624L15.639 12.3137Z" fill="#000000" fill-rule="evenodd"/><path d="M14.6873 22.1761C19.1311 21.9148 23.4056 19.0687 26.8864 13.931C26.9593 13.8234 27 13.7121 27 13.5797C27 13.4535 26.965 13.3481 26.8956 13.2455C25.5579 11.2677 24.1025 9.62885 22.5652 8.34557L21.506 10.2052C22.3887 10.9653 23.2531 11.87 24.0894 12.9239C24.3904 13.3032 24.3904 13.8561 24.0894 14.2354C21.5676 17.4135 18.7903 19.2357 16.0254 19.827L14.6873 22.1761Z" fill="#000000"/>
      </svg>`
  };

const showPassword = () => {
    togglePassword.innerHTML = icons.show;
    passwordInput.type = 'text';
    showPass = !showPass
}

const hidePassword = () => {
    if (showPass) {
        togglePassword.innerHTML = icons.hide;
        passwordInput.type = 'password';
        showPass = !showPass
    } 
}

function isValidUsername(name) {
    return /^[A-Za-z0-9]+$/.test(name) && /[A-Za-z]/.test(name);
  }

function isValidPassword(pass) {
    return /^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/~`]+$/.test(pass);
  }
  
togglePassword.addEventListener('pointerdown', showPassword)

togglePassword.addEventListener('pointerup', hidePassword)

const inputs = document.querySelectorAll('input')

const form = document.querySelector('form')

form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = form.username.value.trim();
    const password = form.password.value;
  
    if (!isValidUsername(name)) {
      alert("Имя должно содержать только латинские буквы и цифры и хотя бы одну букву.");
      return;
    }
  
    if (!isValidPassword(password)) {
      alert("Пароль должен содержать латинские буквы, цифры и символы.");
      return;
    }
  
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });
  
      const data = await res.json();
  
      if (!data.success) {
        alert("Ошибка: " + data.error);
        return;
      }
  
      form.reset();
      registerDialog.close();
  
    } catch (err) {
      alert("Ошибка соединения с сервером.");
    }
  });

  const func3 = (event) => {
    const input = event.target;
    const errorMessage = document.getElementById(`${input.id}-error`);
  
    let isValid = true;
    let message = "";
  
    if (input.name === "username") {
      const value = input.value.trim();
      if (value.length < 4) {
        isValid = false;
        message = "Имя должно быть не короче 4 символов.";
      } else if (!/^[A-Za-z0-9]+$/.test(value) || !/[A-Za-z]/.test(value)) {
        isValid = false;
        message = "Имя может содержать только латинские буквы и цифры и хотя бы одну букву.";
      }
    }
  
    if (input.name === "password") {
      const value = input.value;
      if (value.length < 8) {
        isValid = false;
        message = "Пароль должен быть не короче 8 символов.";
      } else if (
        !/^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/~`]+$/.test(value)
      ) {
        isValid = false;
        message = "Пароль может содержать только латинские буквы, цифры и символы.";
      }
    }
  
    if (!isValid) {
      input.setAttribute("aria-invalid", "true");
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
      }
    } else {
      input.setAttribute("aria-invalid", "false");
      if (errorMessage) errorMessage.hidden = true;
    }
  };

const func2 = (input) => {
    input.addEventListener("blur", func3)
}

inputs.forEach(func2)