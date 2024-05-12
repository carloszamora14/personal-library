function checkUsername(username) {
  let error = null;
  const alphanumericRegex = /^\w+$/;

  if (!username || username.trim() === '') {
    error = 'Username cannot be empty';
  } else if (!alphanumericRegex.test(username)) {
    error = 'Username can only contain letters, digits, and underscores';
  } else if (username.length < 3 || username.length > 30) {
    error = 'Username must be between 3 and 30 characters long';
  }

  return error;
}

function checkEmail(email) {
  let error = null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|mx)$/;

  if (!email || email.trim() === '') {
    error = 'Email cannot be empty';
  } else if (!emailRegex.test(email)) {
    error = 'Invalid email format';
  }

  return error;
}

function checkPassword(password) {
  let error = null;

  if (!password) {
    error = 'Username cannot be empty';
  } else if (password.length < 8 || password.length > 60) {
    error = 'Password must be between 8 and 60 characters long';
  }

  return error;
}

function checkPasswordConfirmation(password, passwordRepeat) {
  let error = null;

  if (password !== passwordRepeat) {
    error = 'Passwords must match';
  }

  return error;
}

export {
  checkUsername,
  checkEmail,
  checkPassword,
  checkPasswordConfirmation
};
