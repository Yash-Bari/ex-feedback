"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v.endsWith('@srttc.ac.in');
            },
            message: 'Email must be from srttc.ac.in domain'
        }
    },
    name: { type: String, required: true },
    googleId: { type: String, required: true, unique: true },
    picture: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', userSchema);
