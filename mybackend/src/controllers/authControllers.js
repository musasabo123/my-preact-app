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
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phoneNumber, username, gender, password, level, department, university } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User_1.default.create({
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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ $or: [{ email: username }, { username }] });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            user.usageCount = (user.usageCount || 0) + 1;
            yield user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
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
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.user._id);
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
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
});
exports.getUserProfile = getUserProfile;
