
window.addEventListener('fetch', async evt => {
  evt.respondWith(fetch(addJwtTokenToRequest(evt.request)));
});

window.addEventListener('popstate', evt => {
  interceptUrlChanges();
});

function addJwtTokenToRequest(request) {
  const jwtToken = localStorage.getItem('jwtToken');

  if (jwtToken) {
    const modifiedRequest = request.clone();
    modifiedRequest.headers.set('Authorization', `Bearer ${jwtToken}`);
    return modifiedRequest;
  }

  return request;
}

function interceptUrlChanges() {
  const currentDomain = window.location.origin;

  if (window.location.href.startsWith(currentDomain)) {
    window.location.href = addJwtTokenToRequest(new Request(window.location.href));
  }
}