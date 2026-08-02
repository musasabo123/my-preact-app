"use strict";
// Script to recreate the admin user in your MongoDB database
// Usage: Run with `npx ts-node recreateAdmin.ts` in your mybackend folder
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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./src/models/User"));
dotenv_1.default.config();
const recreateAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URI);
    const email = 'mbsk102@gmail.com';
    const username = 'admin';
    const password = 'gwarzo1234';
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Remove any existing admin with this email or username
    yield User_1.default.deleteMany({ $or: [{ email }, { username }] });
    const admin = yield User_1.default.create({
        firstName: 'Admin',
        lastName: 'User',
        email,
        phoneNumber: '0000000000',
        username,
        gender: 'other',
        password: hashedPassword,
        level: 'admin',
        department: 'admin',
        university: 'admin',
        role: 'admin',
    });
    console.log('Admin user recreated:', admin.email);
    process.exit(0);
});
recreateAdmin();
