const express     = require('express');
const router      = express.Router();
// ── Email-уведомления (nodemailer) ──────────────────────────────────────────
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function sendStatusEmail(app, petName) {
  const t = getTransporter();
  if (!t || !app.applicantEmail) return;
  const statusMap = {
    approved:  {
      subject: app.type === 'surrender' ? '✅ Животное принято в приют!' : '✅ Ваша заявка одобрена!',
      emoji: '🎉', color: '#5B7B5E',
      text: app.type === 'surrender'
        ? 'Мы готовы принять животное. Свяжитесь с нами для уточнения времени и условий передачи.'
        : 'Поздравляем! Ваша заявка на усыновление одобрена. Свяжитесь с нами для оформления документов.',
    },
    rejected:  {
      subject: '❌ Заявка отклонена', emoji: '😔', color: '#D64040',
      text: app.type === 'surrender'
        ? 'К сожалению, мы не можем принять животное в данный момент. Свяжитесь с нами для обсуждения альтернатив.'
        : 'К сожалению, в этот раз мы не можем одобрить вашу заявку. Не расстраивайтесь — в нашем приюте много других замечательных питомцев!',
    },
    reviewing: { subject: '🔍 Заявка рассматривается',   emoji: '🔍', color: '#C4622D', text: 'Ваша заявка принята в работу. Мы свяжемся с вами в ближайшее время.' },
  };
  const info = statusMap[app.status];
  if (!info) return;
  const comment = app.staffComment ? `<p style="background:#f5f5f5;padding:12px;border-radius:8px;font-style:italic">${app.staffComment}</p>` : '';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
      <div style="background:${info.color};padding:28px;border-radius:12px 12px 0 0;text-align:center">
        <div style="font-size:3rem">${info.emoji}</div>
        <h1 style="color:#fff;margin:8px 0 0;font-size:1.4rem">${info.subject}</h1>
      </div>
      <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none">
        <p>Здравствуйте, <strong>${app.applicantName}</strong>!</p>
        <p>Питомец: <strong>${petName}</strong></p>
        <p>${info.text}</p>
        ${comment}
        <div style="text-align:center;margin-top:24px">
          <a href="https://asyzhdayu.github.io/priyt/profile.html" style="background:${info.color};color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700">Открыть мой профиль</a>
        </div>
        <p style="font-size:.8rem;color:#999;margin-top:24px;text-align:center">Приютик! · hello@priutdoma.ru · +7 (911) 111-11-11</p>
      </div>
    </div>`;
  try {
    await t.sendMail({
      from: `"Приютик! 🐾" <${process.env.SMTP_USER}>`,
      to: app.applicantEmail,
      subject: `${info.subject} — ${petName}`,
      html,
    });
  } catch (e) {
    console.warn('[email] Ошибка отправки:', e.message);
  }
}


const Application = require('../models/Application');
const Pet         = require('../models/Pet');
const { auth, optionalAuth, requireStaff } = require('../middleware/auth');

// Простая проверка формата email
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}



// POST /api/applications
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { petId, applicantName, applicantEmail, applicantPhone, ...rest } = req.body;

    if (!petId || !applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    if (!isValidEmail(applicantEmail)) {
      return res.status(400).json({ error: 'Некорректный email заявителя' });
    }

    // Проверка — питомец вообще существует и доступен
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    if (pet.status === 'adopted') {
      return res.status(409).json({ error: 'Этот питомец уже нашёл дом' });
    }

    // Антиспам: блокируем дубль по userId (авторизованный) ИЛИ по email+petId (гость)
    const dupFilter = req.user
      ? { petId, userId: req.user._id,          status: { $in: ['pending', 'reviewing'] } }
      : { petId, applicantEmail: applicantEmail.toLowerCase(), status: { $in: ['pending', 'reviewing'] } };

    const existing = await Application.findOne(dupFilter);
    if (existing) {
      return res.status(409).json({ error: 'Вы уже подали заявку на этого питомца' });
    }

    const app = new Application({
      petId,
      userId: req.user?._id || null,
      applicantName,
      applicantEmail: applicantEmail.toLowerCase(),
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

// GET /api/applications/my
router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .populate('petId')
      .sort({ dateSubmitted: -1 })
      .lean();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications (staff) — с фильтром по статусу
router.get('/', auth, requireStaff, async (req, res) => {
  try {
    const { status, limit = '500' } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const apps = await Application.find(filter)
      .populate('petId', 'name species photo status')
      .populate('userId', 'name email phone')
      .sort({ dateSubmitted: -1 })
      .limit(parseInt(limit))
      .lean();
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
      .populate('userId', 'name email phone')
      .lean();
    if (!app) return res.status(404).json({ error: 'Заявка не найдена' });

    const isOwner = app.userId && app.userId._id?.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'manager';
    if (!isOwner && !isStaff) return res.status(403).json({ error: 'Доступ запрещён' });

    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id/status (staff)
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

    // Если одобрено — автоматически резервируем питомца
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(app.petId._id, { status: 'reserved' });
    }
    // Если одобрение отозвано — возвращаем питомца в available
    if (status === 'rejected' || status === 'pending') {
      const otherApproved = await Application.findOne({
        petId: app.petId._id, status: 'approved', _id: { $ne: app._id },
      });
      if (!otherApproved) {
        await Pet.findByIdAndUpdate(app.petId._id, { status: 'available' });
      }
    }

    // Отправляем email-уведомление
    const petName = app.petId?.name || 'питомец';
    sendStatusEmail(app, petName).catch(() => {});
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
