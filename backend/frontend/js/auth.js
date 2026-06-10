/**
 * TransportInfo — Auth & RBAC (client-side)
 * Roles: super_admin, transport_manager, operator, viewer
 */

const DEMO_USERS = [
  { id:1, username:'superadmin', password:'admin123',    name:'Yulduz Yusufova', role:'super_admin'       },
  { id:2, username:'manager',    password:'manager123',  name:'Yulduz Yusufova', role:'transport_manager' },
  { id:3, username:'operator',   password:'operator123', name:'Yulduz Yusufova', role:'operator'          },
  { id:4, username:'viewer',     password:'viewer123',   name:'Yulduz Yusufova', role:'viewer'            },
];

const ROLE_CONFIG = {
  super_admin: {
    label:'Super Admin', color:'red',
    pages:['*'], canEdit:true, canDelete:true, canAdmin:true,
  },
  transport_manager: {
    label:'Transport Manager', color:'amber',
    pages:['dashboard','routes','schedule','map','tickets','news','admin'],
    canEdit:true, canDelete:true, canAdmin:true,
  },
  operator: {
    label:'Operator', color:'blue',
    pages:['dashboard','tickets','news'],
    canEdit:true, canDelete:false, canAdmin:false,
  },
  viewer: {
    label:'Viewer', color:'green',
    pages:['dashboard','routes','schedule','map','tickets','news'],
    canEdit:false, canDelete:false, canAdmin:false,
  },
};

function getCurrentPage() {
  const p = location.pathname.split('/').pop() || 'index.html';
  if (p === 'index.html' || p === '') return 'dashboard';
  return p.replace('.html', '');
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('ti_user') || 'null'); }
  catch { return null; }
}

function authLogin(username, password) {
  const u = DEMO_USERS.find(x => x.username === username && x.password === password);
  if (!u) return false;
  const { password: _, ...safe } = u;
  localStorage.setItem('ti_user', JSON.stringify(safe));
  return true;
}

function authLogout() {
  localStorage.removeItem('ti_user');
  location.href = '/pages/login.html';
}

function applyRBAC() {
  const page = getCurrentPage();
  if (page === 'login') return; // login page has no guard

  const user = getCurrentUser();
  if (!user) { location.href = '/pages/login.html'; return; }

  const role = ROLE_CONFIG[user.role];
  if (!role) { authLogout(); return; }

  const allowed = role.pages.includes('*') || role.pages.includes(page);
  if (!allowed) { location.href = '/index.html'; return; }

  // Avatar initials
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  // Render user badge in header
  const badge = document.getElementById('user-badge');
  if (badge) {
    badge.innerHTML =
      '<div class="ub-avatar">' + initials + '</div>' +
      '<span class="ub-name">' + user.name.split(' ')[0] + '</span>' +
      '<span class="ub-role role-' + user.role + '">' + role.label + '</span>';
  }

  // Update sidebar user info
  const sui = document.getElementById('sidebar-user-info');
  if (sui) {
    sui.innerHTML =
      '<div class="su-name">' + user.name + '</div>' +
      '<div class="su-role role-' + user.role + '">' + role.label + '</div>';
  }

  // Update sidebar avatar initials
  const suAvatar = document.getElementById('su-avatar');
  if (suAvatar) suAvatar.textContent = initials;

  // Show/hide sidebar nav links by data-page
  document.querySelectorAll('[data-page]').forEach(link => {
    const lp = link.getAttribute('data-page');
    const ok = role.pages.includes('*') || role.pages.includes(lp);
    link.classList.toggle('rbac-hidden', !ok);
  });

  // Hide elements requiring edit/delete perms
  if (!role.canEdit) {
    document.querySelectorAll('[data-require="edit"]').forEach(el => { el.style.display='none'; });
  }
  if (!role.canDelete) {
    document.querySelectorAll('[data-require="delete"]').forEach(el => { el.style.display='none'; });
  }
  if (!role.canAdmin) {
    document.querySelectorAll('[data-require="admin"]').forEach(el => { el.style.display='none'; });
  }

  // Add read-only overlay for viewer
  if (!role.canEdit) {
    document.querySelectorAll('form, .admin-form').forEach(f => {
      f.style.pointerEvents = 'none';
      f.style.opacity = '0.5';
    });
  }
}

// Run on every page load (except login)
document.addEventListener('DOMContentLoaded', applyRBAC);
