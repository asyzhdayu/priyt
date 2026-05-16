const API_URL = 'https://shelterr-production.up.railway.app';

// ── Простой in-memory кеш для GET-запросов ──────────────────────────────────
const _cache = new Map();
const CACHE_TTL = 30_000; // 30 сек

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { _cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key, data) {
  _cache.set(key, { data, ts: Date.now() });
}

function cacheClear(prefix) {
  for (const key of _cache.keys()) {
    if (!prefix || key.startsWith(prefix)) _cache.delete(key);
  }
}

// ── Keep-alive: пингуем сервер каждые 10 мин, чтобы Railway не засыпал ──────
(function keepAlive() {
  setInterval(() => {
    fetch(API_URL + '/api/health', { method: 'GET' }).catch(() => {});
  }, 10 * 60 * 1000);
})();

// ── Базовый fetch ─────────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('shelter_token');
}
function setToken(token) {
  if (token) localStorage.setItem('shelter_token', token);
  else localStorage.removeItem('shelter_token');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const isGet = !options.method || options.method === 'GET';
  const cacheKey = path;

  if (isGet) {
    const cached = cacheGet(cacheKey);
    if (cached) return cached;
  }

  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');

  if (isGet) cacheSet(cacheKey, data);
  return data;
}

// Мутации сбрасывают кеш нужного раздела
async function apiMutate(path, options) {
  const section = path.split('/')[2]; // pets | users | applications
  const data = await apiFetch(path, options);
  cacheClear('/api/' + section);
  return data;
}

// ── Питомцы ───────────────────────────────────────────────────────────────────
async function getPets() {
  return apiFetch('/api/pets');
}

async function filterPets({ search = '', species = 'all', status = 'all', gender = 'all', size = 'all', sort = 'newest' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (species !== 'all') params.set('species', species);
  if (status !== 'all') params.set('status', status);
  if (gender !== 'all') params.set('gender', gender);
  if (size !== 'all') params.set('size', size);
  params.set('sort', sort);
  return apiFetch('/api/pets?' + params.toString());
}

async function getPetById(id) {
  return apiFetch('/api/pets/' + id);
}

async function addPet(petData) {
  return apiMutate('/api/pets', { method: 'POST', body: JSON.stringify(petData) });
}

async function updatePet(id, updates) {
  return apiMutate('/api/pets/' + id, { method: 'PUT', body: JSON.stringify(updates) });
}

async function deletePet(id) {
  return apiMutate('/api/pets/' + id, { method: 'DELETE' });
}

async function getStats() {
  return apiFetch('/api/pets/stats');
}

// ── Авторизация ───────────────────────────────────────────────────────────────
async function registerUser({ name, email, password, phone, address, housingType, hasOtherPets }) {
  const data = await apiMutate('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone, address, housingType, hasOtherPets }),
  });
  setToken(data.token);
  setCurrentUser(data.user);
  return data.user;
}

async function loginUser(email, password) {
  const data = await apiMutate('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setCurrentUser(data.user);
  return data.user;
}

function logout() {
  setToken(null);
  localStorage.removeItem('shelter_current_user');
  cacheClear();
}

// ── Текущий пользователь ──────────────────────────────────────────────────────
function getCurrentUser() {
  const data = localStorage.getItem('shelter_current_user');
  return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
  if (user) {
    const safe = { ...user };
    delete safe.password;
    localStorage.setItem('shelter_current_user', JSON.stringify(safe));
  } else {
    localStorage.removeItem('shelter_current_user');
  }
}

function isAdmin()   { const u = getCurrentUser(); return u && u.role === 'admin'; }
function isManager() { const u = getCurrentUser(); return u && u.role === 'manager'; }
function isStaff()   { const u = getCurrentUser(); return u && (u.role === 'admin' || u.role === 'manager'); }

async function updateProfile(updates) {
  const data = await apiMutate('/api/users/me', { method: 'PUT', body: JSON.stringify(updates) });
  setCurrentUser(data);
  return data;
}

// ── Избранное ─────────────────────────────────────────────────────────────────
async function getFavorites() {
  if (!getCurrentUser()) return [];
  return apiFetch('/api/users/me/favorites');
}

async function toggleFavorite(petId) {
  const data = await apiMutate('/api/users/me/favorites/' + petId, { method: 'POST' });
  cacheClear('/api/users/me/favorites');
  return data.added;
}

async function isFavorite(petId) {
  const favs = await getFavorites();
  return favs.some(p => (p.id || p._id) === petId);
}

// ── Заявки ────────────────────────────────────────────────────────────────────
async function addApplication(appData) {
  return apiMutate('/api/applications', { method: 'POST', body: JSON.stringify(appData) });
}

async function getUserApplications() {
  return apiFetch('/api/applications/my');
}

async function getApplications() {
  return apiFetch('/api/applications');
}

async function updateApplication(id, updates) {
  return apiMutate('/api/applications/' + id + '/status', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ── Пользователи (admin) ──────────────────────────────────────────────────────
async function getUsers() {
  return apiFetch('/api/users');
}

async function createUser(userData) {
  return apiMutate('/api/users/admin/create', { method: 'POST', body: JSON.stringify(userData) });
}

async function deleteUser(id) {
  return apiMutate('/api/users/' + id, { method: 'DELETE' });
}

// ── Утилиты ───────────────────────────────────────────────────────────────────
function formatAge(age, unit) {
  if (unit === 'months') return `${age} мес.`;
  if (age === 1) return '1 год';
  if (age >= 2 && age <= 4) return `${age} года`;
  return `${age} лет`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function getSpeciesEmoji(species) {
  return { cat: '🐱', dog: '🐶', rabbit: '🐰', other: '🐾' }[species] || '🐾';
}

function getSpeciesLabel(species) {
  return { cat: 'Кошка', dog: 'Собака', rabbit: 'Кролик', other: 'Другое' }[species] || species;
}

function getGenderLabel(gender) { return gender === 'male' ? 'Мальчик' : 'Девочка'; }

function getSizeLabel(size) {
  return { small: 'Маленький', medium: 'Средний', large: 'Крупный' }[size] || size;
}

function getStatusLabel(status) {
  return { available: 'Ищет дом', reserved: 'Зарезервирован', adopted: 'Нашёл дом' }[status] || status;
}

function generatePetPlaceholderBg(species) {
  return {
    cat:    'linear-gradient(135deg, #F5D5B0, #E8B080)',
    dog:    'linear-gradient(135deg, #B8D4E8, #8ABDD4)',
    rabbit: 'linear-gradient(135deg, #D4E8B8, #AAD490)',
    other:  'linear-gradient(135deg, #E8D4F0, #C8A8E0)',
  }[species] || 'linear-gradient(135deg, #E8D4F0, #C8A8E0)';
}
