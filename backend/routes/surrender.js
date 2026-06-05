/**
 * POST /api/surrender — публичный эндпоинт передачи животного.
 * Создаёт питомца + заявку в одной операции без requireStaff.
 */
const express     = require('express');
const router      = express.Router();
const Pet         = require('../models/Pet');
const Application = require('../models/Application');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      // Данные животного
      name, species, breed, age, ageUnit, gender, size,
      color, description, vaccinated, sterilized, photo,
      // Данные владельца
      ownerName, ownerEmail, ownerPhone,
      reason, notifyOnAdopt,
    } = req.body;

    // Валидация обязательных полей
    if (!name || !species || !age || !gender || !ownerName || !ownerEmail || !ownerPhone) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    // Создаём питомца со статусом available
    const pet = new Pet({
      name: name.trim(),
      species,
      breed: (breed || '').trim() || 'Беспородный',
      age: parseInt(age),
      ageUnit: ageUnit || 'years',
      gender,
      size: size || 'medium',
      color: (color || '').trim() || 'Неизвестно',
      description: (description || '').trim(),
      vaccinated: !!vaccinated,
      sterilized: !!sterilized,
      photo: photo || null,
      status: 'available',
    });
    await pet.save();

    // Создаём заявку типа surrender
    const app = new Application({
      type: 'surrender',
      petId: pet._id,
      petName: name.trim(),
      userId: req.user?._id || null,
      applicantName: ownerName.trim(),
      applicantEmail: ownerEmail.toLowerCase().trim(),
      applicantPhone: ownerPhone.trim(),
      reason: (reason || '').trim(),
      notifyOnAdopt: !!notifyOnAdopt,
      status: 'pending',
    });
    await app.save();

    res.status(201).json({ pet, application: app });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
