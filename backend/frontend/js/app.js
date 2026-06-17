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

// ── SIDEBAR BUILDER ───────────────────────────────────────────
function buildSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const isActive = (href) => href.split('/').pop() === path ? ' active' : '';

  const SVG = {
    dashboard: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    routes:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M5 16V7a4 4 0 0 1 4-4h4"/><path d="m15 5 4 1-1 4"/></svg>`,
    schedule:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>`,
    map:       `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
    tickets:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-4-4z"/><polyline points="15 5 15 9 19 9"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="11" x2="12" y2="11"/></svg>`,
    news:      `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/></svg>`,
    admin:     `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  };

  function navLink(href, page, label, extra) {
    return `<a href="${href}" class="nav-link${isActive(href)}${extra||''}" data-page="${page}">${SVG[page]}${label}</a>`;
  }

  sb.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="10" fill="#8b5cf6"/>
          <path d="M6 22h20M8 22V14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="11" cy="23.5" r="1.5" fill="white"/>
          <circle cx="21" cy="23.5" r="1.5" fill="white"/>
          <path d="M10 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="sidebar-logo-text">TransportInfo<div class="sidebar-logo-sub">v2.0</div></div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Asosiy</div>
      ${navLink('/index.html','dashboard','Dashboard')}
      ${navLink('/pages/routes.html','routes','Marshrutlar')}
      ${navLink('/pages/schedule.html','schedule','Jadval')}
      ${navLink('/pages/map.html','map','Xarita')}
      <div class="nav-section-label">Xizmatlar</div>
      ${navLink('/pages/tickets.html','tickets','Chipta')}
      ${navLink('/pages/news.html','news','Yangiliklar')}
      ${navLink('/pages/admin.html','admin','Admin Panel',' nav-link-admin')}
    </nav>
    <div class="sidebar-footer">
      <div id="backend-status"></div>
      <div class="sidebar-user">
        <div class="su-info">
          <div class="su-avatar" id="su-avatar">??</div>
          <div id="sidebar-user-info"></div>
        </div>
        <button class="btn-logout" onclick="authLogout()">→</button>
      </div>
      <div class="live-indicator"><span class="pulse"></span><span id="clock">00:00:00</span></div>
    </div>
  `;
}

// ── AUDIT LOG ──────────────────────────────────────────────────
function auditLog(action, detail) {
  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const entries = JSON.parse(localStorage.getItem('ti_audit') || '[]');
  entries.unshift({ ts: new Date().toISOString(), user: user?.name || 'Tizim', role: user?.role || '—', action, detail: detail || '' });
  localStorage.setItem('ti_audit', JSON.stringify(entries.slice(0, 50)));
}

function getAuditLog() {
  return JSON.parse(localStorage.getItem('ti_audit') || '[]');
}

// ── CSV EXPORT ─────────────────────────────────────────────────
function exportCSV(rows, filename) {
  if (!rows || !rows.length) { showToast("Eksport uchun ma'lumot yo'q", 'warn'); return; }
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => '"' + String(r[k] ?? '').replace(/"/g, '""') + '"').join(','))].join('\n');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })), download: filename });
  a.click(); URL.revokeObjectURL(a.href);
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
