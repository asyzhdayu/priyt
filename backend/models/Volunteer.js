const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true },
  phone:       { type: String, required: true, trim: true },
  age:         { type: Number, min: 14, max: 99, default: null },
  skills:      [{ type: String, enum: ['walking','grooming','photo','vet','transport','events','social','other'] }],
  schedule:    { type: String, enum: ['weekdays','weekends','evenings','flexible'], default: 'flexible' },
  experience:  { type: String, default: '' },
  motivation:  { type: String, default: '' },
  status:      { type: String, enum: ['new','contacted','active','inactive'], default: 'new' },
  staffNote:   { type: String, default: '' },
  date:        { type: Date, default: Date.now },
});

volunteerSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model('Volunteer', volunteerSchema);
