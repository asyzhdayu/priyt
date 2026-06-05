const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    // Тип заявки — ОБЯЗАТЕЛЬНО для разделения усыновления и передачи
    type: {
      type: String,
      enum: ['adopt', 'surrender'],
      default: 'adopt',
    },
    petId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    petName:       { type: String, trim: true, default: '' },      // имя питомца (для surrender)

    // Контактные данные заявителя
    applicantName:  { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, trim: true },
    applicantPhone: { type: String, required: true, trim: true },

    // Поля для adopt
    address:      { type: String, trim: true, default: '' },
    housingType:  { type: String, trim: true, default: '' },
    hasChildren:  { type: Boolean, default: false },
    hasOtherPets: { type: Boolean, default: false },
    experience:   { type: String, trim: true, default: '' },
    message:      { type: String, trim: true, default: '' },

    // Поля для surrender
    reason:        { type: String, trim: true, default: '' },
    notifyOnAdopt: { type: Boolean, default: false },

    // Статус и комментарий сотрудника
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    staffComment:  { type: String, trim: true, default: '' },
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
applicationSchema.index({ type: 1 });

module.exports = mongoose.model('Application', applicationSchema);
