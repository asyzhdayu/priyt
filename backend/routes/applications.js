const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { auth, optionalAuth, requireStaff } = require('../middleware/auth');

// POST /api/applications — подать заявку (авторизованный или гость)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { petId, applicantName, applicantEmail, applicantPhone, ...rest } = req.body;
    if (!petId || !applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    if (req.user) {
      const existing = await Application.findOne({
        petId,
        userId: req.user._id,
        status: { $in: ['pending', 'reviewing'] },
      });
      if (existing) {
        return res.status(409).json({ error: 'Вы уже подали заявку на этого питомца' });
      }
    }

    const app = new Application({
      petId,
      userId: req.user?._id || null,
      applicantName,
      applicantEmail,
      applicantPhone,
      ...rest,
    });
    await app.save();

    const populated = await app.populate(['petId', 'userId']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/applications/my — заявки текущего пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .populate('petId')
      .sort({ dateSubmitted: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications — все заявки (staff)
router.get('/', auth, requireStaff, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const apps = await Application.find(filter)
      .populate('petId')
      .populate('userId', 'name email phone')
      .sort({ dateSubmitted: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('petId')
      .populate('userId', 'name email phone');
    if (!app) return res.status(404).json({ error: 'Заявка не найдена' });

    // Пользователь может видеть только свои заявки
    const isOwner = app.userId._id.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'manager';
    if (!isOwner && !isStaff) return res.status(403).json({ error: 'Доступ запрещён' });

    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id/status — изменить статус (staff)
router.put('/:id/status', auth, requireStaff, async (req, res) => {
  try {
    const { status, staffComment } = req.body;
    const validStatuses = ['pending', 'reviewing', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, staffComment: staffComment || '' },
      { new: true }
    ).populate('petId').populate('userId', 'name email phone');

    if (!app) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/applications/:id (staff)
router.delete('/:id', auth, requireStaff, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
