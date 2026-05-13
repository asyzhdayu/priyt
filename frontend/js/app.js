// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('shelter_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('shelter_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== TOAST =====
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
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: '💬' };
  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== MODAL =====
let activeModal = null;

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  activeModal = id;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(id);
  });
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  activeModal = null;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeModal) closeModal(activeModal);
});

// ===== NAVBAR =====
function initNavbar() {
  initTheme();
  updateNavbarAuth();

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
    });
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

function updateNavbarAuth() {
  const user = getCurrentUser();
  const navAuth = document.getElementById('navAuth');
  const navProfile = document.getElementById('navProfile');
  const navAdmin = document.getElementById('navAdmin');

  if (user) {
    if (navAuth) navAuth.style.display = 'none';
    if (navProfile) {
      navProfile.style.display = 'flex';
      const nameEl = navProfile.querySelector('.nav-username');
      if (nameEl) nameEl.textContent = user.name.split(' ')[0];
    }
    if (navAdmin && (user.role === 'admin' || user.role === 'manager')) {
      navAdmin.style.display = 'inline-flex';
      navAdmin.textContent = user.role === 'admin' ? '⚙️ Админ' : '📋 Панель';
    }
  } else {
    if (navAuth) navAuth.style.display = 'flex';
    if (navProfile) navProfile.style.display = 'none';
    if (navAdmin) navAdmin.style.display = 'none';
  }
}

// ===== PHOTO UPLOAD =====
function initPhotoUpload(inputId, previewId, onLoad) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input) return;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Пожалуйста, выберите изображение', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Файл слишком большой (макс. 5MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      if (preview) {
        preview.innerHTML = `
          <div class="photo-preview">
            <img src="${data}" alt="Preview">
            <button class="photo-preview-remove" onclick="removePhotoPreview('${inputId}','${previewId}')">✕</button>
          </div>
        `;
      }
      if (onLoad) onLoad(data);
    };
    reader.readAsDataURL(file);
  };

  input.addEventListener('change', (e) => handleFile(e.target.files[0]));

  // Drag & drop
  const area = input.closest('.photo-upload-area');
  if (area) {
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
      handleFile(e.dataTransfer.files[0]);
    });
  }
}

function removePhotoPreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (input) input.value = '';
  if (preview) preview.innerHTML = '';
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone.replace(/\D/g, '').length >= 10;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--error)';
  let errEl = field.parentElement.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'form-error';
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '';
  const errEl = field.parentElement.querySelector('.form-error');
  if (errEl) errEl.remove();
}

// ===== PET CARD HTML =====
function renderPetCard(pet, showAdminActions = false) {
  const fav = isFavorite(pet.id);
  const photoHtml = pet.photo
    ? `<img src="${pet.photo}" class="pet-photo" alt="${pet.name}">`
    : `<div class="pet-photo-placeholder" style="background:${generatePetPlaceholderBg(pet.species)}">
         <span class="pet-emoji">${getSpeciesEmoji(pet.species)}</span>
         <span>Фото скоро</span>
       </div>`;

  const tagsHtml = [
    pet.vaccinated ? `<span class="pet-tag tag-vaccinated">💉 Привит</span>` : '',
    pet.sterilized ? `<span class="pet-tag tag-sterilized">✂️ Стерилизован</span>` : '',
    `<span class="pet-tag ${pet.gender === 'male' ? 'tag-male' : 'tag-female'}">${pet.gender === 'male' ? '♂ Мальчик' : '♀ Девочка'}</span>`
  ].filter(Boolean).join('');

  const adminActionsHtml = showAdminActions ? `
    <button class="btn btn-ghost btn-sm" onclick="editPet('${pet.id}')">✏️ Ред.</button>
    <button class="btn btn-sm" style="background:rgba(214,64,64,0.1);color:var(--error)" onclick="confirmDeletePet('${pet.id}')">🗑️</button>
  ` : `
    <button class="btn btn-primary btn-sm" onclick="openPetModal('${pet.id}')" style="flex:1">Подробнее</button>
    ${pet.status === 'available'
      ? `<button class="btn btn-secondary btn-sm" onclick="goToAdopt('${pet.id}')">Взять домой</button>`
      : ''}
  `;

  return `
    <div class="pet-card" id="card_${pet.id}">
      <div class="pet-photo-wrap">
        ${photoHtml}
        <span class="pet-status-badge status-${pet.status}">${getStatusLabel(pet.status)}</span>
        <button class="pet-fav-btn ${fav ? 'active' : ''}" onclick="handleFavorite('${pet.id}', this)" title="${fav ? 'Убрать из избранного' : 'В избранное'}">
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
    </div>
  `;
}

