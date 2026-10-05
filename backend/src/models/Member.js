import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  membershipId: { type: String, required: true, unique: true, trim: true },
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);
