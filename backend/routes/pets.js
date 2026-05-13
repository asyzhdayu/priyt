const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { auth, requireStaff } = require('../middleware/auth');

// GET /api/pets — список с фильтрами
router.get('/', async (req, res) => {
  try {
    const { search, species, status, gender, size, sort = 'newest', featured } = req.query;
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (species && species !== 'all') filter.species = species;
    if (status && status !== 'all') filter.status = status;
    if (gender && gender !== 'all') filter.gender = gender;
    if (size && size !== 'all') filter.size = size;
    if (featured === 'true') filter.featured = true;

    const sortMap = {
      newest: { dateAdded: -1 },
      oldest: { dateAdded: 1 },
      name: { name: 1 },
      age_asc: { age: 1 },
    };

    const pets = await Pet.find(filter).sort(sortMap[sort] || sortMap.newest);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/stats — статистика
router.get('/stats', async (req, res) => {
  try {
    const [total, available, adopted, applications] = await Promise.all([
      Pet.countDocuments(),
      Pet.countDocuments({ status: 'available' }),
      Pet.countDocuments({ status: 'adopted' }),
      require('../models/Application').countDocuments(),
    ]);
    res.json({ total, available, adopted, applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/:id — один питомец
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pets — добавить питомца (staff)
router.post('/', auth, requireStaff, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/pets/:id — обновить питомца (staff)
router.put('/:id', auth, requireStaff, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/pets/:id — удалить питомца (staff)
router.delete('/:id', auth, requireStaff, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    res.json({ message: 'Питомец удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
