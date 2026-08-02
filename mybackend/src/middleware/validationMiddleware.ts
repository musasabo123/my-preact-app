import { Request, Response, NextFunction } from 'express';

const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, phoneNumber, username, gender, password, level, department, university } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !username || !gender || !password || !level || !department || !university) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const validGenders = ['male', 'female', 'other'];
  if (!validGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid gender value' });
  }

  next();
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  next();
};

const validateCGPACalculation = (req: Request, res: Response, next: NextFunction) => {
  const { courses } = req.body;

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ message: 'Courses array is required' });
  }

  for (const course of courses) {
    if (!course.code || !course.grade || typeof course.units !== 'number') {
      return res.status(400).json({ message: 'Each course must have code, grade, and units' });
    }
  }

  next();
};

export { validateRegistration, validateLogin, validateCGPACalculation };
