/* Small helpers shared by all files (attached to one namespace, no loose globals). */
const Utils = {
  money: (n) => Number(n).toFixed(2),
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
};
