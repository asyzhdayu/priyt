@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ===== CSS VARIABLES ===== */
:root {
  --cream: #FDF6EC;
  --cream-dark: #F5EAD6;
  --terracotta: #C4622D;
  --terracotta-light: #E8845A;
  --terracotta-dark: #9E4A1F;
  --sage: #5B7B5E;
  --sage-light: #7DA380;
  --sage-dark: #3F5941;
  --espresso: #1A0F0A;
  --brown: #3D2B1F;
  --brown-mid: #7A5C4A;
  --sand: #D4B896;
  --gold: #C9962A;
  --error: #D64040;
  --success: #4A9E6A;
  --warning: #D9892A;
  --white: #FEFCF8;
  --shadow-sm: 0 2px 8px rgba(61,43,31,0.08);
  --shadow-md: 0 6px 24px rgba(61,43,31,0.12);
  --shadow-lg: 0 16px 48px rgba(61,43,31,0.18);
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 36px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --cream: #1A0F0A;
  --cream-dark: #2A1A10;
  --white: #2A1A10;
  --brown: #F5EAD6;
  --brown-mid: #C8B49A;
  --sand: #5A4030;
  --espresso: #FDF6EC;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-md: 0 6px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.5);
}

/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: 'DM Sans', sans-serif;
  background-color: var(--cream);
  color: var(--brown);
  line-height: 1.6;
  transition: background-color 0.3s, color 0.3s;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button { cursor: pointer; font-family: inherit; border: none; }
input, select, textarea { font-family: inherit; }

/* ===== TYPOGRAPHY ===== */
h1, h2, h3, h4 { font-family: 'Playfair Display', serif; line-height: 1.2; }
h1 { font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 700; }
h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 600; }
h3 { font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 600; }
h4 { font-size: 1.1rem; font-weight: 600; }

/* ===== LAYOUT ===== */
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.section { padding: 80px 0; }

/* ===== NAVBAR ===== */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(253,246,236,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196,98,45,0.12);
  transition: var(--transition);
}

[data-theme="dark"] .navbar {
  background: rgba(26,15,10,0.85);
  border-bottom-color: rgba(196,98,45,0.2);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--terracotta);
}

.navbar-brand .brand-icon {
  width: 40px; height: 40px;
  background: var(--terracotta);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--brown-mid);
  transition: var(--transition);
}

.nav-link:hover, .nav-link.active {
  color: var(--terracotta);
  background: rgba(196,98,45,0.08);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--cream-dark);
  color: var(--brown);
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
  border: 1px solid var(--sand);
}

.theme-toggle:hover { background: var(--terracotta); color: #fff; }

.hamburger {
  display: none;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--cream-dark);
  color: var(--brown);
  font-size: 1.1rem;
  align-items: center; justify-content: center;
  transition: var(--transition);
  border: 1px solid var(--sand);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition);
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  opacity: 0;
  transition: opacity 0.2s;
}

.btn:hover::after { opacity: 1; }

.btn-primary {
  background: var(--terracotta);
  color: #fff;
  box-shadow: 0 4px 16px rgba(196,98,45,0.35);
}

.btn-primary:hover {
  background: var(--terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196,98,45,0.45);
}

.btn-secondary {
  background: var(--sage);
  color: #fff;
  box-shadow: 0 4px 16px rgba(91,123,94,0.35);
}

.btn-secondary:hover {
  background: var(--sage-dark);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--terracotta);
  border: 2px solid var(--terracotta);
}

.btn-outline:hover {
  background: var(--terracotta);
  color: #fff;
  transform: translateY(-2px);
}

.btn-ghost {
  background: rgba(196,98,45,0.08);
  color: var(--terracotta);
}

.btn-ghost:hover {
  background: rgba(196,98,45,0.16);
}

.btn-sm { padding: 8px 16px; font-size: 0.82rem; }
.btn-lg { padding: 16px 32px; font-size: 1rem; }

.btn-icon {
  width: 40px; height: 40px;
  padding: 0;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

/* ===== HERO ===== */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 72px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 70% 40%, rgba(196,98,45,0.12) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 20% 70%, rgba(91,123,94,0.1) 0%, transparent 60%);
  z-index: 0;
}

