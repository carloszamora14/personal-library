import { checkUsername, checkPassword } from './utils/validations.js';

const form = document.querySelector('.login-form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');

  const usernameError = checkUsername(usernameInput.value);
  const passwordError = checkPassword(passwordInput.value);

  if (usernameError) {
    console.log(usernameError);
  }

  if (passwordError) {
    console.log(passwordError);
  }
});