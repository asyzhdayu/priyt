/**
 * data.js — замена localStorage на API-запросы к бэкенду
 * Замените этот файл вместо старого js/data.js
 */

// ====================================================
// ВАЖНО: укажите URL вашего бэкенда на Railway
// Пример: 'https://shelter-backend-production.up.railway.app'
// При локальной разработке: 'http://localhost:3001'
// ====================================================
const API_URL = 'https://shelterr-backend-production.up.railway.app';

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

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

  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

// ===== ПИТОМЦЫ =====

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
  return apiFetch('/api/pets', { method: 'POST', body: JSON.stringify(petData) });
}

async function updatePet(id, updates) {
  return apiFetch('/api/pets/' + id, { method: 'PUT', body: JSON.stringify(updates) });
}

async function deletePet(id) {
  return apiFetch('/api/pets/' + id, { method: 'DELETE' });
}

async function getStats() {
  return apiFetch('/api/pets/stats');
}

// ===== АУТЕНТИФИКАЦИЯ =====

async function registerUser({ name, email, password, phone }) {
  const data = await apiFetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
  setToken(data.token);
  setCurrentUser(data.user);
  return data.user;
}

async function loginUser(email, password) {
  const data = await apiFetch('/api/users/login', {
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
}

// ===== ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ (кэш в localStorage) =====

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

function isAdmin() { const u = getCurrentUser(); return u && u.role === 'admin'; }
function isManager() { const u = getCurrentUser(); return u && u.role === 'manager'; }
function isStaff() { const u = getCurrentUser(); return u && (u.role === 'admin' || u.role === 'manager'); }

// ===== ПРОФИЛЬ =====

async function updateProfile(updates) {
  const data = await apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify(updates) });
  setCurrentUser(data);
  return data;
}

// ===== ИЗБРАННОЕ =====

async function getFavorites() {
  if (!getCurrentUser()) return [];
  return apiFetch('/api/users/me/favorites');
}

async function toggleFavorite(petId) {
  const data = await apiFetch('/api/users/me/favorites/' + petId, { method: 'POST' });
  return data.added; // true = добавлено, false = убрано
}

async function isFavorite(petId) {
  const favs = await getFavorites();
  return favs.some(p => (p.id || p._id) === petId);
}

// ===== ЗАЯВКИ =====

async function addApplication(appData) {
  return apiFetch('/api/applications', { method: 'POST', body: JSON.stringify(appData) });
}

async function getUserApplications() {
  return apiFetch('/api/applications/my');
}

async function getApplications() {
  return apiFetch('/api/applications');
}

async function updateApplication(id, updates) {
  return apiFetch('/api/applications/' + id + '/status', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ===== ПОЛЬЗОВАТЕЛИ (admin) =====

async function getUsers() {
  return apiFetch('/api/users');
}

async function createUser(userData) {
  return apiFetch('/api/users/admin/create', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

async function deleteUser(id) {
  return apiFetch('/api/users/' + id, { method: 'DELETE' });
}

// ===== HELPERS (без изменений) =====

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
    cat: 'linear-gradient(135deg, #F5D5B0, #E8B080)',
    dog: 'linear-gradient(135deg, #B8D4E8, #8ABDD4)',
    rabbit: 'linear-gradient(135deg, #D4E8B8, #AAD490)',
    other: 'linear-gradient(135deg, #E8D4F0, #C8A8E0)',
  }[species] || 'linear-gradient(135deg, #E8D4F0, #C8A8E0)';
}
