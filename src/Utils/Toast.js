/* global toasteo */
export default function toast(message = '', type = 'info') {
  return toasteo[type || 'info'](message);
}
