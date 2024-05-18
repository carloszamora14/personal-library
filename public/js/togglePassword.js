function togglePassword(htmlElement) {
  const input = htmlElement.parentElement.querySelector('input');
  const img = htmlElement.querySelector('img');
  const srcArray = img.getAttribute('src').split('/');

  if (srcArray.pop() === 'eye.png') {
    srcArray.push('hidden-eye.png');
    input.setAttribute('type', 'text');
    img.setAttribute('alt', 'Hide password');
  } else {
    srcArray.push('eye.png');
    input.setAttribute('type', 'password');
    img.setAttribute('alt', 'Show password');
  }

  img.setAttribute('src', srcArray.join('/'));
}