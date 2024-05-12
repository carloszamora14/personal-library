import {
  checkUsername,
  checkEmail,
  checkPassword,
  checkPasswordConfirmation
} from './utils/validations.js';

const form = document.querySelector('.signup-form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const usernameInput = document.querySelector('#username');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const passwordRepeatInput = document.querySelector('#password-repeat');

  const usernameError = checkUsername(usernameInput.value);
  const emailError = checkEmail(emailInput.value);
  const passwordError = checkPassword(passwordInput.value);
  const passwordRepeatError = checkPasswordConfirmation(
    passwordInput.value, passwordRepeatInput.value
  );

  const usernameErrorMsg = document.querySelector('#username-error');
  const emailErrorMsg = document.querySelector('#email-error');
  const passwordErrorMsg = document.querySelector('#password-error');
  const passwordRepeatErrorMsg = document.querySelector('#password-repeat-error');

  usernameErrorMsg.textContent = usernameError;
  emailErrorMsg.textContent = emailError;
  passwordErrorMsg.textContent = passwordError;
  passwordRepeatErrorMsg.textContent = passwordRepeatError;
});