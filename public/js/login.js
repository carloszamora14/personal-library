import { checkUsername, checkPassword } from './utils/validations.js';
import changeLocation from './utils/changeLocation.js';
import './utils/authHeader.js';

const form = document.querySelector('.login-form');

form.addEventListener('submit', async evt => {
  evt.preventDefault();

  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');

  const usernameError = checkUsername(usernameInput.value);
  const passwordError = checkPassword(passwordInput.value);

  const usernameErrorMsg = document.querySelector('#username-error');
  const passwordErrorMsg = document.querySelector('#password-error');

  usernameErrorMsg.textContent = usernameError;
  passwordErrorMsg.textContent = passwordError;

  if (usernameError || passwordError) {
    return;
  }

  try {
    const jsonResponse = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
      })
    });

    const data = await jsonResponse.json();

    if (data.errors) {
      const { global, inputValidation } = data.errors;
      if (global) {
        document.querySelector('#global-error').textContent = global;
      }

      if (inputValidation) {
        usernameErrorMsg.textContent = inputValidation.username;
        passwordErrorMsg.textContent = inputValidation.password;
      }
    } else {
      localStorage.setItem('jwtToken', data.data.token);
      changeLocation('/home');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
});