.hero-paws {
  position: absolute;
  opacity: 0.04;
  font-size: 8rem;
  right: 8%;
  top: 15%;
  transform: rotate(-15deg);
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

@keyframes float {
  0%, 100% { transform: rotate(-15deg) translateY(0); }
  50% { transform: rotate(-15deg) translateY(-20px); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(196,98,45,0.1);
  border: 1px solid rgba(196,98,45,0.2);
  color: var(--terracotta);
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 20px;
  animation: fadeInUp 0.6s ease both;
}

.hero h1 {
  animation: fadeInUp 0.6s 0.1s ease both;
  margin-bottom: 20px;
}

.hero h1 em {
  font-style: italic;
  color: var(--terracotta);
}

.hero p {
  font-size: 1.1rem;
  color: var(--brown-mid);
  margin-bottom: 36px;
  animation: fadeInUp 0.6s 0.2s ease both;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s 0.3s ease both;
}

.hero-stats {
  display: flex;
  gap: 36px;
  margin-top: 56px;
  animation: fadeInUp 0.6s 0.4s ease both;
}

.hero-stat-item { text-align: center; }

.hero-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--terracotta);
  display: block;
}

.hero-stat-label {
  font-size: 0.82rem;
  color: var(--brown-mid);
  font-weight: 500;
}

.hero-visual {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48%;
  z-index: 0;
}

.hero-card-float {
  position: absolute;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  animation: floatCard 4s ease-in-out infinite;
}

.hero-card-float:nth-child(2) { animation-delay: -2s; }

@keyframes floatCard {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.hero-card-float .card-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
}

/* ===== STATS BAR ===== */
.stats-bar {
  background: var(--espresso);
  padding: 36px 0;
  position: relative;
  z-index: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.stat-item {
  text-align: center;
  color: var(--white);
}

.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--terracotta-light);
  display: block;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 6px;
  font-weight: 400;
}

/* ===== SEARCH & FILTER ===== */
.catalog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.catalog-title h2 { margin-bottom: 4px; }
.catalog-title p { color: var(--brown-mid); font-size: 0.95rem; }

.search-bar {
  display: flex;
  align-items: center;
  background: var(--white);
  border: 2px solid var(--cream-dark);
  border-radius: 50px;
  padding: 8px 8px 8px 20px;
  gap: 8px;
  transition: var(--transition);
  min-width: 280px;
  box-shadow: var(--shadow-sm);
}

.search-bar:focus-within {
  border-color: var(--terracotta);
  box-shadow: 0 0 0 4px rgba(196,98,45,0.1);
}

.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  flex: 1;
  color: var(--brown);
}

.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.filter-chip {
  padding: 8px 16px;
  border-radius: 50px;
  border: 2px solid var(--cream-dark);
  background: var(--white);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--brown-mid);
  cursor: pointer;
  transition: var(--transition);
}

.filter-chip:hover { border-color: var(--terracotta); color: var(--terracotta); }
.filter-chip.active {
  background: var(--terracotta);
  border-color: var(--terracotta);
  color: #fff;
}

.filter-select {
  padding: 8px 16px;
  border-radius: 50px;
  border: 2px solid var(--cream-dark);
  background: var(--white);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--brown-mid);
  cursor: pointer;
  transition: var(--transition);
  outline: none;
  appearance: none;
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A5C4A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.filter-select:focus { border-color: var(--terracotta); }

/* ===== PET CARDS ===== */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.pet-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  border: 1px solid rgba(196,98,45,0.06);
  animation: fadeInUp 0.5s ease both;
}

.pet-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.pet-photo-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: var(--cream-dark);
}

.pet-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.pet-card:hover .pet-photo { transform: scale(1.05); }

.pet-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pet-photo-placeholder .pet-emoji { font-size: 4rem; }
.pet-photo-placeholder span { font-size: 0.8rem; color: var(--brown-mid); opacity: 0.6; }

