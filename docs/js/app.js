// ── Глобальный обработчик необработанных Promise-ошибок ──────────────────────
window.addEventListener('unhandledrejection', e => {
  const msg = e.reason?.message || String(e.reason) || 'Неизвестная ошибка';
  // Не показываем тост для 401 — там уже есть авто-logout
  if (msg.includes('Unauthorized') || msg.includes('401')) return;
  console.error('[unhandledrejection]', e.reason);
  if (typeof showToast === 'function') showToast('Что-то пошло не так. Попробуйте ещё раз.', 'error');
});

// ── Тема ──────────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('shelter_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('shelter_theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Тосты ─────────────────────────────────────────────────────────────────────
let toastContainer = null;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  getToastContainer().appendChild(toast);
  setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, duration);
}

// ── Модалки ───────────────────────────────────────────────────────────────────
let activeModal = null;
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  activeModal = id;
  // { once: true } — слушатель удаляется сам после первого срабатывания
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(id); }, { once: true });
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  activeModal = null;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && activeModal) closeModal(activeModal); });

// ── Navbar ────────────────────────────────────────────────────────────────────
function initNavbar() {
  initTheme();
  updateNavbarAuth();

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }
  document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  });
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 20);
  });
}

function updateNavbarAuth() {
  const user       = getCurrentUser();
  const navAuth    = document.getElementById('navAuth');
  const navProfile = document.getElementById('navProfile');
  const navAdmin   = document.getElementById('navAdmin');

  if (user) {
    if (navAuth)    navAuth.style.display = 'none';
    const navFavLink = document.getElementById('navFavLink');
    if (navFavLink) navFavLink.style.display = 'inline-flex';
    if (navProfile) {
      navProfile.style.display = 'flex';
      const nameEl = navProfile.querySelector('.nav-username');
      if (nameEl) nameEl.textContent = user.name.split(' ')[0];
    }
    if (navAdmin && (user.role === 'admin' || user.role === 'manager')) {
      navAdmin.style.display = 'inline-flex';
      navAdmin.textContent   = user.role === 'admin' ? '⚙️ Админ' : '📋 Панель';
    }
  } else {
    if (navAuth)    navAuth.style.display = 'flex';
    if (navProfile) navProfile.style.display = 'none';
    if (navAdmin)   navAdmin.style.display = 'none';
  }
}

// ── Фото upload ───────────────────────────────────────────────────────────────
function initPhotoUpload(inputId, previewId, onLoad) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const handleFile = file => {
    if (!file?.type.startsWith('image/')) { showToast('Выберите изображение', 'error'); return; }
    if (file.size > 5 * 1024 * 1024)     { showToast('Файл слишком большой (макс. 5MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
      const preview = document.getElementById(previewId);
      if (preview) preview.innerHTML = `
        <div class="photo-preview">
          <img src="${data}" alt="Preview">
          <button class="photo-preview-remove" onclick="removePhotoPreview('${inputId}','${previewId}')">✕</button>
        </div>`;
      if (onLoad) onLoad(data);
    };
    reader.readAsDataURL(file);
  };

  input.addEventListener('change', e => handleFile(e.target.files[0]));

  const area = input.closest('.photo-upload-area');
  if (area) {
    area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', ()  => area.classList.remove('drag-over'));
    area.addEventListener('drop',      e  => { e.preventDefault(); area.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });
  }
}
function removePhotoPreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (input)   input.value = '';
  if (preview) preview.innerHTML = '';
}

// ── Анимации ──────────────────────────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        animateCounter(e.target, parseInt(e.target.dataset.target));
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

// ── Валидация ─────────────────────────────────────────────────────────────────
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return phone.replace(/\D/g, '').length >= 10; }

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--error)';
  let errEl = field.parentElement.querySelector('.form-error');
  if (!errEl) { errEl = document.createElement('div'); errEl.className = 'form-error'; field.parentElement.appendChild(errEl); }
  errEl.textContent = message;
}
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '';
  field.parentElement.querySelector('.form-error')?.remove();
}

