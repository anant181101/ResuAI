import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: { type: String, index: true, unique: true },
  plan: { type: String, enum: ['free','starter','pro'], default: 'free' },
  planExpiresAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
