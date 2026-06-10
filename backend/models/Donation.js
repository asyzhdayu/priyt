const mongoose = require('mongoose');

const donationGoalSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  targetAmount:{ type: Number, required: true, min: 1 },
  raisedAmount:{ type: Number, default: 0 },
  emoji:       { type: String, default: '💛' },
  active:      { type: Boolean, default: true },
  deadline:    { type: Date, default: null },
  createdAt:   { type: Date, default: Date.now },
});

const donationSchema = new mongoose.Schema({
  goalId:      { type: mongoose.Schema.Types.ObjectId, ref: 'DonationGoal', default: null },
  donorName:   { type: String, required: true, trim: true },
  donorEmail:  { type: String, required: true, lowercase: true },
  amount:      { type: Number, required: true, min: 1 },
  comment:     { type: String, default: '', maxlength: 500 },
  anonymous:   { type: Boolean, default: false },
  date:        { type: Date, default: Date.now },
});

// После сохранения доната — атомарно инкрементируем raisedAmount ($inc быстрее aggregate)
donationSchema.post('save', async function() {
  if (this.goalId) {
    const DonationGoal = mongoose.model('DonationGoal');
    await DonationGoal.findByIdAndUpdate(this.goalId, {
      $inc: { raisedAmount: this.amount },
    });
  }
});

const DonationGoal = mongoose.model('DonationGoal', donationGoalSchema);
const Donation     = mongoose.model('Donation',     donationSchema);
module.exports = { Donation, DonationGoal };