// ── Карточка питомца ─────────────────────────────────────────────────────────
// FIX: функция теперь async — isFavorite() возвращает Promise
async function renderPetCard(pet, showAdminActions = false) {
  const fav = await isFavorite(pet.id);   // << было sync, теперь await
  const photoHtml = pet.photo
    ? `<img src="${pet.photo}" class="pet-photo" alt="${pet.name}">`
    : `<div class="pet-photo-placeholder" style="background:${generatePetPlaceholderBg(pet.species)}">
         <span class="pet-emoji">${getSpeciesEmoji(pet.species)}</span>
         <span>Фото скоро</span>
       </div>`;

  const tagsHtml = [
    pet.vaccinated ? `<span class="pet-tag tag-vaccinated">💉 Привит</span>` : '',
    pet.sterilized ? `<span class="pet-tag tag-sterilized">✂️ Стерилизован</span>` : '',
    `<span class="pet-tag ${pet.gender === 'male' ? 'tag-male' : 'tag-female'}">${pet.gender === 'male' ? '♂ Мальчик' : '♀ Девочка'}</span>`,
  ].filter(Boolean).join('');

  const adminActionsHtml = showAdminActions
    ? `<button class="btn btn-ghost btn-sm" onclick="editPet('${pet.id}')">✏️ Ред.</button>
       <button class="btn btn-sm" style="background:rgba(214,64,64,0.1);color:var(--error)" onclick="confirmDeletePet('${pet.id}')">🗑️</button>`
    : `<button class="btn btn-primary btn-sm" onclick="openPetModal('${pet.id}')" style="flex:1">Подробнее</button>
       ${pet.status === 'available'
          ? `<button class="btn btn-secondary btn-sm" onclick="goToAdopt('${pet.id}')">Взять домой</button>`
          : ''}`;

  return `
    <div class="pet-card" id="card_${pet.id}">
      <div class="pet-photo-wrap">
        ${photoHtml}
        <span class="pet-status-badge status-${pet.status}">${getStatusLabel(pet.status)}</span>
        <button class="pet-fav-btn ${fav ? 'active' : ''}" onclick="handleFavorite('${pet.id}', this)" aria-label="${fav ? 'Убрать из избранного' : 'В избранное'}" title="${fav ? 'Убрать из избранного' : 'В избранное'}">
          ${fav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="pet-info">
        <div class="pet-name-row">
          <span class="pet-name">${pet.name}</span>
          <span class="pet-age">${formatAge(pet.age, pet.ageUnit)}</span>
        </div>
        <div class="pet-breed">${getSpeciesLabel(pet.species)} · ${pet.breed}</div>
        <div class="pet-tags">${tagsHtml}</div>
        <p class="pet-description">${pet.description}</p>
        <div class="pet-card-actions">${adminActionsHtml}</div>
      </div>
    </div>`;
}

