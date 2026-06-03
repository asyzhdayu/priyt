const express = require('express');
const router  = express.Router();
const { Donation, DonationGoal } = require('../models/Donation');
const { auth, requireStaff }     = require('../middleware/auth');

// GET /api/donations/goals — все активные цели
router.get('/goals', async (req, res) => {
  try {
    const goals = await DonationGoal.find({ active: true }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/donations/goals/all — все цели (admin)
router.get('/goals/all', auth, requireStaff, async (req, res) => {
  try {
    const goals = await DonationGoal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/donations/goals (staff)
router.post('/goals', auth, requireStaff, async (req, res) => {
  try {
    const goal = new DonationGoal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PUT /api/donations/goals/:id (staff)
router.put('/goals/:id', auth, requireStaff, async (req, res) => {
  try {
    const goal = await DonationGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) return res.status(404).json({ error: 'Цель не найдена' });
    res.json(goal);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/donations/goals/:id (staff)
router.delete('/goals/:id', auth, requireStaff, async (req, res) => {
  try {
    await DonationGoal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/donations/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalAgg, count, goals] = await Promise.all([
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Donation.countDocuments(),
      DonationGoal.find({ active: true }),
    ]);
    res.json({ totalRaised: totalAgg[0]?.total || 0, donorsCount: count, activeGoals: goals.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/donations — список (staff)
router.get('/', auth, requireStaff, async (req, res) => {
  try {
    const donations = await Donation.find().populate('goalId').sort({ date: -1 });
    res.json(donations);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/donations — новый донат (публичный)
router.post('/', async (req, res) => {
  try {
    const { donorName, donorEmail, amount, goalId, comment, anonymous } = req.body;
    if (!donorName || !donorEmail || !amount) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    if (amount < 1 || amount > 1_000_000) {
      return res.status(400).json({ error: 'Сумма должна быть от 1 до 1 000 000 ₽' });
    }
    const donation = new Donation({ donorName, donorEmail, amount, goalId: goalId || null, comment, anonymous: !!anonymous });
    await donation.save();
    res.status(201).json(donation);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
