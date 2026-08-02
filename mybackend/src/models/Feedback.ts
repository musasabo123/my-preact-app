import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: string;
  username: string;
  message: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
