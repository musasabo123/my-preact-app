"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resultController_1 = require("../controllers/resultController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Save a result
router.post('/save', authMiddleware_1.protect, resultController_1.saveResult);
// Get all results for a user
router.get('/user', authMiddleware_1.protect, resultController_1.getResults);
exports.default = router;
