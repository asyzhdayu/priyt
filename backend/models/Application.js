const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Контактные данные из формы заявки
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, trim: true },
    applicantPhone: { type: String, required: true, trim: true },
    housingType: { type: String, trim: true, default: '' },
    hasChildren: { type: Boolean, default: false },
    hasOtherPets: { type: Boolean, default: false },
    experience: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    // Комментарий сотрудника при изменении статуса
    staffComment: { type: String, trim: true, default: '' },
    dateSubmitted: { type: Date, default: Date.now },
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

applicationSchema.index({ userId: 1 });
applicationSchema.index({ petId: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
