# Инструкция по деплою: MongoDB Atlas + Railway

---

## Шаг 1 — MongoDB Atlas (база данных)

### 1.1 Регистрация и кластер
1. Зайдите на **https://cloud.mongodb.com** и зарегистрируйтесь
2. Нажмите **"Build a Database"**
3. Выберите **M0 Free** (бесплатно навсегда)
4. Регион: выберите ближайший к вам (например, Frankfurt для России)
5. Придумайте имя кластера, нажмите **"Create"**

### 1.2 Пользователь базы данных
1. В левом меню: **Security → Database Access**
2. Нажмите **"Add New Database User"**
3. Метод: **Password**
4. Придумайте логин и пароль (запомните — они войдут в строку подключения)
5. Role: **"Atlas admin"** → **"Add User"**
6. poma20063_db_user - nQA8KdoVZqI5AFJQ

### 1.3 Сетевой доступ
1. В левом меню: **Security → Network Access**
2. Нажмите **"Add IP Address"**
3. Нажмите **"Allow Access from Anywhere"** → это добавит `0.0.0.0/0`
   > ⚠️ Это нужно для Railway, т.к. его IP динамический.
   > Для продакшена можно позже ограничить конкретными IP Railway.
4. **"Confirm"**

### 1.4 Строка подключения
1. В левом меню: **Data Services → Clusters** → **"Connect"** на вашем кластере
2. Выберите **"Drivers"**
3. Driver: **Node.js**, Version: последняя
4. Скопируйте строку вида:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Замените `<username>` и `<password>` на данные из шага 1.2
6. Добавьте имя базы данных перед `?`:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/shelter?retryWrites=true&w=majority
   ```
7. **Сохраните эту строку** — она понадобится в Railway
8. mongodb+srv://poma20063_db_user:nQA8KdoVZqI5AFJQ@cluster0.dbrwcpy.mongodb.net/?appName=Cluster0

---

## Шаг 2 — GitHub (загрузка кода)

### 2.1 Создайте репозиторий
1. Зайдите на **https://github.com** → **"New repository"**
2. Название: `shelter-backend` (приватный)
3. Нажмите **"Create repository"**

### 2.2 Загрузите папку shelter-backend
В папке `shelter-backend` выполните в терминале:
```bash
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/ВАШ_НИК/shelter-backend.git
git push -u origin main
```

> **Важно:** файл `.env` НЕ попадёт в Git (он в `.gitignore`) — это правильно.

---

## Шаг 3 — Railway (хостинг бэкенда)

### 3.1 Регистрация
1. Зайдите на **https://railway.app**
2. Войдите через GitHub — это даёт доступ к репозиториям

### 3.2 Создание проекта
1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите `shelter-backend` и выберите его
4. Railway автоматически определит Node.js и начнёт деплой

### 3.3 Переменные окружения
1. Перейдите в проект → вкладка **"Variables"**
2. Нажмите **"New Variable"** и добавьте по одной:

| Переменная | Значение |
|---|---|
| `MONGODB_URI` | Ваша строка из шага 1.4 |
| `JWT_SECRET` | Любая длинная случайная строка (например: `xK9mP2qL8nR5vT1w`) |
| `ALLOWED_ORIGINS` | `*` (пока разрабатываете; потом укажите домен фронтенда) |

3. После добавления переменных Railway автоматически перезапустит сервис

### 3.4 Получите URL вашего бэкенда
1. Перейдите в проект → вкладка **"Settings"** → раздел **"Domains"**
2. Нажмите **"Generate Domain"**
3. Скопируйте URL вида: `https://shelter-backend-production.up.railway.app`

### 3.5 Проверка
Откройте в браузере:
```
https://shelter-backend-production.up.railway.app/api/health
```
Должны увидеть:
```json
{ "status": "ok", "db": "connected", "timestamp": "..." }
```

---

## Шаг 4 — Заполнение базы начальными данными

На вашем **локальном компьютере** (не на Railway):

1. В папке `shelter-backend` создайте файл `.env` на основе `.env.example`:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/shelter?retryWrites=true&w=majority
   JWT_SECRET=xK9mP2qL8nR5vT1w
   ```

2. Установите зависимости и запустите seed:
   ```bash
   npm install
   npm run seed
   ```

3. Вы увидите:
   ```
   ✅ MongoDB подключена
   🗑️  Старые данные удалены
   🐾 Добавлено питомцев: 8
   👤 Добавлено пользователей: 2
   ✅ База данных заполнена успешно!
      admin@shelter.ru / admin123
      manager@shelter.ru / manager123
   ```

---

## Шаг 5 — Подключение фронтенда

### 5.1 Замените data.js
Скопируйте файл `frontend-data.js` в папку фронтенда как `js/data.js`, заменив старый файл.

### 5.2 Укажите URL бэкенда
В начале нового `js/data.js` замените:
```js
const API_URL = 'https://ВАШ-ПРОЕКТ.up.railway.app';
```
на ваш реальный URL из шага 3.4.

### 5.3 Важно: функции стали async
Все функции теперь возвращают Promise. В HTML-файлах нужно добавить `await` и обернуть вызовы в `async` функции. Пример:

```js
// Было (localStorage):
const pets = getPets();
renderPets(pets);

// Стало (API):
async function loadPets() {
  const pets = await getPets();
  renderPets(pets);
}
loadPets();
```

### 5.4 Хостинг фронтенда
Фронтенд (HTML/CSS/JS файлы) можно разместить бесплатно на:
- **Netlify**: перетащите папку на https://app.netlify.com/drop
- **Vercel**: `npx vercel` в папке фронтенда
- **GitHub Pages**: включите в настройках репозитория

После деплоя фронтенда обновите `ALLOWED_ORIGINS` в Railway:
```
https://your-site.netlify.app
```

---

## Итоговая архитектура

```
Пользователь
     ↓
Netlify/Vercel  ← HTML/CSS/JS (фронтенд)
     ↓  fetch запросы
Railway         ← Node.js + Express (бэкенд)
     ↓  mongoose
MongoDB Atlas   ← база данных (бесплатно M0)
```

---

## Частые проблемы

**Railway не запускается** — проверьте вкладку "Logs" в Railway. Скорее всего неверная строка MONGODB_URI.

**CORS ошибка в браузере** — проверьте переменную `ALLOWED_ORIGINS`, она должна совпадать с origin фронтенда (без слеша в конце).

**"db: disconnected" в /api/health** — MongoDB не подключилась. Проверьте, что в Network Access добавлен IP `0.0.0.0/0`.

**Функции возвращают undefined** — забыли `await` перед вызовом функции из нового data.js.
