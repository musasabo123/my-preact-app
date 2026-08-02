"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.saveResult = void 0;
const Result_1 = __importDefault(require("../models/Result"));
const User_1 = __importDefault(require("../models/User")); // ✅ make sure to import User model
// Save a new result (Nigerian CGPA system)
const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const saveResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semester, gpa, courses } = req.body;
        // @ts-ignore
        const user = req.user;
        if (!user || !user._id || !semester || gpa == null || !courses || !Array.isArray(courses)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const userId = user._id;
        // ✅ safely increment usageCount in the DB
        yield User_1.default.findByIdAndUpdate(userId, { $inc: { usageCount: 1 } });
        // Fetch all previous results for this user
        const prevResults = yield Result_1.default.find({ userId });
        // Gather all courses, grouped by semester
        let allCourses = [];
        for (const r of prevResults) {
            if (Array.isArray(r.courses)) {
                for (const c of r.courses) {
                    allCourses.push(Object.assign(Object.assign({}, c), { semester: r.semester }));
                }
            }
        }
        // Add current courses with current semester
        for (const c of courses) {
            allCourses.push(Object.assign(Object.assign({}, c), { semester }));
        }
        // Only count each course once per semester
        const uniqueCourses = {};
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
        const result = yield Result_1.default.create({ userId, semester, gpa, cgpa, courses });
        res.status(201).json({ message: 'Result saved', result });
    }
    catch (error) {
        console.error("Error saving result:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.saveResult = saveResult;
// Get all results for a user
const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }
        const results = yield Result_1.default.find({ userId }).sort({ date: -1 });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getResults = getResults;
