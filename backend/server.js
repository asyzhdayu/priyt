require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const petsRouter = require('./routes/pets');
const usersRouter = require('./routes/users');
const applicationsRouter = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== CORS =====
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5500')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} не разрешён`));
    }
  },
  credentials: true,
}));

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '10mb' })); // 10MB для base64-фото
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.use('/api/pets', petsRouter);
app.use('/api/users', usersRouter);
app.use('/api/applications', applicationsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Внутренняя ошибка сервера' });
});

// ===== MONGODB =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB подключена');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
