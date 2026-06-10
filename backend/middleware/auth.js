const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
    req.user = user;
    next();
  } catch (err) {
    // JWT-ошибки → 401. Всё остальное (БД, сеть) → 500
    // Иначе при кратком сбое MongoDB пользователь будет разлогинен
    const isJwtError = err.name === 'JsonWebTokenError'
      || err.name === 'TokenExpiredError'
      || err.name === 'NotBeforeError';
    if (isJwtError) {
      return res.status(401).json({ error: 'Токен недействителен или истёк' });
    }
    next(err); // DB/другие ошибки → глобальный обработчик → 500
  }
}

function requireStaff(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
    return res.status(403).json({ error: 'Доступ запрещён: требуется роль staff' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён: требуется роль admin' });
  }
  next();
}

async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');
      if (user) req.user = user;
    }
  } catch {}
  next();
}

module.exports = { auth, optionalAuth, requireStaff, requireAdmin };
