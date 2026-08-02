"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCGPA = void 0;
// @desc    Calculate CGPA
// @route   POST /api/cgpa/calculate
// @access  Private
const calculateCGPA = (req, res) => {
    const { courses } = req.body; // Array of { code: string, grade: string, units: number }
    if (!courses || !Array.isArray(courses)) {
        return res.status(400).json({ message: 'Courses array is required' });
    }
    // Grade to point mapping (assuming 5.0 scale)
    const gradePoints = {
        'A': 5.0,
        'B': 4.0,
        'C': 3.0,
        'D': 2.0,
        'E': 1.0,
        'F': 0.0,
    };
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of courses) {
        const { grade, units } = course;
        if (!grade || !gradePoints[grade.toUpperCase()] || !units) {
            return res.status(400).json({ message: 'Invalid grade or units' });
        }
        totalPoints += gradePoints[grade.toUpperCase()] * units;
        totalCredits += units;
    }
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    res.json({ cgpa, totalCredits, totalPoints });
};
exports.calculateCGPA = calculateCGPA;
