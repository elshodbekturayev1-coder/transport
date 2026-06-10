/**
 * TransportInfo v2 — Shared Utilities
 */

// ── THEME ────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('ti_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ti_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// ── CLOCK ─────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const n = new Date();
  el.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map(x => String(x).padStart(2, '0')).join(':');
}
updateClock();
setInterval(updateClock, 1000);

// ── DATE ──────────────────────────────────────────────
function setTodayDate() {
  const el = document.getElementById('today-date');
  if (el) el.textContent = new Date().toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' });
}
setTodayDate();

// ── SIDEBAR ───────────────────────────────────────────
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const isOpen   = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !isOpen);
  if (overlay) overlay.classList.toggle('visible', !isOpen);
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('visible');
}

// Close sidebar when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);
});

// ── ACTIVE NAV ────────────────────────────────────────
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
})();

// ── STATUS HELPERS ─────────────────────────────────────
function statusBadge(status) {
  const map = {
    active:  ['badge-ok',    'Faol'],
    delay:   ['badge-delay', 'Kechikmoqda'],
    stopped: ['badge-stop',  "To'xtatildi"],
    passed:  ['badge-ok',    "O'tdi"],
    coming:  ['badge-delay', 'Kelmoqda'],
    pending: ['badge-muted', '—'],
  };
  const [cls, label] = map[status] || ['badge-muted', status];
  return '<span class="badge ' + cls + '">' + label + '</span>';
}

function typeClass(type) {
  return { bus:'type-bus', metro:'type-metro', tram:'type-tram' }[type] || 'type-bus';
}

function typeLabel(type) {
  return { bus:'Avtobus', metro:'Metro', tram:'Tramvay' }[type] || type;
}

function typeEmoji(type) {
  return { bus:'🚌', metro:'🚇', tram:'🚋' }[type] || '🚌';
}

function refreshData() { location.reload(); }

function swapFields() {
  const f = document.getElementById('from');
  const t = document.getElementById('to');
  if (f && t) { const tmp = f.value; f.value = t.value; t.value = tmp; }
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg, type) {
  type = type || 'ok';
  const icons = { ok:'✓', err:'✕', warn:'⚠', info:'ℹ' };
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span>' + (icons[type] || '') + '</span><span>' + msg + '</span>';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn .2s ease reverse';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// ── LOADING HELPERS ────────────────────────────────────
function setLoading(containerId, rows) {
  const el = document.getElementById(containerId);
  if (!el) return;
  rows = rows || 3;
  el.innerHTML = Array.from({ length: rows }, () =>
    '<div style="padding:14px 20px;border-bottom:1px solid var(--border)">' +
    '<div class="skeleton" style="height:14px;width:60%;margin-bottom:8px"></div>' +
    '<div class="skeleton" style="height:10px;width:40%"></div></div>'
  ).join('');
}
