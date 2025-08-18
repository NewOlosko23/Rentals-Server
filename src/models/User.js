import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['buyer','agent','admin'], default: 'buyer' },
  verifiedAgent: { type: Boolean, default: false },
  avatarUrl: String,
}, { timestamps: true });

export default model('User', UserSchema);
