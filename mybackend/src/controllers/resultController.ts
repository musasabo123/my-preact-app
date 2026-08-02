import { Request, Response } from 'express';
import Result from '../models/Result';
import User from '../models/User'; // ✅ make sure to import User model

// Save a new result (Nigerian CGPA system)
const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

const saveResult = async (req: Request, res: Response) => {
  try {
    const { semester, gpa, courses } = req.body;
    // @ts-ignore
    const user = req.user;

    if (!user || !user._id || !semester || gpa == null || !courses || !Array.isArray(courses)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userId = user._id;

    // ✅ safely increment usageCount in the DB
    await User.findByIdAndUpdate(userId, { $inc: { usageCount: 1 } });

    // Fetch all previous results for this user
    const prevResults = await Result.find({ userId });

    // Gather all courses, grouped by semester
    let allCourses: Array<{ code: string; grade: string; units: number; semester: string }> = [];
    for (const r of prevResults) {
      if (Array.isArray(r.courses)) {
        for (const c of r.courses) {
          allCourses.push({ ...c, semester: r.semester });
        }
      }
    }

    // Add current courses with current semester
    for (const c of courses) {
      allCourses.push({ ...c, semester });
    }

    // Only count each course once per semester
    const uniqueCourses: Record<string, { grade: string; units: number }> = {};
    for (const c of allCourses) {
      const key = `${c.code}-${c.semester}`;
      uniqueCourses[key] = { grade: c.grade, units: c.units };
    }

    // Calculate cumulative grade points and units
    let totalPoints = 0;
    let totalUnits = 0;
    for (const key in uniqueCourses) {
      const c = uniqueCourses[key];
      if (c.grade && c.units > 0 && gradePoints[c.grade] !== undefined) {
        totalUnits += c.units;
        totalPoints += gradePoints[c.grade] * c.units;
      }
    }
    const cgpa = totalUnits > 0 ? totalPoints / totalUnits : 0;

    // Save result
    const result = await Result.create({ userId, semester, gpa, cgpa, courses });
    res.status(201).json({ message: 'Result saved', result });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all results for a user
const getResults = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    const results = await Result.find({ userId }).sort({ date: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { saveResult, getResults };
