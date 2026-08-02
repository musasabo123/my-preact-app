import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

// POST /api/feedback
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, username, message } = req.body;
    if (!userId || !username || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const feedback = await Feedback.create({ userId, username, message });
    res.status(201).json({ message: 'Feedback submitted!', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/feedback
export const getAllFeedback = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
