const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    housingType: { type: String, trim: true, default: '' },
    hasOtherPets: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
    avatar: { type: String, default: null },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
    dateRegistered: { type: Date, default: Date.now },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
