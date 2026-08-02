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
exports.getAllFeedback = exports.submitFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
// POST /api/feedback
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, username, message } = req.body;
        if (!userId || !username || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const feedback = yield Feedback_1.default.create({ userId, username, message });
        res.status(201).json({ message: 'Feedback submitted!', feedback });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.submitFeedback = submitFeedback;
// GET /api/feedback
const getAllFeedback = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield Feedback_1.default.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllFeedback = getAllFeedback;
