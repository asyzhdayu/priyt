# 🐾 Приют для животных — полный проект

## Структура

```
shelter/
├── frontend/          ← HTML/CSS/JS сайт (открывается в браузере)
│   ├── index.html
│   ├── adopt.html
│   ├── surrender.html
│   ├── login.html
│   ├── profile.html
│   ├── admin.html
│   ├── css/main.css
│   └── js/
│       ├── app.js     ← логика UI (без изменений)
│       └── data.js    ← API-клиент (заменяет старый localStorage)
│
└── backend/           ← Node.js + Express сервер
    ├── server.js
    ├── seed.js        ← заполнение БД начальными данными
    ├── package.json
    ├── .env.example   ← скопируйте в .env и заполните
    ├── middleware/auth.js
    ├── models/        ← Mongoose схемы (Pet, User, Application)
    ├── routes/        ← REST API маршруты
    └── DEPLOY.md      ← пошаговая инструкция деплоя
```

## Быстрый старт (локально)

### 1. Запустить бэкенд
```bash
cd backend
cp .env.example .env        # заполните MONGODB_URI и JWT_SECRET
npm install
npm run seed                # загрузить начальные данные
npm run dev                 # сервер на http://localhost:3001
```

### 2. Открыть фронтенд
В `frontend/js/data.js` убедитесь что:
```js
const API_URL = 'http://localhost:3001';
```
Затем откройте `frontend/index.html` в браузере (через Live Server или любой HTTP-сервер).

## Деплой на Railway + MongoDB Atlas

Подробная пошаговая инструкция — см. `backend/DEPLOY.md`

## Аккаунты по умолчанию (после seed)

| Email | Пароль | Роль |
|---|---|---|
| admin@shelter.ru | admin123 | Администратор |
| manager@shelter.ru | manager123 | Менеджер |
