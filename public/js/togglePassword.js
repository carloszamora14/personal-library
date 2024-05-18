function togglePassword(button) {
  const input = button.previousElementSibling;
  const img = button.querySelector('img');

  if (input.type === 'password') {
    img.src = img.src.replace('eye.png', 'hidden-eye.png');
    input.type = 'text';
    img.alt = 'Hide password';
  } else {
    img.src = img.src.replace('hidden-eye.png', 'eye.png');
    input.type = 'password';
    img.alt = 'Show password';
  }
}