.pet-status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-available { background: rgba(74,158,106,0.9); color: #fff; }
.status-reserved { background: rgba(201,150,42,0.9); color: #fff; }
.status-adopted { background: rgba(122,92,74,0.9); color: #fff; }

.pet-fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(253,246,236,0.9);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  transition: var(--transition);
  border: none;
}

.pet-fav-btn:hover { transform: scale(1.15); }
.pet-fav-btn.active { background: var(--terracotta); color: #fff; }

.pet-info { padding: 20px; }

.pet-name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.pet-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--brown);
}

.pet-age {
  font-size: 0.8rem;
  color: var(--brown-mid);
  background: var(--cream-dark);
  padding: 3px 10px;
  border-radius: 50px;
  font-weight: 500;
  white-space: nowrap;
}

.pet-breed {
  font-size: 0.85rem;
  color: var(--brown-mid);
  margin-bottom: 12px;
}

.pet-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.pet-tag {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 50px;
  font-weight: 500;
}

.tag-vaccinated { background: rgba(91,123,94,0.12); color: var(--sage-dark); }
.tag-sterilized { background: rgba(196,98,45,0.1); color: var(--terracotta-dark); }
.tag-male { background: rgba(70,130,180,0.1); color: #2E6B9E; }
.tag-female { background: rgba(210,100,150,0.1); color: #C2556E; }

.pet-description {
  font-size: 0.85rem;
  color: var(--brown-mid);
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pet-card-actions {
  display: flex;
  gap: 8px;
}

/* ===== PET MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,15,10,0.6);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}

.modal {
  background: var(--white);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(30px) scale(0.96);
  transition: transform 0.3s ease;
  position: relative;
}

.modal-overlay.active .modal {
  transform: translateY(0) scale(1);
}

.modal-close {
  position: absolute;
  top: 20px; right: 20px;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--cream-dark);
  border: none;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  z-index: 1;
  color: var(--brown);
}

.modal-close:hover { background: var(--terracotta); color: #fff; }

.modal-pet-photo {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.modal-pet-photo-placeholder {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  background: var(--cream-dark);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.modal-body { padding: 32px; }

.modal-pet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.modal-pet-name {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
}

.modal-pet-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 20px 0;
  background: var(--cream-dark);
  border-radius: var(--radius-md);
  padding: 16px;
}

.modal-meta-item { text-align: center; }
.modal-meta-label { font-size: 0.75rem; color: var(--brown-mid); text-transform: uppercase; letter-spacing: 0.06em; }
.modal-meta-value { font-weight: 600; margin-top: 4px; }

.modal-description {
  color: var(--brown-mid);
  line-height: 1.7;
  margin-bottom: 24px;
}

.modal-actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* ===== FORMS ===== */
.form-section {
  padding: 100px 0;
}

.form-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow-md);
  max-width: 640px;
  margin: 0 auto;
}

.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin-bottom: 8px;
}

.form-subtitle {
  color: var(--brown-mid);
  margin-bottom: 36px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brown);
  margin-bottom: 8px;
}

.form-label .required { color: var(--terracotta); margin-left: 2px; }

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--cream-dark);
  border-radius: var(--radius-sm);
  background: var(--cream);
  color: var(--brown);
  font-size: 0.9rem;
  transition: var(--transition);
  outline: none;
}

.form-control:focus {
  border-color: var(--terracotta);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(196,98,45,0.08);
}

.form-control::placeholder { color: var(--sand); }

textarea.form-control { resize: vertical; min-height: 100px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.form-check {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-check input[type="checkbox"] {
  width: 18px; height: 18px;
  accent-color: var(--terracotta);
  cursor: pointer;
}

.form-error {
  font-size: 0.8rem;
  color: var(--error);
  margin-top: 4px;
}

/* Photo Upload */
.photo-upload-area {
  border: 2px dashed var(--sand);
  border-radius: var(--radius-md);
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  background: var(--cream);
  position: relative;
}

.photo-upload-area:hover, .photo-upload-area.drag-over {
  border-color: var(--terracotta);
  background: rgba(196,98,45,0.04);
}

.photo-upload-area input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.photo-upload-icon { font-size: 2.5rem; margin-bottom: 8px; }
.photo-upload-text { font-size: 0.9rem; color: var(--brown-mid); }
.photo-upload-hint { font-size: 0.8rem; color: var(--sand); margin-top: 4px; }

.photo-preview {
  position: relative;
  display: inline-block;
  margin-top: 16px;
}

.photo-preview img {
  width: 120px; height: 120px;
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: var(--shadow-md);
}

.photo-preview-remove {
  position: absolute;
  top: -8px; right: -8px;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--error);
  color: #fff;
  font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  border: 2px solid var(--white);
}

/* ===== AUTH PAGE ===== */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 24px 40px;
  position: relative;
}

