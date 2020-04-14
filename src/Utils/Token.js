export function getToken() {
  if (!window.localStorage) {
    return false;
  }

  return window.localStorage.getItem('token');
}
