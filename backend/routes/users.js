const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, requireAdmin } = require('../middleware/auth');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, housingType, hasOtherPets } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email уже используется' });

    const user = new User({ name, email, password, phone, address, housingType, hasOtherPets });
    await user.save();

    const token = signToken(user._id);
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Введите email и пароль' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' });

    const token = signToken(user._id);
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me — профиль текущего пользователя
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me — обновить профиль
router.put('/me', auth, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'address', 'housingType', 'hasOtherPets'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.body.passwordNew) {
      if (!req.body.passwordOld) {
        return res.status(400).json({ error: 'Введите текущий пароль' });
      }
      const user = await User.findById(req.user._id);
      const ok = await user.comparePassword(req.body.passwordOld);
      if (!ok) return res.status(400).json({ error: 'Неверный текущий пароль' });

      const freshUser = await User.findById(req.user._id);
      freshUser.password = req.body.passwordNew;
      Object.assign(freshUser, updates);
      await freshUser.save();
      return res.json(freshUser);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== ИЗБРАННОЕ =====

// GET /api/users/me/favorites
router.get('/me/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites').lean();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/me/favorites/:petId — переключить (добавить/убрать)
router.post('/me/favorites/:petId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const petId = req.params.petId;
    const idx = user.favorites.findIndex(f => f.toString() === petId);

    if (idx === -1) {
      user.favorites.push(petId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();
    res.json({ added: idx === -1, favorites: user.favorites });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== ADMIN: управление пользователями =====

// GET /api/users — все пользователи (admin)
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ dateRegistered: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users — создать пользователя (admin)
router.post('/admin/create', auth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email уже используется' });

    const user = new User({ name, email, password, phone, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/users/:id — обновить пользователя (admin)
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'role', 'avatar'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/users/:id — удалить пользователя (admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Нельзя удалить себя' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