.auth-bg {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(196,98,45,0.08), transparent 60%),
              radial-gradient(ellipse at 80% 30%, rgba(91,123,94,0.08), transparent 50%);
  z-index: 0;
}

.auth-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: 48px;
  width: 100%;
  max-width: 460px;
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.5s ease both;
}

.auth-logo {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo .logo-icon {
  width: 64px; height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--terracotta), var(--terracotta-dark));
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  margin: 0 auto 12px;
  box-shadow: 0 8px 24px rgba(196,98,45,0.4);
}

.auth-logo h1 {
  font-size: 1.5rem;
  color: var(--terracotta);
}

.auth-tabs {
  display: flex;
  background: var(--cream-dark);
  border-radius: 50px;
  padding: 4px;
  margin-bottom: 32px;
}

.auth-tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  color: var(--brown-mid);
}

.auth-tab.active {
  background: var(--white);
  color: var(--terracotta);
  box-shadow: var(--shadow-sm);
}

.auth-form { display: none; }
.auth-form.active { display: block; }

.auth-divider {
  text-align: center;
  position: relative;
  margin: 24px 0;
  color: var(--sand);
  font-size: 0.85rem;
}

.auth-divider::before, .auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background: var(--cream-dark);
}

.auth-divider::before { left: 0; }
.auth-divider::after { right: 0; }

/* ===== PROFILE PAGE ===== */
.profile-header {
  padding: 120px 0 48px;
  background: linear-gradient(135deg, rgba(196,98,45,0.06), rgba(91,123,94,0.06));
  border-bottom: 1px solid var(--cream-dark);
}

.profile-header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--terracotta), var(--terracotta-dark));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(196,98,45,0.3);
}

.profile-name { font-family: 'Playfair Display', serif; font-size: 1.8rem; }
.profile-email { color: var(--brown-mid); }
.profile-role-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(196,98,45,0.12);
  color: var(--terracotta);
  margin-top: 6px;
}

.profile-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid var(--cream-dark);
  margin-bottom: 36px;
}

.profile-tab {
  padding: 14px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brown-mid);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: -2px;
}

.profile-tab:hover { color: var(--terracotta); }
.profile-tab.active { color: var(--terracotta); border-bottom-color: var(--terracotta); }

.profile-panel { display: none; }
.profile-panel.active { display: block; }

/* ===== APPLICATION CARD ===== */
.application-card {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--cream-dark);
  transition: var(--transition);
}

.application-card.pending { border-left-color: var(--gold); }
.application-card.approved { border-left-color: var(--success); }
.application-card.rejected { border-left-color: var(--error); }

.app-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.app-status {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.app-status.pending { background: rgba(201,150,42,0.12); color: var(--gold); }
.app-status.approved { background: rgba(74,158,106,0.12); color: var(--success); }
.app-status.rejected { background: rgba(214,64,64,0.12); color: var(--error); }

/* ===== ADMIN ===== */
.admin-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.admin-sidebar {
  background: var(--espresso);
  padding: 100px 0 32px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 260px;
  overflow-y: auto;
  z-index: 100;
}

.admin-sidebar-logo {
  padding: 0 24px 32px;
  color: var(--white);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.admin-nav-item:hover, .admin-nav-item.active {
  color: #fff;
  background: rgba(196,98,45,0.2);
  border-right: 3px solid var(--terracotta);
}

.admin-nav-item .nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }

.admin-main {
  margin-left: 260px;
  padding: 100px 40px 40px;
}

.admin-page { display: none; }
.admin-page.active { display: block; }

.admin-page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin-bottom: 8px;
}

