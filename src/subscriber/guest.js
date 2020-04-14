export default function subscriber(store) {
  store.subscribe(() => {
    const state = store.getState();
    if (state.login.token && window.localStorage) {
      return window.localStorage.setItem('token', state.login.token);
    }

    return null;
  });
}