// FIX: openPetModal теперь async — getPetById() возвращает Promise
async function openPetModal(petId) {
  const modal = document.getElementById('petModal');
  if (!modal) return;

  // Показываем скелетон пока грузим питомца
  modal.innerHTML = `<div class="modal" style="min-height:300px;display:flex;align-items:center;justify-content:center">
    <div style="text-align:center;padding:40px">
      <div style="width:48px;height:48px;border:4px solid var(--cream-dark);border-top-color:var(--terracotta);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
      <div style="color:var(--brown-mid);font-size:.9rem">Загружаем питомца...</div>
    </div>
  </div>`;
  openModal('petModal');

  let pet;
  try {
    pet = await getPetById(petId);   // << было sync getPetById, теперь await
  } catch (e) {
    modal.innerHTML = `<div class="modal"><p style="padding:32px;text-align:center">Не удалось загрузить питомца</p></div>`;
    return;
  }

  const fav = await isFavorite(pet.id);

  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeModal('petModal')" aria-label="Закрыть">✕</button>
      ${renderPhotoGallery(pet)}
      <div class="modal-body">
        <div class="modal-pet-header">
          <h2 class="modal-pet-name">${pet.name}</h2>
          <span class="pet-status-badge status-${pet.status}">${getStatusLabel(pet.status)}</span>
        </div>
        <div style="color:var(--brown-mid);font-size:.9rem;margin-bottom:16px">${getSpeciesLabel(pet.species)} · ${pet.breed} · ${pet.color}</div>
        <div class="modal-pet-meta">
          <div class="modal-meta-item"><div class="modal-meta-label">Возраст</div><div class="modal-meta-value">${formatAge(pet.age, pet.ageUnit)}</div></div>
          <div class="modal-meta-item"><div class="modal-meta-label">Пол</div><div class="modal-meta-value">${getGenderLabel(pet.gender)}</div></div>
          <div class="modal-meta-item"><div class="modal-meta-label">Размер</div><div class="modal-meta-value">${getSizeLabel(pet.size)}</div></div>
          <div class="modal-meta-item"><div class="modal-meta-label">Вакцинация</div><div class="modal-meta-value">${pet.vaccinated ? '✅ Да' : '❌ Нет'}</div></div>
          <div class="modal-meta-item"><div class="modal-meta-label">Стерилизация</div><div class="modal-meta-value">${pet.sterilized ? '✅ Да' : '❌ Нет'}</div></div>
          <div class="modal-meta-item"><div class="modal-meta-label">В приюте с</div><div class="modal-meta-value">${formatDate(pet.dateAdded)}</div></div>
        </div>
        <p class="modal-description">${pet.description}</p>
        <div class="modal-actions">
          ${pet.status === 'available'
            ? `<button class="btn btn-primary btn-lg" onclick="goToAdopt('${pet.id}')">🏠 Взять домой</button>`
            : ''}
          <button class="btn btn-outline" onclick="handleFavorite('${pet.id}', null, true)" id="modalFavBtn">
            ${fav ? '❤️ В избранном' : '🤍 В избранное'}
          </button>
          <button class="btn btn-ghost" onclick="closeModal('petModal')">Закрыть</button>
        </div>
      </div>
    </div>`;
}

// ── Избранное (хэндлер) ───────────────────────────────────────────────────────
async function handleFavorite(petId, btn, fromModal = false) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Войдите, чтобы добавить в избранное', 'warning');
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    return;
  }

  const added = await toggleFavorite(petId);

  if (btn) {
    btn.classList.toggle('active', added);
    btn.textContent = added ? '❤️' : '🤍';
    btn.title = added ? 'Убрать из избранного' : 'В избранное';
  }
  if (fromModal) {
    const modalBtn = document.getElementById('modalFavBtn');
    if (modalBtn) modalBtn.innerHTML = added ? '❤️ В избранном' : '🤍 В избранное';
    const cardBtn = document.querySelector(`#card_${petId} .pet-fav-btn`);
    if (cardBtn) { cardBtn.classList.toggle('active', added); cardBtn.textContent = added ? '❤️' : '🤍'; }
  }

  // FIX: getPetById теперь async
  const pet = await getPetById(petId).catch(() => null);
  showToast(added ? `${pet?.name ?? 'Питомец'} добавлен в избранное` : 'Убрано из избранного', added ? 'success' : 'info');
}

// ── Редиректы ─────────────────────────────────────────────────────────────────
function goToAdopt(petId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Войдите, чтобы подать заявку', 'warning');
    setTimeout(() => { window.location.href = 'login.html?redirect=adopt&pet=' + petId; }, 1000);
    return;
  }
  window.location.href = `adopt.html?pet=${petId}`;
}

function requireAuth(redirectTo = 'login.html') {
  const user = getCurrentUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}
function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    showToast('Доступ запрещён', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    return null;
  }
  return user;
}
function requireStaff() {
  const user = getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    showToast('Доступ запрещён', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    return null;
  }
  return user;
}

