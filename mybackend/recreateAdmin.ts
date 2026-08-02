// Script to recreate the admin user in your MongoDB database
// Usage: Run with `npx ts-node recreateAdmin.ts` in your mybackend folder

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const recreateAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const email = 'mbsk102@gmail.com';
  const username = 'admin';
  const password = 'gwarzo1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Remove any existing admin with this email or username
  await User.deleteMany({ $or: [{ email }, { username }] });

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email,
    phoneNumber: '0000000000',
    username,
    gender: 'other',
    password: hashedPassword,
    level: 'admin',
    department: 'admin',
    university: 'admin',
    role: 'admin',
  });

  console.log('Admin user recreated:', admin.email);
  process.exit(0);
};

recreateAdmin();
