/**
 * TransportInfo v2 — Shared Utilities
 */

// Clock
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const n = new Date();
  el.textContent = [n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
}
updateClock();
setInterval(updateClock, 1000);

// Date
function setTodayDate() {
  const el = document.getElementById('today-date');
  if (el) el.textContent = new Date().toLocaleDateString('uz-UZ', {year:'numeric',month:'long',day:'numeric'});
}
setTodayDate();

// Sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Active nav
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
})();

// Status badge
function statusBadge(status) {
  const map = {
    active:  ['badge-ok',    'Faol'],
    delay:   ['badge-delay', 'Kechikmoqda'],
    stopped: ['badge-stop',  "To'xtatildi"],
    passed:  ['badge-ok',    "O'tdi"],
    coming:  ['badge-delay', 'Kelmoqda'],
    pending: ['badge-muted', '-'],
  };
  const [cls, label] = map[status] || ['', status];
  return '<span class="badge ' + cls + '">' + label + '</span>';
}

function typeClass(type) {
  return { bus:'type-bus', metro:'type-metro', tram:'type-tram' }[type] || 'type-bus';
}

function refreshData() { location.reload(); }

function swapFields() {
  const f = document.getElementById('from');
  const t = document.getElementById('to');
  if (f && t) { const tmp=f.value; f.value=t.value; t.value=tmp; }
}

// Toast notification
function showToast(msg, type) {
  type = type || 'ok';
  const colors = { ok:'var(--green)', err:'var(--red)', warn:'var(--amber)', info:'var(--blue)' };
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;color:#fff;background:' + (colors[type]||colors.ok) + ';box-shadow:0 4px 20px rgba(0,0,0,0.3);animation:fadeInUp 0.3s ease;max-width:320px;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