.admin-page-subtitle { color: var(--brown-mid); margin-bottom: 32px; }

.admin-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.admin-stat-card {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.admin-stat-icon { font-size: 2rem; margin-bottom: 12px; }
.admin-stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; }
.admin-stat-label { color: var(--brown-mid); font-size: 0.85rem; }

/* Table */
.admin-table-wrap {
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.admin-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--cream-dark);
}

.admin-table { width: 100%; border-collapse: collapse; }

.admin-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brown-mid);
  background: var(--cream-dark);
}

.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--cream-dark);
  font-size: 0.88rem;
  color: var(--brown);
  vertical-align: middle;
}

.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(196,98,45,0.02); }

.table-pet-thumb {
  width: 44px; height: 44px;
  border-radius: 10px;
  object-fit: cover;
  background: var(--cream-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  overflow: hidden;
}

.table-pet-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* ===== SUCCESS STORIES ===== */
.stories-section {
  background: linear-gradient(135deg, rgba(91,123,94,0.06), rgba(196,98,45,0.04));
  padding: 80px 0;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.story-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.story-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.story-photo {
  height: 180px;
  background: var(--cream-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 5rem;
}

.story-body { padding: 20px; }
.story-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 6px; }
.story-text { font-size: 0.85rem; color: var(--brown-mid); line-height: 1.6; }
.story-adopter { font-size: 0.8rem; color: var(--terracotta); font-weight: 600; margin-top: 10px; }

/* ===== FOOTER ===== */
.footer {
  background: var(--espresso);
  color: rgba(255,255,255,0.8);
  padding: 60px 0 32px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-brand p { font-size: 0.85rem; margin-top: 12px; opacity: 0.6; line-height: 1.6; }

.footer-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 16px;
}

.footer-links { list-style: none; }
.footer-links li { margin-bottom: 8px; }
.footer-links a { font-size: 0.85rem; opacity: 0.6; transition: opacity 0.2s; }
.footer-links a:hover { opacity: 1; }

.footer-contact { font-size: 0.85rem; opacity: 0.6; line-height: 2; }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  opacity: 0.5;
}

/* ===== TOAST ===== */
.toast-container {
  position: fixed;
  bottom: 32px; right: 32px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  background: var(--espresso);
  color: var(--white);
  padding: 14px 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 0.88rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  pointer-events: all;
  border-left: 4px solid var(--terracotta);
}

.toast.success { border-left-color: var(--success); }
.toast.error { border-left-color: var(--error); }
.toast.warning { border-left-color: var(--warning); }
.toast.leaving { animation: toastOut 0.3s ease both; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: var(--brown-mid);
}

.empty-state .empty-icon { font-size: 4rem; margin-bottom: 16px; opacity: 0.4; }
.empty-state h3 { font-size: 1.3rem; margin-bottom: 8px; color: var(--brown); }
.empty-state p { font-size: 0.9rem; }

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in { animation: fadeIn 0.5s ease both; }

/* ===== LOADING SPINNER ===== */
.spinner {
  width: 32px; height: 32px;
  border: 3px solid var(--cream-dark);
  border-top-color: var(--terracotta);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 60px;
}

/* ===== MOBILE NAV ===== */
.mobile-menu {
  display: none;
  position: fixed;
  top: 72px; left: 0; right: 0;
  background: var(--white);
  border-bottom: 1px solid var(--cream-dark);
  padding: 16px;
  z-index: 999;
  flex-direction: column;
  gap: 4px;
  animation: fadeInUp 0.3s ease;
  box-shadow: var(--shadow-md);
}

.mobile-menu.open { display: flex; }
.mobile-menu .nav-link { padding: 12px 16px; }

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */

/* Tablet */
@media (max-width: 1024px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { display: none; }
  .admin-main { margin-left: 0; }
  .admin-stats-row { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .stories-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 768px) {
  /* Base */
  .container { padding: 0 16px; }
  .section { padding: 56px 0; }

  /* Navbar */
  .navbar { padding: 0 16px; height: 60px; }
  .navbar-nav { display: none; }
  .hamburger { display: flex; }
  .navbar-brand { font-size: 1.15rem; }
  .navbar-brand .brand-icon { width: 34px; height: 34px; font-size: 1rem; }
  .navbar-actions { gap: 8px; }
  .navbar-actions .btn-sm { padding: 6px 12px; font-size: 0.78rem; }
  .theme-toggle { width: 34px; height: 34px; font-size: 1rem; }

  /* Mobile menu */
  .mobile-menu { top: 60px; padding: 12px; }
  .mobile-menu .nav-link { padding: 14px 16px; font-size: 0.95rem; border-radius: var(--radius-sm); }

  /* Hero */
  .hero { padding-top: 60px; min-height: auto; padding-bottom: 48px; }
  .hero-visual { display: none; }
  .hero-paws { font-size: 5rem; right: 4%; top: 10%; opacity: 0.03; }
  .hero-content { max-width: 100%; }
  .hero h1 { font-size: clamp(1.9rem, 7vw, 2.6rem); }
  .hero p { font-size: 1rem; margin-bottom: 28px; }
  .hero-badge { font-size: 0.78rem; }
  .hero-actions { gap: 12px; }
  .hero-actions .btn-lg { padding: 13px 24px; font-size: 0.92rem; }
  .hero-stats {
    gap: 0;
    margin-top: 40px;
    background: var(--white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: 20px 8px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .hero-stat-item {
    padding: 0 8px;
    border-right: 1px solid var(--cream-dark);
  }
  .hero-stat-item:last-child { border-right: none; }
  .hero-stat-num { font-size: 1.6rem; }
  .hero-stat-label { font-size: 0.72rem; }

  /* Stats bar */
  .stats-bar { padding: 28px 0; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .stat-num { font-size: 2.2rem; }

  /* Catalog */
  .catalog-header { flex-direction: column; gap: 16px; }
  .search-bar { min-width: 100%; }
  .filters-row { gap: 8px; }
  .filter-chip { padding: 7px 13px; font-size: 0.8rem; }
  .filter-select { font-size: 0.8rem; padding: 7px 30px 7px 13px; }

  /* Pet grid */
  .pets-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .pet-photo-wrap { height: 160px; }
  .pet-info { padding: 14px; }
  .pet-name { font-size: 1.1rem; }
  .pet-description { display: none; }
  .pet-card-actions { gap: 6px; }
  .pet-card-actions .btn { padding: 8px 12px; font-size: 0.78rem; }

  /* Modal */
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal {
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    max-height: 92vh;
    max-width: 100%;
  }
  .modal-pet-photo, .modal-pet-photo-placeholder { height: 220px; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
  .modal-body { padding: 20px 20px 32px; }
  .modal-pet-name { font-size: 1.5rem; }
  .modal-pet-meta { grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 12px; }
  .modal-meta-label { font-size: 0.68rem; }
  .modal-meta-value { font-size: 0.88rem; }
  .modal-actions { gap: 10px; }
  .modal-actions .btn { flex: 1; justify-content: center; padding: 12px 16px; font-size: 0.85rem; }

  /* Forms */
  .form-section { padding: 72px 0 48px; }
  .form-card { padding: 24px 18px; border-radius: var(--radius-lg); }
  .form-title { font-size: 1.5rem; }
  .form-subtitle { font-size: 0.88rem; margin-bottom: 24px; }
  .form-group { margin-bottom: 18px; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .form-control { padding: 11px 14px; font-size: 0.88rem; }

  /* Auth */
  .auth-page { padding: 80px 16px 32px; }
  .auth-card { padding: 28px 20px; border-radius: var(--radius-lg); }
  .auth-logo .logo-icon { width: 52px; height: 52px; font-size: 1.6rem; }
  .auth-logo h1 { font-size: 1.3rem; }
  .auth-tab { font-size: 0.85rem; padding: 9px 8px; }

  /* Profile */
  .profile-header { padding: 80px 0 32px; }
  .profile-header-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .profile-avatar { width: 64px; height: 64px; font-size: 1.6rem; }
  .profile-name { font-size: 1.4rem; }
  .profile-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 0; gap: 0; flex-wrap: nowrap; }
  .profile-tab { white-space: nowrap; padding: 12px 18px; font-size: 0.85rem; }

  /* Stories */
  .stories-grid { grid-template-columns: 1fr; gap: 16px; }
  .story-photo { height: 140px; font-size: 3.5rem; }

  /* Footer */
  .footer { padding: 40px 0 24px; }
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }

  /* Toast */
  .toast-container { bottom: 16px; right: 16px; left: 16px; }
  .toast { min-width: auto; width: 100%; font-size: 0.84rem; }
}

/* Small mobile */
@media (max-width: 480px) {
  /* Typography */
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }

  /* Navbar: hide username on very small screens */
  .nav-username { display: none; }
  .navbar-actions #navProfile .btn-ghost { padding: 6px 10px; }

  /* Hero */
  .hero-actions { flex-direction: column; }
  .hero-actions .btn { width: 100%; justify-content: center; }
  .hero-stats { grid-template-columns: repeat(3, 1fr); }
  .hero-stat-num { font-size: 1.35rem; }
  .hero-stat-label { font-size: 0.65rem; }

  /* Stats bar */
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .stat-num { font-size: 1.9rem; }
  .stat-label { font-size: 0.78rem; }

  /* Pet grid: single column */
  .pets-grid { grid-template-columns: 1fr; gap: 16px; }
  .pet-photo-wrap { height: 200px; }
  .pet-info { padding: 16px; }
  .pet-description { display: -webkit-box; }

  /* Form: full-width buttons */
  .form-card { padding: 20px 16px; }
  .btn-lg { width: 100%; justify-content: center; }

  /* Adopt step indicator */
  #stepIndicator { gap: 4px; margin-bottom: 28px; }

  /* Pet search grid in adopt */
  #petSearchResults { grid-template-columns: repeat(2, 1fr) !important; }

  /* Profile tabs: scrollable */
  .profile-tab { padding: 11px 14px; font-size: 0.8rem; }

  /* Modals: full height feel */
  .modal { max-height: 95vh; }
  .modal-pet-meta { grid-template-columns: repeat(2, 1fr); }
  .modal-actions { flex-direction: column; }
  .modal-actions .btn { width: 100%; justify-content: center; }

  /* Auth */
  .auth-card { padding: 24px 16px; }

  /* Admin */
  .admin-tabs { flex-wrap: wrap; }
  .admin-tab { font-size: 0.82rem; padding: 8px 14px; }

  /* Footer */
  .footer-grid { gap: 20px; }
}

/* Bottom safe area for iOS */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-menu { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
  .toast-container { bottom: calc(16px + env(safe-area-inset-bottom)); }
  .modal { padding-bottom: env(safe-area-inset-bottom); }
}
/* ===== PAGE HERO MINI ===== */
.page-hero {
  background: linear-gradient(135deg, rgba(196,98,45,.08), rgba(91,123,94,.06));
  padding: 120px 0 48px;
  border-bottom: 1px solid var(--cream-dark);
}

.page-hero-green {
  background: linear-gradient(135deg, rgba(91,123,94,.08), rgba(196,98,45,.06));
  padding: 120px 0 48px;
  border-bottom: 1px solid var(--cream-dark);
}

@media (max-width: 768px) {
  .page-hero, .page-hero-green {
    padding: 80px 0 32px;
  }
  .page-hero h1, .page-hero-green h1 {
    font-size: 1.7rem;
  }
  .page-hero p, .page-hero-green p {
    font-size: 0.9rem;
  }
}

/* ===== IMPROVEMENTS ===== */

/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Scroll-to-top button */
#scrollTopBtn:hover {
  background: var(--terracotta-dark) !important;
  transform: translateY(-3px);
}

/* Server banner spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Fav badge */
#favBadge { display: none; }

/* Load more button focus */
#loadMoreBtn:focus-visible {
  outline: 2px solid var(--terracotta);
  outline-offset: 3px;
}

/* 404 page body centering */
.notfound-wrap {
  background: var(--cream);
}
