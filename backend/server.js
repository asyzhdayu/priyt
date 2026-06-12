require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const compression = require('compression');
const mongoose    = require('mongoose');
const rateLimit   = require('express-rate-limit');
const helmet      = require('helmet');
const morgan      = require('morgan');

const petsRouter         = require('./routes/pets');
const usersRouter        = require('./routes/users');
const applicationsRouter = require('./routes/applications');
const donationsRouter    = require('./routes/donations');
const volunteersRouter   = require('./routes/volunteers');
const surrenderRouter    = require('./routes/surrender');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Безопасность (HTTP-заголовки) ─────────────────────────────────────────────
// ── Логирование запросов ─────────────────────────────────────────────────────
app.use(morgan('dev'));

app.use(helmet({
  crossOriginResourcePolicy: false,      // разрешаем загрузку фото с других доменов
  contentSecurityPolicy: false,          // CSP настраивается отдельно если нужно
}));

// ── Сжатие ───────────────────────────────────────────────────────────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5500')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: origin ${origin} не разрешён`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ── Rate limiting (защита от спама/brute-force) ───────────────────────────────
// Общий лимит: 200 req/15 мин с одного IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много запросов, попробуйте позже' },
});

// Строгий лимит для auth: 20 попыток/15 мин
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Слишком много попыток входа, попробуйте через 15 минут' },
});

// Лимит на передачу животных: 5/час с одного IP
const surrenderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много заявок на передачу, попробуйте позже' },
});

// Лимит на подачу заявок: 10/час с одного IP
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Слишком много заявок, попробуйте позже' },
});

app.use(globalLimiter);
app.use('/api/users/login',    authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/applications',   applyLimiter);

// ── Cache-Control для GET /api/pets ──────────────────────────────────────────
app.use('/api/pets', (req, res, next) => {
  if (req.method === 'GET')
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  next();
});

// ── Маршруты ─────────────────────────────────────────────────────────────────
app.use('/api/pets',         petsRouter);
app.use('/api/users',        usersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/donations',    donationsRouter);
app.use('/api/volunteers',   volunteersRouter);
app.use('/api/surrender',    surrenderLimiter, surrenderRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ── Глобальный обработчик ошибок ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`, err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ── Запуск ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB подключена');
    app.listen(PORT, () => console.log(`🚀 Сервер: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  });
