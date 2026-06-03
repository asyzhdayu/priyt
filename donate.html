const express   = require('express');
const router    = express.Router();
const Volunteer = require('../models/Volunteer');
const { auth, requireStaff } = require('../middleware/auth');

// POST /api/volunteers — подать заявку (публичный)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: 'Заполните обязательные поля' });
    const existing = await Volunteer.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Вы уже оставляли заявку на волонтёрство' });
    const vol = new Volunteer(req.body);
    await vol.save();
    res.status(201).json(vol);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// GET /api/volunteers (staff)
router.get('/', auth, requireStaff, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const vols = await Volunteer.find(filter).sort({ date: -1 });
    res.json(vols);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/volunteers/:id/status (staff)
router.put('/:id/status', auth, requireStaff, async (req, res) => {
  try {
    const { status, staffNote } = req.body;
    const vol = await Volunteer.findByIdAndUpdate(req.params.id, { status, staffNote }, { new: true });
    if (!vol) return res.status(404).json({ error: 'Волонтёр не найден' });
    res.json(vol);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/volunteers/:id (staff)
router.delete('/:id', auth, requireStaff, async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
