const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ['cat', 'dog', 'rabbit', 'other'], required: true },
    breed: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    ageUnit: { type: String, enum: ['months', 'years'], default: 'years' },
    gender: { type: String, enum: ['male', 'female'], required: true },
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    color: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['available', 'reserved', 'adopted'], default: 'available' },
    vaccinated: { type: Boolean, default: false },
    sterilized: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    // Основное фото (обратная совместимость)
    photo: { type: String, default: null },
    // Галерея (до 6 фото)
    photos: { type: [String], default: [] },
    dateAdded: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Индексы для быстрого поиска и фильтрации
petSchema.index({ dateAdded: -1 });                    // сортировка newest/oldest
petSchema.index({ status: 1, dateAdded: -1 });          // каталог: статус + сортировка
petSchema.index({ status: 1, species: 1 });             // каталог: статус + вид
petSchema.index({ status: 1, gender: 1 });              // каталог: статус + пол
petSchema.index({ status: 1, size: 1 });                // каталог: статус + размер
petSchema.index({ featured: 1, status: 1 });            // рекомендуемые
petSchema.index({ name: 'text', breed: 'text', description: 'text' }); // поиск

module.exports = mongoose.model('Pet', petSchema);
