function changeLocation(path) {
  const { protocol, hostname, port } = window.location;

  const newUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
  window.location.href = newUrl;
}

export default changeLocation;