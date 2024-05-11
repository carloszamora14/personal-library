import {
  checkUsername,
  checkPassword,
  checkPasswordConfirmation
} from './utils/validations.js';

const form = document.querySelector('.signup-form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');
  const passwordRepeatInput = document.querySelector('#password-repeat');

  const usernameError = checkUsername(usernameInput.value);
  const passwordError = checkPassword(passwordInput.value);
  const passwordRepeatError = checkPasswordConfirmation(
    passwordInput.value, passwordRepeatInput.value
  );

  if (usernameError) {
    console.log(usernameError);
  }

  if (passwordError) {
    console.log(passwordError);
  }

  if (passwordRepeatError) {
    console.log(passwordRepeatError);
  }
});