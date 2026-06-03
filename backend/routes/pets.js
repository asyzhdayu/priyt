const express = require('express');
const router  = express.Router();
const Pet     = require('../models/Pet');
const { auth, requireStaff } = require('../middleware/auth');

// GET /api/pets — список с фильтрами + ПАГИНАЦИЯ
// ?page=1&limit=12&search=&species=&status=&gender=&size=&sort=newest
router.get('/', async (req, res) => {
  try {
    const {
      search, species, status, gender, size,
      sort = 'newest', featured,
      page = 1, limit = 0,          // limit=0 → без пагинации (обратная совместимость)
    } = req.query;

    const filter = {};
    if (search)  filter.$text   = { $search: search };
    if (species  && species  !== 'all') filter.species  = species;
    if (status   && status   !== 'all') filter.status   = status;
    if (gender   && gender   !== 'all') filter.gender   = gender;
    if (size     && size     !== 'all') filter.size     = size;
    if (featured === 'true')            filter.featured = true;

    const sortMap = {
      newest:  { dateAdded: -1 },
      oldest:  { dateAdded:  1 },
      name:    { name: 1 },
      age_asc: { age:  1 },
    };

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.max(0, parseInt(limit) || 0);

    const query = Pet.find(filter).sort(sortMap[sort] || sortMap.newest);

    if (limitNum > 0) {
      const skip  = (pageNum - 1) * limitNum;
      const total = await Pet.countDocuments(filter);
      const pets  = await query.skip(skip).limit(limitNum);
      return res.json({ pets, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    }

    // Без пагинации — старое поведение (массив)
    const pets = await query;
    res.json(pets);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/suggest?q=бар — автокомплит (топ-6 совпадений по имени)
router.get('/suggest', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 1) return res.json([]);
    const pets = await Pet.find({
      name: { $regex: q, $options: 'i' },
      status: { $ne: 'adopted' },
    }).limit(6).select('name species breed photo');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/stats
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

// GET /api/pets/:id
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pets (staff)
router.post('/', auth, requireStaff, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/pets/:id (staff)
router.put('/:id', auth, requireStaff, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/pets/:id (staff)
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
