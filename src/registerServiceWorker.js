// if(process.env.NODE_ENV === 'production') {}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/build/service-worker.js');
  });
}
