import {
  checkUsername,
  checkEmail,
  checkPassword,
  checkPasswordConfirmation
} from './utils/validations.js';
import changeLocation from './utils/changeLocation.js';
import './utils/authHeader.js';

const form = document.querySelector('.signup-form');

form.addEventListener('submit', async evt => {
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

  if (usernameError || emailError || passwordError || passwordRepeatError) {
    return;
  }

  try {
    const jsonResponse = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        passwordConfirmation: passwordRepeatInput.value
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
        emailErrorMsg.textContent = inputValidation.email;
        passwordErrorMsg.textContent = inputValidation.password;
        passwordRepeatErrorMsg.textContent = inputValidation.passwordConfirmation;
      }
    } else {
      changeLocation('/login');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
});
