"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cgpaControllers_1 = require("../controllers/cgpaControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = express_1.default.Router();
router.post('/calculate', authMiddleware_1.protect, validationMiddleware_1.validateCGPACalculation, cgpaControllers_1.calculateCGPA);
exports.default = router;