// ── Автокомплит поиска ────────────────────────────────────────────────────────
function initSearchAutocomplete(inputId, onSelect) {
  const input = document.getElementById(inputId);
  if (!input) return;

  let box = document.createElement('div');
  box.className = 'autocomplete-box';
  box.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--white);border:1.5px solid var(--cream-dark);border-top:none;border-radius:0 0 var(--radius-sm) var(--radius-sm);box-shadow:var(--shadow-md);z-index:200;display:none;max-height:280px;overflow-y:auto';
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(box);

  let debounceTimer = null;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (!q) { box.style.display = 'none'; return; }
    debounceTimer = setTimeout(async () => {
      const results = await searchSuggest(q).catch(() => []);
      if (!results.length) { box.style.display = 'none'; return; }
      box.innerHTML = results.map(p => `
        <div class="autocomplete-item" data-ac-id="${p.id}" data-ac-name="${p.name.replace(/"/g,'&quot;')}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--cream-dark);transition:background .15s"
          onmouseover="this.style.background='var(--cream)'" onmouseout="this.style.background=''">
          ${p.photo
            ? `<img src="${p.photo}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0">`
            : `<div style="width:36px;height:36px;border-radius:8px;background:${generatePetPlaceholderBg(p.species)};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${getSpeciesEmoji(p.species)}</div>`}
          <div>
            <div style="font-weight:700;font-size:.9rem">${p.name}</div>
            <div style="font-size:.75rem;color:var(--brown-mid)">${getSpeciesLabel(p.species)} · ${p.breed}</div>
          </div>
        </div>`).join('');
      box.style.display = 'block';
    }, 280);
  });

  document.addEventListener('click', e => { if (!input.parentElement.contains(e.target)) box.style.display = 'none'; });
  input.addEventListener('keydown', e => { if (e.key === 'Escape') box.style.display = 'none'; });

  // Делегированный обработчик — клик по любому item в box
  box.addEventListener('click', e => {
    const item = e.target.closest('[data-ac-id]');
    if (!item) return;
    input.value = item.dataset.acName;
    box.style.display = 'none';
    if (onSelect) onSelect(item.dataset.acId, item.dataset.acName);
  });
}

function handleAutocompleteSelect(id, name) {
  // Оставлено для обратной совместимости с inline onclick
  const box = document.querySelector('.autocomplete-box');
  const input = box?.previousElementSibling;
  if (input) input.value = name;
  if (box) box.style.display = 'none';
}

// ── Галерея фотографий в модалке питомца ──────────────────────────────────────
function renderPhotoGallery(pet) {
  const allPhotos = [pet.photo, ...(pet.photos || [])].filter(Boolean);
  if (allPhotos.length === 0) {
    return `<div class="modal-pet-photo-placeholder" style="background:${generatePetPlaceholderBg(pet.species)};height:280px;display:flex;align-items:center;justify-content:center;font-size:4rem">${getSpeciesEmoji(pet.species)}</div>`;
  }
  if (allPhotos.length === 1) {
    return `<img src="${allPhotos[0]}" class="modal-pet-photo" alt="${pet.name}" style="width:100%;max-height:320px;object-fit:cover">`;
  }
  const id = 'gallery_' + pet.id;
  return `
    <div id="${id}" style="position:relative;overflow:hidden;max-height:320px">
      <div class="gallery-track" style="display:flex;transition:transform .35s ease" id="${id}_track">
        ${allPhotos.map((src, i) => `<img src="${src}" alt="${pet.name} фото ${i+1}" style="width:100%;flex-shrink:0;max-height:320px;object-fit:cover">`).join('')}
      </div>
      ${allPhotos.length > 1 ? `
      <button onclick="galleryPrev('${id}')" aria-label="Предыдущее фото" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center">‹</button>
      <button onclick="galleryNext('${id}',${allPhotos.length})" aria-label="Следующее фото" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center">›</button>
      <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px" id="${id}_dots">
        ${allPhotos.map((_, i) => `<div onclick="galleryGoTo('${id}',${i},${allPhotos.length})" style="width:8px;height:8px;border-radius:50%;background:${i===0?'#fff':'rgba(255,255,255,.5)'};cursor:pointer;transition:.2s" id="${id}_dot_${i}"></div>`).join('')}
      </div>` : ''}
    </div>`;
}

let _galleryCurrent = {};
function galleryGoTo(id, idx, total) {
  _galleryCurrent[id] = idx;
  const track = document.getElementById(id + '_track');
  if (track) track.style.transform = `translateX(-${idx * 100}%)`;
  for (let i = 0; i < total; i++) {
    const dot = document.getElementById(id + '_dot_' + i);
    if (dot) dot.style.background = i === idx ? '#fff' : 'rgba(255,255,255,.5)';
  }
}
function galleryPrev(id) {
  const cur = _galleryCurrent[id] || 0;
  const track = document.getElementById(id + '_track');
  const total = track ? track.children.length : 1;
  galleryGoTo(id, (cur - 1 + total) % total, total);
}
function galleryNext(id, total) {
  const cur = _galleryCurrent[id] || 0;
  galleryGoTo(id, (cur + 1) % total, total);
}
