// Script to create an admin user in your MongoDB database
// Usage: Run with `npx ts-node createAdmin.ts` in your mybackend folder

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const email = 'mbsk102@gmail.com';
  const password = 'gwarzo1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email,
    phoneNumber: '0000000000',
    username: 'admin',
    gender: 'other',
    password: hashedPassword,
    level: 'admin',
    department: 'admin',
    university: 'admin',
    role: 'admin',
  });

  console.log('Admin user created:', admin.email);
  process.exit(0);
};

createAdmin();
