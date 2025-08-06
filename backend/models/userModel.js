import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    deliveryAddress: {
      recipientName: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
      phoneNumber: {
        type: String,
        validate: {
          validator: function (v) {
            const cleaned = v.replace(/[^\d+]/g, '');
            return /^\+?\d{7,15}$/.test(cleaned);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
