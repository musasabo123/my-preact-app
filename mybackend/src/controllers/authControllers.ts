import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, username, gender, password, level, department, university } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      gender,
      password: hashedPassword,
      level,
      department,
      university,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    });

    res.status(201).json({
      message: "Account created successfully!",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      level: user.level,
      department: user.department,
      university: user.university,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: username }, { username }] });

    if (user && (await bcrypt.compare(password, user.password))) {
     
      user.usageCount = (user.usageCount || 0) + 1;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
      });

      res.json({
        message: "Login successful",
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        level: user.level,
        department: user.department,
        university: user.university,
        role: user.role,
        usageCount: user.usageCount,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      message: "User profile fetched successfully",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      level: user.level,
      department: user.department,
      university: user.university,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export { registerUser, loginUser, getUserProfile };
