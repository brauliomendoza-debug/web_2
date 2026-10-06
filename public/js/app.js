const API = '/api';

/* ---------- Sesión ---------- */
const Auth = {
  save(token, user) { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); },
  token() { return localStorage.getItem('token'); },
  user() { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } },
  logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = '/index.html'; },
};

/* ---------- Llamadas a la API (con JWT) ---------- */
async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (Auth.token()) headers.Authorization = 'Bearer ' + Auth.token();
  const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch {}
  if (res.status === 401 && Auth.token()) Auth.logout(); // token vencido
  if (!res.ok) throw new Error((data && data.message) || 'Error en la solicitud');
  return data;
}

/* ---------- Protección de páginas por rol ---------- */
function requireAuth(roles) {
  const u = Auth.user();
  if (!Auth.token() || !u) { location.href = '/index.html'; return null; }
  if (roles && !roles.includes(u.rol)) { location.href = '/menu.html'; return null; }
  return u;
}

/* ---------- Barra de navegación según el rol ---------- */
const TODOS = ['administrador', 'moderador', 'usuario'];
const ITEMS = [
  { href: '/menu.html', texto: 'Menú principal', roles: TODOS },
  { href: '/medicamentos.html', texto: 'Medicamentos', roles: TODOS },
  { href: '/categorias.html', texto: 'Categorías', roles: ['administrador', 'moderador'] },
  { href: '/usuarios.html', texto: 'Usuarios', roles: ['administrador'] },
];
function renderNavbar() {
  const u = Auth.user();
  const nav = document.getElementById('navbar');
  if (!u || !nav) return;
  const links = ITEMS.filter((i) => i.roles.includes(u.rol))
    .map((i) => `<a href="${i.href}" class="${location.pathname === i.href ? 'active' : ''}">${i.texto}</a>`).join('');
  nav.innerHTML = `<span class="brand">Farmacia</span>
    <div class="nav-links">${links}</div>
    <div class="nav-account">
      <span class="who"><span class="who-name">${esc(u.nombre)}</span><span class="badge ${esc(u.rol)}">${esc(u.rol)}</span></span>
      <button id="btnLogout">Cerrar sesión</button>
    </div>`;
  document.getElementById('btnLogout').addEventListener('click', Auth.logout);
}

/* ---------- Utilidades ---------- */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function showAlert(msg, type = 'err') {
  const el = document.getElementById('alert');
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert ' + type;
}
function clearErrors(form) {
  form.querySelectorAll('.error').forEach((e) => (e.textContent = ''));
  form.querySelectorAll('input,select').forEach((i) => i.classList.remove('invalid'));
  const a = document.getElementById('alert'); if (a) a.className = 'alert';
}
function fieldError(form, name, msg) {
  form.querySelector(`[data-error="${name}"]`).textContent = msg;
  form.elements[name].classList.add('invalid');
}