// ===== PET MODAL =====
function openPetModal(petId) {
  const pet = getPetById(petId);
  if (!pet) return;

  const modal = document.getElementById('petModal');
  if (!modal) return;

  const fav = isFavorite(pet.id);

  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeModal('petModal')">✕</button>
      ${pet.photo
        ? `<img src="${pet.photo}" class="modal-pet-photo" alt="${pet.name}">`
        : `<div class="modal-pet-photo-placeholder" style="background:${generatePetPlaceholderBg(pet.species)}">${getSpeciesEmoji(pet.species)}</div>`
      }
      <div class="modal-body">
        <div class="modal-pet-header">
          <h2 class="modal-pet-name">${pet.name}</h2>
          <span class="pet-status-badge status-${pet.status}">${getStatusLabel(pet.status)}</span>
        </div>
        <div style="color:var(--brown-mid);font-size:.9rem;margin-bottom:16px">${getSpeciesLabel(pet.species)} · ${pet.breed} · ${pet.color}</div>
        <div class="modal-pet-meta">
          <div class="modal-meta-item">
            <div class="modal-meta-label">Возраст</div>
            <div class="modal-meta-value">${formatAge(pet.age, pet.ageUnit)}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Пол</div>
            <div class="modal-meta-value">${getGenderLabel(pet.gender)}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Размер</div>
            <div class="modal-meta-value">${getSizeLabel(pet.size)}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Вакцинация</div>
            <div class="modal-meta-value">${pet.vaccinated ? '✅ Да' : '❌ Нет'}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Стерилизация</div>
            <div class="modal-meta-value">${pet.sterilized ? '✅ Да' : '❌ Нет'}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">В приюте с</div>
            <div class="modal-meta-value">${formatDate(pet.dateAdded)}</div>
          </div>
        </div>
        <p class="modal-description">${pet.description}</p>
        <div class="modal-actions">
          ${pet.status === 'available'
            ? `<button class="btn btn-primary btn-lg" onclick="goToAdopt('${pet.id}')">🏠 Взять домой</button>`
            : ''
          }
          <button class="btn btn-outline" onclick="handleFavorite('${pet.id}', null, true)" id="modalFavBtn">
            ${fav ? '❤️ В избранном' : '🤍 В избранное'}
          </button>
          <button class="btn btn-ghost" onclick="closeModal('petModal')">Закрыть</button>
        </div>
      </div>
    </div>
  `;

  openModal('petModal');
}

function handleFavorite(petId, btn, fromModal = false) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Войдите, чтобы добавить в избранное', 'warning');
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    return;
  }

  const added = toggleFavorite(petId);

  if (btn) {
    btn.classList.toggle('active', added);
    btn.textContent = added ? '❤️' : '🤍';
    btn.title = added ? 'Убрать из избранного' : 'В избранное';
  }

  if (fromModal) {
    const modalBtn = document.getElementById('modalFavBtn');
    if (modalBtn) {
      modalBtn.innerHTML = added ? '❤️ В избранном' : '🤍 В избранное';
    }
    // Also update card button
    const cardBtn = document.querySelector(`#card_${petId} .pet-fav-btn`);
    if (cardBtn) {
      cardBtn.classList.toggle('active', added);
      cardBtn.textContent = added ? '❤️' : '🤍';
    }
  }

  showToast(added ? `${getPetById(petId)?.name} добавлен в избранное` : 'Убрано из избранного', added ? 'success' : 'info');
}

function goToAdopt(petId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Войдите, чтобы подать заявку', 'warning');
    setTimeout(() => { window.location.href = 'login.html?redirect=adopt&pet=' + petId; }, 1000);
    return;
  }
  window.location.href = `adopt.html?pet=${petId}`;
}

// ===== REQUIRE AUTH =====
function requireAuth(redirectTo = 'login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
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