import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  password: string;
  level: string;
  department: string;
  university: string;
  role: string;
  createdAt: Date;
  usageCount?: number;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: String, required: true },
  department: { type: String, required: true },
  university: { type: String, required: true },
  role: { type: String, default: 'user' },
  usageCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
