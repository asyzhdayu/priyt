const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Проверяет JWT и добавляет req.user
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
    res.status(401).json({ error: 'Токен недействителен или истёк' });
  }
}

// Только для staff (admin или manager)
function requireStaff(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
    return res.status(403).json({ error: 'Доступ запрещён: требуется роль staff' });
  }
  next();
}

// Только для admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён: требуется роль admin' });
  }
  next();
}

module.exports = { auth, requireStaff, requireAdmin };
