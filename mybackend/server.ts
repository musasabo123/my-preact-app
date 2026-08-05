import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './src/routes/auth';
import cgpaRoutes from './src/routes/cgpa';
import userRoutes from './src/routes/User';

import resultRoutes from './src/routes/result';
import feedbackRoutes from './src/routes/feedback';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cgpa', cgpaRoutes);
app.use('/api/users', userRoutes);

app.use('/api/result', resultRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbReady = await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!dbReady) {
      console.log('Database connection is not available. Some API endpoints will not work until MongoDB is reachable.');
    }
  });
};

startServer();
