"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = express_1.default.Router();
router.post('/register', validationMiddleware_1.validateRegistration, authControllers_1.registerUser);
router.post('/login', validationMiddleware_1.validateLogin, authControllers_1.loginUser);
router.get('/profile', authMiddleware_1.protect, authControllers_1.getUserProfile);
exports.default = router;
